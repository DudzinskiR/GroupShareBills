import UserNotFoundException from "@exceptions/user-not-found.exception";
import { db } from "@utils/firebase/firebase-config";
import { Bill } from "interfaces/bill";
import User from "interfaces/user";
import { UserInBill } from "interfaces/user-in-bill";

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
}

export default BillUserService;
