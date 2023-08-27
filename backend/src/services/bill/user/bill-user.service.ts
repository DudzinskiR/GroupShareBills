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
        amountPaid: parseFloat((userAmount[user.userID] || 0).toFixed(2)),
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

    const userRef = db.collection("users").doc(userID);
    const userData = (await userRef.get()).data() as User;

    if (!billData.users.some((user) => user.userID === userID)) {
      throw new UserNotFoundException();
    }

    const billBalance = new BillBalanceHelper(billData.users, billData.payment);
    const transactions = billBalance.getTransactions();
    const balance = billBalance.getBalance()[userID];
    const newPayments: Payment[] = [];

    if (transactions.length !== 0) {
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
    }

    if (newPayments.length > 0) {
      const payment = await billRef.update({
        payment: admin.firestore.FieldValue.arrayUnion(...newPayments),
      });
    }

    let newAdminID = billData.adminID;
    if (newAdminID === userID) {
      if (billData.users.length > 1) {
        if (billData.users[0].userID !== userID) {
          newAdminID = billData.users[0].userID;
        } else {
          newAdminID = billData.users[1].userID;
        }
      } else {
        newAdminID = "";
      }
    }

    const newUsers = billData.users.filter((user) => user.userID !== userID);
    await billRef.update({
      users: newUsers,
      adminID: newAdminID,
    });

    await userRef.update({
      billsID: userData.billsID.filter((bill) => bill !== billID),
    });

    return { status: "ok" };
  }
}

export default BillUserService;
