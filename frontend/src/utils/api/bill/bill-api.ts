import Api from "../api";
import { BillBalance } from "../../models/bill/bill-balance";
import {
  PaymentData,
  PaymentHistoryData,
} from "../../models/bill/payment-data";
import BillData from "../../models/bill/bill-data";
import { UserData } from "../../models/user/user-data";
import { CheckboxOption } from "../../../components/checkbox/checkbox";

class BillApi extends Api {
  static async getBillList(): Promise<BillData[]> {
    await super.get(`bill`);

    const result: BillData[] = [];
    const billName = [
      "wycieczka do zakopanego",
      "Wycieczka nad morze",
      "Impreza na Piotrkowskiej",
      "Zwykły rachunek",
      "Bardzo długa nazwa sprawdzająca czy tekst się dobrze wyświetla",
    ];

    for (let i = 0; i < Math.floor(Math.random() * 5 + 2); i++) {
      result.push({
        name: billName[Math.floor(Math.random() * billName.length)],
        userNumber: Math.floor(Math.random() * 5 + 2),
        id: `${i}`,
        isAdmin: Math.random() >= 0.5,
      });
    }
    return result;
  }

  static async getBillHistory(id: string): Promise<PaymentHistoryData[]> {
    await super.get(`bill/${id}/history`);

    const paymentHistory: PaymentHistoryData[] = [];
    const descriptionType = [
      "Jedzonko",
      "Uber",
      "EscapeRoom",
      "Mniejsze wydatki",
      "Czary mary katakumby",
      "Lot w kosmos",
      "Wycieczka na atlantyde",
      "Cisza relaks",
      "Jakaś bardzo długa losowa nazwa. Tak długa żeby zobaczyć czy się bedzie dobrze wyświetlać",
    ];

    for (let i = 0; i < Math.floor(Math.random() * 5 + 5); i++) {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() - i);

      const newPaymentList: PaymentData[] = [];

      for (let j = 0; j < Math.floor(Math.random() * 5 + 5); j++) {
        const newUsersID = [];
        for (let k = 0; k < Math.floor(Math.random() * 5 + 5); k++) {
          newUsersID.push(`${k}`);
        }
        newPaymentList.push({
          description:
            descriptionType[Math.floor(Math.random() * descriptionType.length)],
          value: Math.floor(Math.random() * 10000 + 500) / 100,
          date: newDate,
          creatorID: `${Math.floor(Math.random() * 3)}`,
          usersID: newUsersID,
          id: `${Math.random()}`,
        });
      }
      paymentHistory.push({
        date: newDate,
        payment: newPaymentList,
      });
    }

    return paymentHistory;
  }
  static async getBillBalance(id: string): Promise<BillBalance> {
    await super.get(`bill/${id}/balance`);

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

    let random = Math.floor(Math.random() * 3);

    if (random === 1) {
      const userNumber = Math.floor(Math.random() * 8 + 2);

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

  static async getUsersInBill(id: string): Promise<UserData[]> {
    await super.get(`bill/${id}/users`);

    const newList: UserData[] = [];

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

    for (let i = 0; i < Math.floor(Math.random() * 10 + 3); i++) {
      newList.push({
        id: `${i}`,
        username: names[Math.floor(Math.random() * names.length)],
        active: Math.random() > 0.5 ? true : false,
        amountPaid: Math.floor((Math.random() * 200000 + 50000) / 100),
      });
    }

    return newList;
  }

  static async getCurrencyInBill(id: string): Promise<string> {
    await super.get(`bill/${id}/currency`);

    const currency = ["€", "$", "£", "zł"];

    return currency[Math.floor(Math.random() * currency.length)];
  }

  static async postNewPayment(
    id: string,
    description: string,
    amount: number,
    users: CheckboxOption[],
  ): Promise<boolean> {
    await super.post(`bill/${id}/payment`, { description, amount, users });
    return true;
  }

  static async postNewBill(name: string, currency: string): Promise<string> {
    await super.post(`bill`, { name, currency });

    return Math.floor(Math.random() * 1000 + 100).toString();
  }

  static async deletePayment(paymentID: string, billID: string) {
    await super.delete(`bill/${billID}/${paymentID}`);
  }

  static async setUserActive(userID: string, billID: string, active: boolean) {
    await super.put(`bill/${billID}/user/${userID}`, { active });
  }

  static async setUserAsAdmin(userID: string, billID: string) {
    await super.put(`bill/${billID}/user/${userID}`, {});
  }

  static async deleteUserFromBill(userID: string, billID: string) {
    await super.delete(`bill/${billID}/user/${userID}`);
  }

  static async updateBillSetting(billID: string, name: string) {
    await super.put(`bill/${billID}/setting`, { name });
  }

  static async closeBill(billID: string) {
    await super.delete(`bill/${billID}`);
  }

  static async leaveBill(billID: string) {
    await super.delete(`user/bill/${billID}`);
  }
}

export default BillApi;
