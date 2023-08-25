import BillNotFoundException from "@exceptions/bill-not-found.exception";
import DatabaseException from "@exceptions/database-error.exception";
import UserNotFoundException from "@exceptions/user-not-found.exception";
import admin, { db } from "@utils/firebase/firebase-config";
import { Bill } from "interfaces/bill";
import User from "interfaces/user";

class BillService {
  static async getBills(userID: string) {
    const userRef = db.collection("users").doc(userID);
    const userData = (await userRef.get()).data() as User;

    const result = [];

    for (const billID of userData.billsID) {
      const billRef = db.collection("bills").doc(billID);
      const billData = (await billRef.get()).data() as Bill;

      result.push({
        name: billData.billName,
        userNumber: billData.users.length,
        id: billID,
        isAdmin: billData.adminID === userID,
      });
    }

    return result;
  }

  static async createNewBill(
    userID: string,
    billName: string,
    currencyBill: string
  ) {
    try {
      const newBill: Bill = {
        billName: billName,
        currency: currencyBill,
        payment: [],
        adminID: userID,
        users: [
          {
            userID: userID,
            isActive: true,
          },
        ],
        isDelete: false,
      };

      const bill = await db.collection("bills").add(newBill);

      await db
        .collection("users")
        .doc(userID)
        .update({
          billsID: admin.firestore.FieldValue.arrayUnion(bill.id),
        });

      return bill.id;
    } catch (e) {
      throw new DatabaseException();
    }
  }

  static async editBill(billID: string, newName: string) {
    const result = await db
      .collection("bills")
      .doc(billID)
      .update({ billName: newName });
  }

  static async closeBill(billID: string) {
    const billRef = db.collection("bills").doc(billID);
    await billRef.update({ isDelete: true });
  }

  static async getCurrency(billID: string) {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;

    return billData.currency;
  }
}

export default BillService;
