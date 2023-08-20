import React, { useEffect, useState } from "react";
import UserLayout from "./layout/user-layout";
import LandingPage from "./pages/landing/landing-page";
import { firebaseAuth } from "./utils/firebase/firebase";

enum Status {
  NOT_LOGGED,
  LOGGED,
  UNKNOWN,
}

const App = () => {
  const [status, setStatus] = useState(Status.UNKNOWN);

  useEffect(() => {
    const unsubscribe = firebaseAuth().onAuthStateChanged((user) => {
      if (user) setStatus(Status.LOGGED);
      else setStatus(Status.NOT_LOGGED);
    });

    return () => unsubscribe();
  }, []);

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
