import Api from "../../../utils/api/api";
import { BillBalance } from "../../../utils/models/bill/bill-balance";

class BillApi extends Api {
  static async getBillBalance(id: string): Promise<BillBalance> {
    await new Promise((r) => setTimeout(r, 500));

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

    let data: BillBalance = {
      balance: 0,
      users: [],
    };

    const random = Math.floor(Math.random() * 3);

    // const random = 1;
    if (random === 1) {
      const userNumber = Math.floor(Math.random() * 8 + 2);
      // const userNumber = Math.floor(6);

      for (let i = 0; i < userNumber; i++) {
        const temp = Math.floor(Math.random() * 1000000 + 500) / 100;
        data.balance += temp;
        data.users.push({
          name: names[Math.floor(Math.random() * names.length)],
          id: `${i}`,
          balance: temp,
        });
      }
    } else if (random === 2) {
      const userNumber = Math.floor(Math.random() * 8 + 2);

      for (let i = 0; i < userNumber; i++) {
        const temp = -Math.floor(Math.random() * 1000000 + 500) / 100;
        data.balance += temp;
        data.users.push({
          name: names[Math.floor(Math.random() * names.length)],
          id: `${i}`,
          balance: temp,
        });
      }
    }

    return data;
  }
}

export default BillApi;
