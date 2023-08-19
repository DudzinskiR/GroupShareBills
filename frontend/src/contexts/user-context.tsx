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
  const fetchedBillList = useRef(false);

  const userIsAdmin = (billID: string) => {
    for (const item of billList) {
      if (item.id === billID) {
        if (item.isAdmin) {
          return true;
        }
      }
    }

    return false;
  };

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

  return (
    <UserCacheContext.Provider
      value={{
        getUserID,
        getBillList,
        addNewBill,
        userIsAdmin,
        disableAdminInBill,
      }}
    >
      {children}
    </UserCacheContext.Provider>
  );
};

export default UserCacheProvider;
