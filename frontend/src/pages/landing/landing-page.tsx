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
    <div className="lg:h-[100vh] mt-5">
      <div className="h-[100vh] w-[100vw] top-0 left-0 bg-gradient-to-b from-indigo-50 to-indigo-100 -z-20 fixed"></div>
      <div className="flex h-full lg:flex-row gap-5 lg:gap-0 p-5 lg:p-0 flex-col items-center justify-around">
        <div className="text-center">
          <div className="md:text-6xl text-3xl font-poppins underline text-blue-600">
            GroupShareBills
          </div>

          <div className="">
            <div className="md:text-3xl text-2xl font-semibold text-slate-800 mt-1">
              Daj nam rachunki, my damy Ci swobodę!
            </div>
            <div className="md:text-2xl text-xl mt-2">
              Rozliczenia z przyjaciółmi jeszcze nigdy
              <br /> nie były tak proste, przekonaj się sam!
            </div>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl flex justify-center py-5 relative md:w-[400px] w-11/12">
          <div className="bg-gradient-to-b from-indigo-100 to-indigo-200 w-[calc(30vw-100px)] h-[100vh] fixed top-0 right-0 -z-10 hidden lg:block"></div>
          {renderInsideBox()}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
