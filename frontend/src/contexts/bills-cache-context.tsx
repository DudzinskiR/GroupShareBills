import { ReactNode, createContext, useContext, useState } from "react";
import BillApi from "../pages/user/bill/bill-api";
import { UserData } from "../utils/models/user/user-data";
import { UsersCacheContext } from "./users-cache-context";
interface BillsCacheType {
  getUsersInBill: (id: string) => Promise<UserData[]>;
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

  const { getUser } = useContext(UsersCacheContext)!;

  const fetchedUsersInBill: { [key: string]: boolean } = {};

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
            const username = await getUser(item);

            resolve({
              id: item,
              username: username,
            });
          }),
        );
      }

      const newUsersData: UserData[] = await Promise.all(promiseTab);

      setUsersInBill((prev) => ({ ...prev, [id]: newUsersData }));

      return usersInBill[id];
    }
  };

  return (
    <BillsCacheContext.Provider value={{ getUsersInBill }}>
      {children}
    </BillsCacheContext.Provider>
  );
};

export default BillsCacheProvider;
