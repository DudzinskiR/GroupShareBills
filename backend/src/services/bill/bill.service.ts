import { Bill } from "interfaces/bill";
import { BillBalance } from "interfaces/billBalance";
import { Participant } from "interfaces/participant";
import { Transaction } from "interfaces/transaction";
import User from "interfaces/user";

import DatabaseException from "@exceptions/database-error.exception";
import admin, { db } from "@utils/firebase/firebase-config";
import BillBalanceHelper from "@utils/helper/bill-balance-helper";
import BillNotFoundException from "@exceptions/bill-not-found.exception";
import { buffer } from "stream/consumers";
import UserNotFoundException from "@exceptions/user-not-found.exception";

class BillService {
  static async getBills(userID: string) {
    const userRef = db.collection("users").doc(userID);
    const userData = (await userRef.get()).data() as User;

    const result = [];

    if (!userData.billsID) {
      return;
    }

    for (const billID of userData.billsID) {
      const billRef = db.collection("bills").doc(billID);
      const billData = (await billRef.get()).data() as Bill;

      if (billData.isDelete) continue;

      result.push({
        name: billData.billName,
        userNumber: billData.users?.length,
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
        request: [],
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

  static async getBillName(billID: string, userID: string) {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;

    if (!billData) {
      throw new BillNotFoundException();
    }

    if (billData.users) {
      if (billData.users.some((user) => user.userID === userID)) {
        throw new BillNotFoundException();
      }
    }
    return billData.billName;
  }

  static async sendRequest(billID: string, userID: string) {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;
    if (!billData) {
      throw new BillNotFoundException();
    }
    if (billData.users) {
      if (billData.users.some((user) => user.userID === userID)) {
        return;
      }
    }
    await billRef.update({
      request: [...(billData.request || []), userID],
    });
  }

  static async getRequests(billID: string) {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;

    const result = billData.request || [];

    return result;
  }

  static async acceptRequest(billID: string, userID: string) {
    const billRef = db.collection("bills").doc(billID);
    const userRef = db.collection("users").doc(userID);

    const billData = (await billRef.get()).data() as Bill;

    if (billData.request) {
      if (!billData.request.some((item) => item === userID)) {
        throw new UserNotFoundException();
      }
    }

    const newRequestList = billData.request.filter((item) => item !== userID);
    const newUserList = [...billData.users];
    newUserList.push({
      userID: userID,
      isActive: true,
    });

    billRef.update({ request: newRequestList, users: newUserList });
    userRef.update({
      billsID: admin.firestore.FieldValue.arrayUnion(billID),
    });
  }

  static async deleteRequest(billID: string, userID: string) {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;

    if (billData.request) {
      if (!billData.request.some((item) => item === userID)) {
        throw new UserNotFoundException();
      }
    }

    const newRequestList = billData.request.filter((item) => item !== userID);

    billRef.update({ request: newRequestList });
  }
}

export default BillService;
