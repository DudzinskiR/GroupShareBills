import React from "react";

import SummaryBox from "./summary-box/summary-box";
import HistoryBox from "./history-box/history-box";
import Button from "../../../components/button/button";
import { AiOutlinePlus } from "react-icons/ai";
const BillPage = () => {
  return (
    <>
      <div className="flex lg:flex-row w-full flex-col gap-5 p-5">
        <SummaryBox />
        <HistoryBox />
      </div>
      <div className="fixed top-[85vh] right-[10vw]">
        <Button
          rounded
          centerIcon={<AiOutlinePlus />}
          className="h-16 w-16 text-3xl"
        />
      </div>
    </>
  );
};

export default BillPage;
