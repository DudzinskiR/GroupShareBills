import React, { useContext, useEffect, useState } from "react";

import SummaryBox from "./summary-box/summary-box";
import HistoryBox from "./history-box/history-box";
import Button from "../../../components/button/button";
import { AiOutlinePlus } from "react-icons/ai";

import NewPaymentBox from "./new-payment/new-payment-box";
import { UserData } from "../../../utils/models/user/user-data";
import { BillsCacheContext } from "../../../contexts/bills-cache-context";
import { useParams } from "react-router-dom";
import { PaymentHistoryData } from "../../../utils/models/bill/payment-data";
import { UIContext } from "../../../contexts/ui-context";
const BillPage = () => {
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [currency, setCurrency] = useState("");
  const [history, setHistory] = useState<PaymentHistoryData[]>([]);

  const { getUsersInBill, getCurrencyInBill, getHistoryInBill } =
    useContext(BillsCacheContext)!;

  const { isPaymentWindowOpen, setPaymentWindowOpen } = useContext(UIContext)!;

  const { id } = useParams();

  const closeNewPayment = () => {
    setPaymentWindowOpen(false);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setHistory(await getHistoryInBill(id!));
    };
    fetchHistory();
  }, [getHistoryInBill, id]);

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersList(await getUsersInBill(id!));
    };
    fetchUsers();
  }, [getUsersInBill, id]);

  useEffect(() => {
    const fetchData = async () => {
      setCurrency(await getCurrencyInBill(id!));
    };
    fetchData();
  }, [getCurrencyInBill, id]);

  return (
    <>
      <div className="flex lg:flex-row w-full flex-col gap-5 p-5">
        <SummaryBox currency={currency} />
        <HistoryBox
          usersList={usersList}
          currency={currency}
          paymentHistory={history}
        />
      </div>
      <div className="fixed top-[85vh] right-[10vw]">
        <Button
          rounded
          centerIcon={<AiOutlinePlus />}
          className="h-16 w-16 text-3xl"
          onClick={() => setPaymentWindowOpen(true)}
        />
      </div>
      <NewPaymentBox
        paymentIsOpen={isPaymentWindowOpen()}
        closeWindow={closeNewPayment}
        currency={currency}
        usersList={usersList}
      />
    </>
  );
};

export default BillPage;
