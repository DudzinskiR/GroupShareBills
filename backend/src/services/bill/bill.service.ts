import { Bill } from "interfaces/bill";
import { BillBalance } from "interfaces/billBalance";
import { Participant } from "interfaces/participant";
import { Transaction } from "interfaces/transaction";
import User from "interfaces/user";

import DatabaseException from "@exceptions/database-error.exception";
import admin, { db } from "@utils/firebase/firebase-config";
import BillBalanceHelper from "@utils/helper/bill-balance-helper";

class BillService {
  static async getBills(userID: string) {
    const userRef = db.collection("users").doc(userID);
    const userData = (await userRef.get()).data() as User;

    const result = [];

    for (const billID of userData.billsID) {
      const billRef = db.collection("bills").doc(billID);
      const billData = (await billRef.get()).data() as Bill;

      if (billData.isDelete) continue;

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

  static async changeBillSetting(billID: string, billName: string) {
    const billRef = db.collection("bills").doc(billID);

    billRef.update({
      billName: billName,
    });

    return { status: "ok" };
  }

  static async getBillBalance(
    billID: string,
    userID: string
  ): Promise<BillBalance> {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;

    const payments = billData.payment;

    const balanceHelper = new BillBalanceHelper(
      billData.users,
      billData.payment
    );

    const result: BillBalance = {
      balance: 0,
      users: [],
    };

    const balance = balanceHelper.getBalance();
    const transactions = balanceHelper.getTransactions();
    console.log(
      "🚀 ~ file: bill.service.ts:120 ~ BillService ~ transactions:",
      transactions
    );

    if (Math.abs(balance[userID]) > 0.01) result.balance = balance[userID];

    if (balance[userID] > 0) {
      for (const trans of transactions) {
        if (Math.abs(trans.amount) < 0.01) continue;

        if (trans.toUserID === userID) {
          result.users.push({
            id: trans.fromUserID,
            balance: parseFloat(Math.abs(trans.amount).toFixed(2)),
          });
        }
      }
    } else if (balance[userID] < 0) {
      for (const trans of transactions) {
        if (Math.abs(trans.amount) < 0.01) continue;

        if (trans.fromUserID === userID) {
          result.users.push({
            id: trans.toUserID,
            balance: parseFloat(trans.amount.toFixed(2)),
          });
        }
      }
    }
    return result;
  }
}

export default BillService;
