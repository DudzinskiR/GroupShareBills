import { ReactNode, createContext, useState } from "react";
import UserApi from "../utils/api/user/user-api";
interface UserCacheType {
  getUserID: () => Promise<string>;
}

interface UserCacheProviderProps {
  children: ReactNode;
}

export const UserCacheContext = createContext<UserCacheType | undefined>(
  undefined,
);

const UserCacheProvider: React.FC<UserCacheProviderProps> = ({ children }) => {
  const [userID, setUserID] = useState("");
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

  return (
    <UserCacheContext.Provider value={{ getUserID }}>
      {children}
    </UserCacheContext.Provider>
  );
};

export default UserCacheProvider;
