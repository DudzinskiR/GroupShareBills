import Api from "../api";

class UsersApi extends Api {
  static async getUser(id: string): Promise<string> {
    await super.get<string>(`user/${id}/name`);

    const names = [
      "Bardzo długa nazwa sprawdzająca działanie zawijania",
      "Robert",
      "Zenek",
      "Alfred",
      "Karolina",
      "Julia",
      "Mateusz",
      "Ola",
    ];
    return `${names[Math.floor(Math.random() * names.length)]} - ${id}`;
  }
}

export default UsersApi;
