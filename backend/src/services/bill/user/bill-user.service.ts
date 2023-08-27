import { Bill } from "interfaces/bill";
import User from "interfaces/user";
import { UserInBill } from "interfaces/user-in-bill";

import UserNotFoundException from "@exceptions/user-not-found.exception";
import admin, { db } from "@utils/firebase/firebase-config";
import BillBalanceHelper from "@utils/helper/bill-balance-helper";
import { Payment } from "interfaces/payment";

class BillUserService {
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
    let notFound = true;

    for (const item of newUsersList) {
      if (item.userID === userID) {
        item.isActive = active;
        notFound = false;
      }
    }

    if (notFound) {
      throw new UserNotFoundException();
    }

    await billRef.update({ users: newUsersList });

    return { status: "ok" };
  }

  static async getUsers(billID: string): Promise<UserInBill[]> {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;
    const userAmount: { [key: string]: number } = {};
    const result: UserInBill[] = [];

    if (billData.payment) {
      for (const payment of billData.payment) {
        if (userAmount[payment.creatorID]) {
          userAmount[payment.creatorID] += payment.value;
        } else {
          userAmount[payment.creatorID] = payment.value;
        }
      }
    }

    for (const user of billData.users) {
      const userRef = db.collection("users").doc(user.userID);
      const userDoc = await userRef.get();
      const userData = userDoc.data() as User;

      result.push({
        amountPaid: userAmount[user.userID] || 0,
        username: userData.username,
        active: user.isActive,
        userID: userDoc.id,
      });
    }

    return result;
  }

  static async deleteUser(billID: string, userID: string) {
    const billRef = db.collection("bills").doc(billID);
    const billData = (await billRef.get()).data() as Bill;

    if (!billData.users.some((user) => user.userID === userID)) {
      throw new UserNotFoundException();
    }

    //TODO Usunięcie użytkownika z rachunku

    //TODO Wyrównanie zależności użytkownika
    const billBalance = new BillBalanceHelper(billData.users, billData.payment);
    const transactions = billBalance.getTransactions();
    const balance = billBalance.getBalance()[userID];
    const newPayments: Payment[] = [];

    if (transactions.length === 0) {
      return { status: "ok" };
    }

    if (balance > 0) {
      for (const trans of transactions) {
        if (trans.toUserID === userID) {
          newPayments.push({
            description: `${trans.fromUserID} -> ${trans.toUserID}`,
            value: Math.abs(trans.amount),
            creatorID: trans.fromUserID,
            usersID: [trans.toUserID],
            time: admin.firestore.Timestamp.now(),
            isDelete: false,
            isHidden: true,
          });
        }
      }
    } else {
      for (const trans of transactions) {
        if (trans.fromUserID === userID) {
          newPayments.push({
            description: `${trans.fromUserID} -> ${trans.toUserID}`,
            value: Math.abs(trans.amount),
            creatorID: trans.fromUserID,
            usersID: [trans.toUserID],
            time: admin.firestore.Timestamp.now(),
            isDelete: false,
            isHidden: true,
          });
        }
      }
    }

    const payment = await billRef.update({
      payment: admin.firestore.FieldValue.arrayUnion(...newPayments),
    });

    return { status: "ok" };
  }
}

export default BillUserService;
