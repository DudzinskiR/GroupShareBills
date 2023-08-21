import { ReactNode, createContext, useState } from "react";
import UsersApi from "../utils/api/users/users-api";

interface UsersCacheType {
  getUser: (id: string) => Promise<string>;
  setUser: (id: string, name: string) => void;
  changeUsername: (id: string, name: string) => void;
}

interface CacheProviderProps {
  children: ReactNode;
}

export const UsersCacheContext = createContext<UsersCacheType | undefined>(
  undefined,
);

const UsersCacheProvider: React.FC<CacheProviderProps> = ({ children }) => {
  const [cache, setCache] = useState<{ [key: string]: string }>({});

  const fetchedData: { [key: string]: string } = {};

  const getUser = async (id: string) => {
    if (cache[id] || fetchedData[id]) {
      return cache[id];
    } else {
      setCache((prevCache) => ({ ...prevCache, [id]: "Ładowanie" }));
      fetchedData[id] = "Ładowanie";
      const data = await UsersApi.getUser(id);
      fetchedData[id] = data;
      setCache((prevCache) => ({ ...prevCache, [id]: data }));
      return data;
    }
  };

  const setUser = (id: string, name: string) => {
    if (!cache[id]) setCache((prev) => ({ ...prev, [id]: name }));
  };

  const changeUsername = (id: string, name: string) => {
    setCache((prev) => ({ ...prev, [id]: name }));
  };

  return (
    <UsersCacheContext.Provider value={{ getUser, setUser, changeUsername }}>
      {children}
    </UsersCacheContext.Provider>
  );
};

export default UsersCacheProvider;
