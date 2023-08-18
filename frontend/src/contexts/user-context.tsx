import { ReactNode, createContext, useState } from "react";
import UserApi from "../utils/api/user/user-api";
import BillData from "../utils/models/bill/bill-data";
import BillApi from "../utils/api/bill/bill-api";
interface UserCacheType {
  getUserID: () => Promise<string>;
  getBillList: () => Promise<BillData[]>;
  addNewBill: (id: string, name: string) => void;
}

interface UserCacheProviderProps {
  children: ReactNode;
}

export const UserCacheContext = createContext<UserCacheType | undefined>(
  undefined,
);

const UserCacheProvider: React.FC<UserCacheProviderProps> = ({ children }) => {
  const [userID, setUserID] = useState("");
  const [billList, setBillList] = useState<BillData[]>([]);
  let fetchedUserID = false;

  const getUserID = async () => {
    if (userID !== "" || fetchedUserID) {
      return userID;
    } else {
      fetchedUserID = true;

      const data = await UserApi.getUserID();
      setUserID(data);

      return data;
    }
  };

  const getBillList = async () => {
    if (billList.length > 0) {
      return billList;
    } else {
      const result = await BillApi.getBillList();
      setBillList(result);

      return result;
    }
  };

  const addNewBill = (id: string, name: string) => {
    setBillList((prev) => [...prev, { id, name, userNumber: 1 }]);
  };

  return (
    <UserCacheContext.Provider value={{ getUserID, getBillList, addNewBill }}>
      {children}
    </UserCacheContext.Provider>
  );
};

export default UserCacheProvider;
