import Api from "../api";

class UserApi extends Api {
  static async getUserID(): Promise<string> {
    try {
      const response = await super.get<string>(`user`);
      return response!;
    } catch (e) {
      return "error";
    }
  }
}

export default UserApi;
