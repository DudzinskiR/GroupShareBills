import Api from "../api";

class UserApi extends Api {
  static async getUserID(): Promise<string> {
    return `${Math.floor(Math.random() * 5)}`;
  }
}

export default UserApi;
