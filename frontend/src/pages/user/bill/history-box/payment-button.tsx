import React from "react";
import Button, { Color } from "../../../../components/button/button";
import shortenNumber from "../../../../utils/shortenNumber";
import { PaymentData } from "../../../../utils/models/bill/payment-data";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import DateFormatter from "../../../../utils/date-formatter";
import Username from "../../../../components/username/username";
interface props {
  data: PaymentData;
  isOpen: boolean;
  onClick: () => void;
}

const PaymentButton = ({ data, isOpen, onClick }: props) => {
  const renderUsersNumber = (num: number) => {
    let text = "";

    if (num <= 0) {
      text = `nikt`;
    } else if (num === 1) {
      text = `1 osoba`;
    } else if (num <= 4) {
      text = `${num} osoby`;
    } else {
      text = `${num} osób`;
    }
    return text;
  };

  const renderValue = () => {
    return (
      <div>
        <div className="font-semibold text-slate-800 text-sm">Kwota</div>
        <div className="text-xl">{data.value}zł</div>
      </div>
    );
  };

  const renderDate = () => {
    return (
      <div>
        <div className="font-semibold text-slate-800 text-sm">Czas</div>
        <div className="text-xl">
          {new DateFormatter(data.date).ddMMyyyHHmm()}
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    return (
      <div>
        <div className="font-semibold text-slate-800 text-sm">Dla:</div>
        <div className="text-xl">
          {data.usersID.map((item, index) => {
            return (
              <div key={index}>
                <Username id={item} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCreator = () => {
    return (
      <div>
        <div className="font-semibold text-slate-800 text-sm">
          Utworzone przez:
        </div>
        <div className="text-xl truncate max-w-[200px]">
          <Username id={data.creatorID} />
        </div>
      </div>
    );
  };

  const renderDescription = () => {
    return (
      <div className="w-full">
        <div className="font-semibold text-slate-800 text-sm">Pełny opis</div>
        <div className="text-xl">{data.description}</div>
      </div>
    );
  };

  const renderWindow = () => {
    return (
      <div
        className="w-11/12 bg-slate-100 duration-300 rounded-b-lg overflow-hidden"
        style={{
          maxHeight: `${isOpen ? 500 : 0}px`,
          opacity: `${isOpen ? 100 : 0}`,
        }}
      >
        <div
          className={`${
            isOpen ? "" : "select-none"
          } w-full h-full p-3 flex flex-col gap-4`}
        >
          {renderDescription()}
          <div className="grid grid-cols-2">
            {renderValue()}
            {renderDate()}
          </div>

          <div className="grid grid-cols-2">
            {renderUsers()}
            {renderCreator()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`${
          isOpen ? "bg-slate-200" : "bg-slate-50 hover:bg-slate-100"
        } flex flex-row justify-between h-[50px]  p-1 mx-3 rounded-xl shadow cursor-pointer duration-150 relative z-1`}
        onClick={onClick}
      >
        <div className="flex flex-row items-center md:pl-3 pl-1">
          <div className="md:text-lg text-base font-semibold text-slate-800 md:max-w-[300px] sm:max-w-[250px] max-w-[150px] truncate">
            {data.description}
          </div>
          <div className="text-md italic pl-3 md:block hidden text-slate-700">
            ({renderUsersNumber(data.usersID.length)})
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="mr-3 text-lg font-semibold">
            {shortenNumber(data.value)}zł
          </div>

          <Button
            color={Color.BLUE}
            centerIcon={isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            rounded
            className="w-[30px] h-[30px]"
          />
        </div>
      </div>
      <div className="w-full flex justify-center">{renderWindow()}</div>
    </>
  );
};

export default PaymentButton;
