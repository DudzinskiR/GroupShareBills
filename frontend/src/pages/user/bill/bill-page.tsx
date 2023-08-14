import React from "react";

import SummaryBox from "./summary-box/summary-box";
import HistoryBox from "./history-box/history-box";

const BillPage = () => {
  return (
    <div className="flex lg:flex-row w-full flex-col gap-5 p-5">
      <SummaryBox />
      <HistoryBox />
    </div>
  );
};

export default BillPage;
