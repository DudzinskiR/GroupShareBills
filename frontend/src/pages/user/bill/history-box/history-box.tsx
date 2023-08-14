import React from "react";
import Box from "../../../../components/box/box";
import PaymentButton from "./payment-button";

const HistoryBox = () => {
  return (
    <div className="w-full">
      <Box className="w-full" title="Historia">
        {/* {async () => await getUser("a")} */}
        <div className="flex flex-col gap-3 pb-3">
          <div className="bg-slate-100 p-1 mx-3 rounded-xl shadow w-[100px] text-center font-semibold">
            16-03-2023
          </div>
          <PaymentButton
            time="16-03-2023"
            description="Obiad na starówce"
            value={2137.69}
          />
          <PaymentButton
            time="16-03-2023"
            description="Obiad na starówce"
            value={2137.69}
          />
          <PaymentButton
            time="16-03-2023"
            description="Obiad na starówce"
            value={2137.69}
          />
          <PaymentButton
            time="16-03-2023"
            description="Obiad na starówce"
            value={2137.69}
          />
        </div>
      </Box>
    </div>
  );
};

export default HistoryBox;
