import React, { useContext, useEffect, useState } from "react";
import UserLayout from "./layout/user-layout";
import LandingPage from "./pages/landing/landing-page";
import { firebaseAuth } from "./utils/firebase/firebase";
import { AccountType, UserCacheContext } from "./contexts/user-context";

enum Status {
  NOT_LOGGED,
  LOGGED,
  UNKNOWN,
}

const App = () => {
  const [status, setStatus] = useState(Status.UNKNOWN);
  const { setAccountType } = useContext(UserCacheContext)!;

  useEffect(() => {
    const unsubscribe = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        const isGoogleProvider = user.providerData.some(
          (provider) => provider.providerId === "google.com",
        );

        setStatus(Status.LOGGED);
        setAccountType(
          isGoogleProvider ? AccountType.GOOGLE : AccountType.MAIL,
        );
      } else {
        setStatus(Status.NOT_LOGGED);
      }
    });

    return () => unsubscribe();
  }, [setAccountType]);

  switch (status) {
    case Status.LOGGED:
      return <UserLayout />;
    case Status.NOT_LOGGED:
      return <LandingPage />;
    case Status.UNKNOWN:
    default:
      return <></>;
  }
};

export default App;
