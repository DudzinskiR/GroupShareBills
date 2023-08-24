import UserNotFoundException from "@exceptions/user-not-found.exception";
import { db } from "@utils/firebase/firebase-config";

class UserService {
  static async getUsername(userID: string): Promise<string> {
    const username = (await db.collection(`users`).doc(userID).get()).data()
      ?.username;

    if (username) {
      return username;
    } else {
      throw new UserNotFoundException();
    }
  }

  private static async createUser(authID: string): Promise<string> {
    const response = await db.collection("users").add({
      authID: authID,
      username: `user-${authID.slice(0, 5)}`,
      billsID: [],
    });

    return response.id;
  }

  public static async changeUsername(userID: string, newName: string) {
    await db.collection("users").doc(userID).update({ username: newName });
  }
}

export default UserService;
