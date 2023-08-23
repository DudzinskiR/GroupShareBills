import { db } from "@utils/firebase/firebase-config";

class UserService {
  static async getUsername(userID: string): Promise<string> {
    const username = (await db.collection(`users`).doc(userID).get()).data()
      ?.username;

    // if (!username) {
    //   this.createNewUser();
    // }

    return username;
  }

  // static async createNewUser(): Promise<string> {
  //   await db.collection("users").doc().set({
  //     userID:
  //   });
  //   return "";
  // }
}

export default UserService;
