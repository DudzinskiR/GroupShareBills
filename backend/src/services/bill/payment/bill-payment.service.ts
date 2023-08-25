import InvalidValueException from "@exceptions/invalid-value.exception";
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

    const payments = billData.payment.reverse();
    const result: PaymentHistory[] = [];

    let date = "";

    for (const pay of payments) {
      const formattedDate = DateFormatter.ddMMyy(pay.time);
      if (formattedDate != date) {
        result.push({
          time: DateFormatter.toDate(formattedDate),
          payments: [{ ...pay, time: new Date(pay.time.seconds * 1000) }],
        });
        date = formattedDate;
      } else {
        result[result.length - 1].payments.push({
          ...pay,
          time: new Date(pay.time.seconds * 1000),
        });
      }
    }

    return result;
  }
}

export default BillPaymentService;
