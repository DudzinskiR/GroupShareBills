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
    await new Promise((r) => setTimeout(r, 500));

    const result: BillData[] = [];
    const billName = [
      "Wycieczka do zakopanego",
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
      });
    }
    return result;
  }

  static async getBillHistory(id: string): Promise<PaymentHistoryData[]> {
    const paymentHistory: PaymentHistoryData[] = [];
    const descriptionType = [
      "Jedzonko",
      "Uber",
      "EscapeRoom",
      "Naciągnięcie na hajs",
      "Czary mary katakumby",
      "Lot w kosmos",
      "Wycieczka na atlantyde",
      "Cisza relaks",
      "Jakaś bardzo długa losowa nazwa. Tak długa żeby zobaczyć czy się bedzie dobrze wyświetlać",
      "Najwidoczniej żeby wszystko sprawdzić muszę zrobić jeszcze dłuższą nazwę płatności. Nie wiem co tu mogę jeszcze napisać, to tylko napiszę że Izrael bezprawnie okupuje tereny należące do Palestyny ale opinia publiczna ma to w dupie i przyzwala na czystki etniczne",
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
    await new Promise((r) => setTimeout(r, 500));

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
      });
    }

    return newList;
  }

  static async getCurrencyInBill(id: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 500));

    const currency = ["€", "$", "£", "zł"];

    return currency[Math.floor(Math.random() * currency.length)];
  }

  static async postNewPayment(
    description: string,
    amount: number,
    users: CheckboxOption[],
  ): Promise<boolean> {
    const usersID = users.map<string>((item) => item.value);

    const msg = {
      description: description,
      amount: amount,
      users: usersID,
    };

    const json = JSON.stringify(msg, null, 2);

    alert(json);
    console.log(json);
    return true;
  }
}

export default BillApi;
