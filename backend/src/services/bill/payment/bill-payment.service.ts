import InvalidValueException from "@exceptions/invalid-value.exception";
import PaymentNotFoundException from "@exceptions/payment-not-found.exception";
import DateFormatter from "@utils/date-formatter";
import admin, { db } from "@utils/firebase/firebase-config";
import { Bill } from "interfaces/bill";
import { PaymentHistory, PaymentResponse } from "interfaces/payment";

class BillPaymentService {
  static async createPayment(
    billID: string,
    userID: string,
    description: string,
    amount: number,
    usersID: string[]
  ) {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;
    for (const user of usersID) {
      let found = false;
      for (const userInBill of billData.users) {
        if (userInBill.userID === user) {
          found = true;
          break;
        }
      }
      if (!found) {
        throw new InvalidValueException();
      }
    }

    const payment = await billRef.update({
      payment: admin.firestore.FieldValue.arrayUnion({
        description: description,
        value: amount,
        usersID: usersID,
        creatorID: userID,
        time: admin.firestore.Timestamp.now(),
      }),
    });
  }

  static async getPayments(billID: string): Promise<PaymentHistory[]> {
    const billRef = db.collection("bills").doc(billID);

    const billData = (await billRef.get()).data() as Bill;

    if (!billData.payment) {
      return [];
    }

    const payments = billData.payment.reverse();
    const result: PaymentHistory[] = [];

    let date = "";

    for (const [index, pay] of payments.entries()) {
      const formattedDate = DateFormatter.ddMMyy(
        new Date(pay.time.seconds * 1000)
      );

      if (pay.isDelete) {
        continue;
      }

      if (formattedDate != date) {
        result.push({
          time: DateFormatter.toDate(formattedDate).getTime(),
          payments: [
            {
              ...pay,
              time: pay.time.seconds,
              id: `${payments.length - 1 - index}`,
            },
          ],
        });

        date = formattedDate;
      } else {
        result[result.length - 1].payments.push({
          ...pay,
          time: pay.time.seconds * 1000,
          id: `${payments.length - 1 - index}`,
        });
      }
    }
    return result;
  }

  static async deletePayment(billID: string, paymentID: string) {
    const billRef = db.collection("bills").doc(billID);
    const billDate = (await billRef.get()).data() as Bill;
    const paymentList = billDate.payment;

    const payment = paymentList[Number(paymentID)];

    if (!payment) {
      throw new PaymentNotFoundException();
    }

    payment.isDelete = true;

    billRef.update({ payment: [...paymentList] });
  }
}

export default BillPaymentService;
