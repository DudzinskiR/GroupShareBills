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

  public static async changeUsername(userID: string, newName: string) {
    await db.collection("users").doc(userID).update({ username: newName });
  }
}

export default UserService;
