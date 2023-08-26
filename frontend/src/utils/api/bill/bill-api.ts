import Api from "../api";
import { BillBalance } from "../../models/bill/bill-balance";
import { PaymentHistoryData } from "../../models/bill/payment-data";
import BillData from "../../models/bill/bill-data";
import { UserData } from "../../models/user/user-data";
import { CheckboxOption } from "../../../components/checkbox/checkbox";

class BillApi extends Api {
  static async getBillList(): Promise<BillData[]> {
    let result: BillData[] | undefined;
    try {
      result = await super.get<BillData[]>(`bill`);
      if (!result) {
        result = [];
      }
    } catch (e) {}

    return result!;
  }

  static async getBillHistory(id: string): Promise<PaymentHistoryData[]> {
    let result: PaymentHistoryData[] | undefined;

    try {
      result = await super.get<PaymentHistoryData[]>(`bill/${id}/payment`);
      if (!result) {
        result = [];
      }
    } catch (e) {}

    return result!;
  }

  static async getBillBalance(id: string): Promise<BillBalance> {
    try {
      const result = await super.get<BillBalance>(`bill/${id}/balance`);
      return result!;
    } catch (e) {
      const result: BillBalance = {
        balance: 0,
        users: [],
      };
      return result;
    }
  }

  static async getUsersInBill(id: string): Promise<UserData[]> {
    try {
      const result = await super.get<UserData[]>(`bill/${id}/user`);
      return result!;
    } catch (e) {
      return [];
    }
  }

  static async getCurrencyInBill(id: string): Promise<string> {
    try {
      const response = await super.get<string>(`bill/${id}/currency`);
      return response!;
    } catch (e) {
      return "";
    }
  }

  static async postNewPayment(
    id: string,
    description: string,
    amount: number,
    users: CheckboxOption[],
  ): Promise<boolean> {
    const body = {
      description: description,
      amount: amount,
      usersID: users.map<string>((item) => {
        return item.value;
      }),
    };
    try {
      await super.post(`bill/${id}/payment`, body);
    } catch (e) {}

    return true;
  }

  static async postNewBill(name: string, currency: string): Promise<string> {
    try {
      const result = await super.post<string>("bill", {
        billName: name,
        currency: currency,
      });

      return result!;
    } catch (e) {
      return "";
    }
  }

  static async deletePayment(paymentID: string, billID: string) {
    try {
      await super.delete(`bill/${billID}/payment/${paymentID}`);
    } catch (e) {}
  }

  static async setUserActive(userID: string, billID: string, active: boolean) {
    try {
      await super.put(`/bill/${billID}/user/${userID}`, active);
    } catch (e) {}
  }

  static async setUserAsAdmin(userID: string, billID: string) {
    try {
      await super.put(`bill/${billID}/user/${userID}/admin`, {});
    } catch (e) {}
  }

  static async deleteUserFromBill(userID: string, billID: string) {
    //TODO: deleteUserFromBill
    // await super.delete(`bill/${billID}/user/${userID}`);
  }

  static async updateBillSetting(billID: string, name: string) {
    try {
      await super.put(`bill/${billID}/setting`, { billName: name });
    } catch (e) {}
  }

  static async closeBill(billID: string) {
    try {
      await super.delete(`bill/${billID}`);
    } catch (e) {}
  }

  static async leaveBill(billID: string) {
    //TODO: leaveBill
    // await super.delete(`user/bill/${billID}`);
  }
}

export default BillApi;
