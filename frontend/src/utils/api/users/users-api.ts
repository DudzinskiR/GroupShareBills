import Api from "../api";

class UsersApi extends Api {
  static async getUser(id: string): Promise<string> {
    try {
      const response = await super.get<string>(`user/${id}`);
      return response!;
    } catch (e) {
      console.log(`error`);
      return "error";
    }
  }

  static async changeUsername(name: string) {
    try {
      await super.put("user/name", { username: name });
    } catch (e) {}
  }
}

export default UsersApi;
