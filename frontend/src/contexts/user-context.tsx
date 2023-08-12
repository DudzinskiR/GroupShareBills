import React, { useState } from "react";

interface props {
  children: React.ReactNode;
}

interface UserContextState {
  username: string;
  setUsername: (username: string) => void;
}

export const UserContext = React.createContext({
  username: "Robson",
  setUsername: (username: string) => {},
});

export const UserContextProvider = ({ children }: props) => {
  const setUsername = (value: string) => {
    setState({ ...state, username: value });
  };

  const initState: UserContextState = {
    username: "Robson Robert Dudziński",
    setUsername: setUsername,
  };

  const [state, setState] = useState(initState);

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
};
