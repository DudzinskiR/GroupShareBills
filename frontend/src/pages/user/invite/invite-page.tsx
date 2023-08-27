import React, { useEffect, useState } from "react";
import Box from "../../../components/box/box";
import { useParams } from "react-router-dom";
import Button, { Color } from "../../../components/button/button";
import BillApi from "../../../utils/api/bill/bill-api";

enum ViewType {
  LOADING,
  INVITE,
  NOT_FOUND,
  WAITING,
}

const InvitePage = () => {
  const [viewType, setViewType] = useState(ViewType.LOADING);
  const [billName, setBillName] = useState("Nazwa rachunku");
  const { inviteID } = useParams();

  const acceptHandler = () => {
    BillApi.sendRequest(inviteID!).then((val) => {
      setViewType(ViewType.WAITING);
    });
  };

  useEffect(() => {
    BillApi.getBillName(inviteID!)
      .then((val) => {
        setBillName(val);
        setViewType(ViewType.INVITE);
      })
      .catch((e) => {
        setViewType(ViewType.NOT_FOUND);
      });
  }, [inviteID]);

  return (
    <div className="flex justify-center py-5">
      <Box title="Zaproszenie" className="w-11/12 md:w-[640px] duration-150">
        {viewType === ViewType.LOADING && (
          <div className="flex justify-center text-3xl font-semibold text-slate-700 my-10">
            Ładowanie
          </div>
        )}
        {viewType === ViewType.NOT_FOUND && (
          <div className="flex justify-center text-3xl font-semibold text-slate-700 my-10">
            Błędne zaproszenie
          </div>
        )}
        {viewType === ViewType.INVITE && (
          <div className="flex flex-col justify-center items-center w-full">
            <div className="text-xl">Czy chcesz dołączyć do rachunku:</div>
            <div className=" text-3xl font-semibold text-slate-900 mb-10 mt-5">
              {billName}
            </div>
            <Button
              text="Akceptuj"
              className="w-3/4 mb-8"
              color={Color.GREEN}
              onClick={acceptHandler}
            />
          </div>
        )}
        {viewType === ViewType.WAITING && (
          <div className="flex flex-col justify-center items-center w-full">
            <div className=" text-3xl font-semibold text-slate-900 my-10 text-center">
              Oczekiwanie na akceptacje przez zarządce rachunku
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default InvitePage;
