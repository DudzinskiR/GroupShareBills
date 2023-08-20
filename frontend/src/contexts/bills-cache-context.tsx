import { ReactNode, createContext, useContext, useState } from "react";
import BillApi from "../utils/api/bill/bill-api";
import { UserData } from "../utils/models/user/user-data";
import { UsersCacheContext } from "./users-cache-context";
import { PaymentHistoryData } from "../utils/models/bill/payment-data";
import DateFormatter from "../utils/other/date-formatter";
import { UserCacheContext } from "./user-context";
interface BillsCacheType {
  getUsersInBill: (id: string) => Promise<UserData[]>;
  getCurrencyInBill: (id: string) => Promise<string>;
  getHistoryInBill: (id: string) => Promise<PaymentHistoryData[]>;

  deletePaymentInBill: (date: Date, paymentID: string, billID: string) => void;

  addPaymentInBill: (
    id: string,
    description: string,
    amount: number,
    users: string[],
  ) => void;

  setUserActive: (userID: string, billID: string, active: boolean) => void;

  updateBillData: (billID: string, billName: string, currency: string) => void;
}

interface CacheProviderProps {
  children: ReactNode;
}

export const BillsCacheContext = createContext<BillsCacheType | undefined>(
  undefined,
);

const BillsCacheProvider: React.FC<CacheProviderProps> = ({ children }) => {
  const [usersInBill, setUsersInBill] = useState<{ [key: string]: UserData[] }>(
    {},
  );

  const [currencyInBill, setCurrencyInBill] = useState<{
    [key: string]: string;
  }>({});

  const [historyInBill, setHistoryInBill] = useState<{
    [key: string]: PaymentHistoryData[];
  }>({});

  const fetchedUsersInBill: { [key: string]: boolean } = {};
  const fetchedCurrencyInBill: { [key: string]: string } = {};

  const { setUser } = useContext(UsersCacheContext)!;
  const { getUserID } = useContext(UserCacheContext)!;

  const getCurrencyInBill = async (id: string) => {
    if (currencyInBill[id] || fetchedCurrencyInBill[id]) {
      return currencyInBill[id];
    } else {
      setCurrencyInBill((prev) => ({ ...prev, [id]: " " }));
      fetchedCurrencyInBill[id] = " ";

      const currency = await BillApi.getCurrencyInBill(id);

      setCurrencyInBill((prev) => ({ ...prev, [id]: currency }));
      fetchedCurrencyInBill[id] = currency;

      return currencyInBill[id];
    }
  };

  const getUsersInBill = async (id: string) => {
    if (usersInBill[id] || fetchedUsersInBill[id]) {
      return usersInBill[id];
    } else {
      setUsersInBill((prev) => ({ ...prev, [id]: [] }));
      fetchedUsersInBill[id] = true;

      const usersID = await BillApi.getUsersInBill(id);

      const promiseTab: Promise<UserData>[] = [];

      for (const item of usersID) {
        promiseTab.push(
          new Promise(async (resolve, rejects) => {
            setUser(item.id, `${item.username}`);
            resolve(item);
          }),
        );
      }

      const newUsersData: UserData[] = await Promise.all(promiseTab);

      setUsersInBill((prev) => ({ ...prev, [id]: newUsersData }));

      return usersInBill[id];
    }
  };

  const getHistoryInBill = async (id: string) => {
    if (historyInBill[id]) {
      return historyInBill[id];
    } else {
      setHistoryInBill((prev) => ({ ...prev, [id]: [] }));

      const data = await BillApi.getBillHistory(id);

      setHistoryInBill((prev) => ({ ...prev, [id]: data }));

      return historyInBill[id];
    }
  };

  const addPaymentInBill = async (
    id: string,
    description: string,
    amount: number,
    users: string[],
  ) => {
    const bill = historyInBill[id];
    for (const day of bill) {
      if (
        new DateFormatter(day.date).ddMMyyy ===
        new DateFormatter(new Date()).ddMMyyy
      ) {
        day.payment = [
          {
            description: description,
            value: amount,
            date: new Date(),
            creatorID: await getUserID(),
            usersID: users,
            id: Math.random() + "",
          },
          ...day.payment,
        ];
      }
    }

    setHistoryInBill((prev) => ({ ...prev, [id]: [...bill] }));
  };

  const deletePaymentInBill = async (
    date: Date,
    paymentID: string,
    billID: string,
  ) => {
    const bill = historyInBill[billID];

    for (const day of bill) {
      if (
        new DateFormatter(day.date).ddMMyyy ===
        new DateFormatter(new Date()).ddMMyyy
      ) {
        day.payment = day.payment.filter((item) => {
          return item.id !== paymentID;
        });
      }
    }

    setHistoryInBill((prev) => ({ ...prev, [billID]: [...bill] }));
  };

  const setUserActive = async (
    userID: string,
    billID: string,
    active: boolean,
  ) => {
    const users = usersInBill[billID];

    for (const item of users) {
      if (item.id === userID) {
        item.active = active;
      }
    }

    setUsersInBill((prev) => ({ ...prev, [billID]: [...users] }));
  };

  const updateBillData = (
    billID: string,
    billName: string,
    currency: string,
  ) => {
    setCurrencyInBill((prev) => ({ ...prev, [billID]: currency }));
  };

  return (
    <BillsCacheContext.Provider
      value={{
        getUsersInBill,
        getCurrencyInBill,
        getHistoryInBill,
        addPaymentInBill,
        deletePaymentInBill,
        setUserActive,
        updateBillData,
      }}
    >
      {children}
    </BillsCacheContext.Provider>
  );
};

export default BillsCacheProvider;
