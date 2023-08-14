import { ReactNode, createContext, useState } from "react";
import UsersApi from "../utils/api/users/users-api";

interface UsersCacheType {
  getUser: (id: string) => Promise<string>;
}

interface CacheProviderProps {
  children: ReactNode;
}

export const UsersCacheContext = createContext<UsersCacheType | undefined>(
  undefined,
);

const UsersCacheProvider: React.FC<CacheProviderProps> = ({ children }) => {
  const [cache, setCache] = useState<{ [key: string]: string }>({});

  const fetchedData: { [key: string]: boolean } = {};

  const getUser = async (id: string) => {
    if (cache[id] || fetchedData[id]) {
      return cache[id];
    } else {
      setCache((prevCache) => ({ ...prevCache, [id]: "Ładowanie" }));
      fetchedData[id] = true;
      const data = await UsersApi.getUser(id);

      setCache((prevCache) => ({ ...prevCache, [id]: data }));
      return cache[id];
    }
  };

  return (
    <UsersCacheContext.Provider value={{ getUser }}>
      {children}
    </UsersCacheContext.Provider>
  );
};

export default UsersCacheProvider;
