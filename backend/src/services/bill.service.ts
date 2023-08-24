import BillNotFoundException from "@exceptions/bill-not-found.exception";
import DatabaseException from "@exceptions/database-error.exception";
import UserNotFoundException from "@exceptions/user-not-found.exception";
import admin, { db } from "@utils/firebase/firebase-config";
import { Bill } from "types/bill";

class BillService {
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

  static async setUserAsAdmin(userID: string, billID: string) {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;

    if (billData.users.some((user) => user.userID === userID)) {
      billRef.update({ adminID: userID });
    } else {
      throw new UserNotFoundException();
    }
  }

  static async setUserActive(userID: string, billID: string, active: boolean) {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;
    const newUsersList = [...billData.users];

    for (const item of newUsersList) {
      if (item.userID === userID) {
        item.isActive = active;
      }
    }

    await billRef.update({ users: newUsersList });
  }
}

export default BillService;
