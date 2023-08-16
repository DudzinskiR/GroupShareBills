import Api from "../api";

class UsersApi extends Api {
  static async getUser(id: string): Promise<string> {
    await new Promise((r) => setTimeout(r, Math.random() * 2000 + 500));
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
