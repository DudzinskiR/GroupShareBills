import React from "react";
import Button, { Color } from "../../../../components/button/button";
import shortenNumber from "../../../../utils/shortenNumber";

interface props {
  time: string;
  description: string;
  value: number;
}

const PaymentButton = ({ time, description, value }: props) => {
  return (
    <div className=" flex flex-row justify-between bg-slate-50 h-[50px] hover:bg-slate-100 p-1 mx-3 rounded-xl shadow cursor-pointer">
      <div className="flex flex-row items-center md:pl-3 pl-1">
        <div className="md:text-lg text-base md:max-w-[300px] sm:max-w-[250px] max-w-[180px] truncate">
          {description}
        </div>
        <div className="text-md italic pl-3 md:block hidden">(4 osoby)</div>
      </div>
      <div className="flex flex-row items-center">
        <div className="mr-3 text-lg font-semibold">
          {shortenNumber(value)}zł
        </div>
        <Button color={Color.BLUE} text="Więcej" className="md:block hidden" />
      </div>
    </div>
  );
};

export default PaymentButton;
