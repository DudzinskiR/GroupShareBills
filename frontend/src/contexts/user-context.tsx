import { ReactNode, createContext, useRef, useState } from "react";
import UserApi from "../utils/api/user/user-api";
import BillData from "../utils/models/bill/bill-data";
import BillApi from "../utils/api/bill/bill-api";
interface UserCacheType {
  getUserID: () => Promise<string>;
  getBillList: () => Promise<BillData[]>;
  addNewBill: (id: string, name: string) => void;
  userIsAdmin: (billID: string) => boolean;
  disableAdminInBill: (billID: string) => void;
  removeBillFromList: (billID: string) => void;
  clearData: () => void;
  getAccountType: () => AccountType;
  setAccountType: (type: AccountType) => void;
  changeBillName: (billID: string, billName: string) => void;
}

interface UserCacheProviderProps {
  children: ReactNode;
}

export enum AccountType {
  UNKNOWN,
  GOOGLE,
  MAIL,
}

export const UserCacheContext = createContext<UserCacheType | undefined>(
  undefined,
);

const UserCacheProvider: React.FC<UserCacheProviderProps> = ({ children }) => {
  const [userID, setUserID] = useState("");
  const [billList, setBillList] = useState<BillData[]>([]);
  const fetchedUserID = useRef(false);
  const fetchedBillList = useRef(false);
  const [type, setType] = useState(AccountType.UNKNOWN);

  const userIsAdmin = (billID: string) => {
    for (const item of billList) {
      if (item.id === billID) {
        return item.isAdmin;
      }
    }

    return false;
  };

  const getUserID = async () => {
    if (userID !== "" || fetchedUserID.current) {
      return userID;
    } else {
      fetchedUserID.current = true;

      const data = await UserApi.getUserID();
      setUserID(data);

      return data;
    }
  };

  const getBillList = async () => {
    if (fetchedBillList.current) {
      return billList;
    } else {
      fetchedBillList.current = true;

      const result = await BillApi.getBillList();
      setBillList(result);
      return result;
    }
  };

  const addNewBill = (id: string, name: string) => {
    setBillList((prev) => [
      ...prev,
      { id, name, userNumber: 1, isAdmin: true },
    ]);
  };

  const disableAdminInBill = (billID: string) => {
    for (const item of billList) {
      if (item.id === billID) {
        item.isAdmin = false;
      }
    }

    setBillList([...billList]);
  };

  const removeBillFromList = (billID: string) => {
    setBillList((prev) => prev.filter((item) => item.id !== billID));
  };

  const changeBillName = (billID: string, billName: string) => {
    setBillList((prev) => {
      for (const item of prev) {
        if (item.id === billID) {
          item.name = billName;
        }
      }
      return prev;
    });
  };

  const clearData = () => {
    fetchedBillList.current = false;
    fetchedUserID.current = false;
    setBillList([]);
    setUserID("");
  };

  const getAccountType = (): AccountType => {
    return type;
  };

  const setAccountType = (type: AccountType) => {
    setType(type);
  };

  return (
    <UserCacheContext.Provider
      value={{
        getUserID,
        getBillList,
        addNewBill,
        userIsAdmin,
        disableAdminInBill,
        removeBillFromList,
        clearData,
        getAccountType,
        setAccountType,
        changeBillName,
      }}
    >
      {children}
    </UserCacheContext.Provider>
  );
};

export default UserCacheProvider;
