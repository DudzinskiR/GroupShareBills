import { ReactNode, createContext, useState } from "react";
import { UserData } from "../utils/models/user/user-data";

interface UIType {
  setPaymentWindowOpen: (val: boolean) => void;
  isPaymentWindowOpen: () => boolean;

  setNavMenuOpen: (val: boolean) => void;
  isNavMenuOpen: () => boolean;

  setNewBillOpen: (val: boolean) => void;
  isNewBillOpen: () => boolean;

  setConfirmOpen: (val: boolean) => void;
  isConfirmOpen: () => boolean;
  openConfirmBox: (text: string, callback: () => void) => void;
  getConfirmText: () => string;
  getConfirmCallback: () => () => void;

  setHandingOverCallback: (
    paymentCallback: (
      description: string,
      amount: number,
      paymentCallback: () => void,
      user: UserData,
    ) => void,
  ) => void;

  openHandingOverMoney: (
    description: string,
    amount: number,
    callback: () => void,
    user: UserData,
  ) => void;
}

interface UIProviderProps {
  children: ReactNode;
}

export const UIContext = createContext<UIType | undefined>(undefined);

const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [showPaymentWindow, setShowPaymentWindow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNewBill, setShowNewBill] = useState(false);
  const [showConfirm, setConfirm] = useState(false);

  const [confirmText, setConfirmText] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {});

  let paymentCallback: (
    description: string,
    amount: number,
    callback: () => void,
    user: UserData,
  ) => void = (
    description: string,
    amount: number,
    callback: () => void,
    user: UserData,
  ) => {};

  const setConfirmOpen = (val: boolean) => {
    setConfirm(val);
  };

  const isConfirmOpen = (): boolean => {
    return showConfirm;
  };

  const openConfirmBox = (text: string, callback: () => void) => {
    setConfirmOpen(true);
    setConfirmText(text);
    setConfirmCallback(() => {
      return () => {
        callback();
        setConfirmOpen(false);
      };
    });
  };

  const getConfirmText = () => {
    return confirmText;
  };

  const getConfirmCallback = () => {
    return confirmCallback;
  };

  const setNewBillOpen = (val: boolean) => {
    setShowNewBill(val);
  };

  const isNewBillOpen = (): boolean => {
    return showNewBill;
  };

  const setPaymentWindowOpen = (val: boolean) => {
    setShowPaymentWindow(val);
  };

  const isPaymentWindowOpen = (): boolean => {
    return showPaymentWindow;
  };

  const setNavMenuOpen = (val: boolean) => {
    setShowMenu(val);
  };

  const isNavMenuOpen = (): boolean => {
    return showMenu;
  };

  const setHandingOverCallback = (
    callback: (
      description: string,
      amount: number,
      callback: () => void,
      user: UserData,
    ) => void,
  ) => {
    paymentCallback = callback;
  };

  const openHandingOverMoney = (
    description: string,
    amount: number,
    callback: () => void,
    user: UserData,
  ) => {
    setShowPaymentWindow(true);
    paymentCallback(description, amount, callback, user);
  };

  return (
    <UIContext.Provider
      value={{
        setPaymentWindowOpen,
        isPaymentWindowOpen,
        setNavMenuOpen,
        isNavMenuOpen,
        setHandingOverCallback,
        openHandingOverMoney,
        setNewBillOpen,
        isNewBillOpen,
        setConfirmOpen,
        isConfirmOpen,
        openConfirmBox,
        getConfirmText,
        getConfirmCallback,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export default UIProvider;
