import React, { useState } from "react";
import LoginBox from "./login-box";
import SignUpBox from "./sign-up-box";
import ForgottenPasswordBox from "./forgotten-password-box";

enum PageView {
  SIGN_IN,
  SIGN_UP,
  FORGOTTEN_PASSWORD,
}

const LandingPage = () => {
  const [pageType, setPageType] = useState<PageView>(PageView.SIGN_IN);

  const toggleViewType = () => {
    if (pageType === PageView.SIGN_IN) setPageType(PageView.SIGN_UP);
    else if (pageType === PageView.SIGN_UP) setPageType(PageView.SIGN_IN);
  };

  const openForgottenBox = () => {
    setPageType(PageView.FORGOTTEN_PASSWORD);
  };

  const renderInsideBox = () => {
    switch (pageType) {
      case PageView.SIGN_IN:
        return (
          <LoginBox
            toggleView={toggleViewType}
            openForgottenBox={openForgottenBox}
          />
        );
      case PageView.SIGN_UP:
        return <SignUpBox toggleView={toggleViewType} />;
      case PageView.FORGOTTEN_PASSWORD:
        return (
          <ForgottenPasswordBox
            switchView={() => setPageType(PageView.SIGN_IN)}
          />
        );
    }
  };

  return (
    <div className="fixed h-[100vh] w-[100vw] bg-gradient-to-b from-indigo-50 to-indigo-100">
      <div className="fixed h-[100vh] w-[30vw] right-0 bg-gradient-to-b from-indigo-100 to-indigo-200"></div>

      <div className="text-center top-[50%] -translate-y-1/2 left-[100px] w-[600px] absolute">
        <div className="text-6xl font-poppins underline text-blue-600">
          GroupShareBills
        </div>

        <div className="">
          <div className="text-3xl">Daj nam rachunki, my damy Ci swobodę!</div>
          <div className="text-2xl mt-2">
            Rozliczenia z przyjaciółmi jeszcze nigdy
            <br /> nie były tak proste, przekonaj się sam!
          </div>
        </div>
      </div>

      <div className="bg-white w-[500px] absolute right-[30%] translate-x-1/2 top-[50%] -translate-y-1/2 shadow-2xl rounded-2xl flex justify-center py-10">
        {renderInsideBox()}
      </div>
    </div>
  );
};

export default LandingPage;
