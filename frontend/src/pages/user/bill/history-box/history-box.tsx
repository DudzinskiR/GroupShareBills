import React, { useEffect, useState } from "react";
import Box from "../../../../components/box/box";
import PaymentButton from "./payment-button";
import BillApi from "../bill-api";
import { PaymentHistoryData } from "../../../../utils/models/bill/payment-data";
import DateFormatter from "../../../../utils/date-formatter";

const HistoryBox = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryData[]>(
    [],
  );

  const [openID, setOpenID] = useState("");

  const renderDateSeparator = (date: Date) => {
    return (
      <div className="bg-slate-100 p-1 mx-3 rounded-xl shadow w-[100px] text-center font-semibold">
        {new DateFormatter(date).ddMMyyy()}
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await BillApi.getBillHistory("1");
      setPaymentHistory(data);
      console.log(data);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <Box className="w-full" title="Historia">
        <div className="flex flex-col gap-3 pb-3 h-[642px] overflow-auto">
          {paymentHistory.map((item, index) => {
            return (
              <div key={index}>
                {renderDateSeparator(item.date)}
                <div>
                  {item.payment.map((paymentItem, paymentIndex) => {
                    return (
                      <div key={paymentIndex} className="flex flex-col">
                        <div className="mt-3">
                          <PaymentButton
                            data={paymentItem}
                            isOpen={paymentItem.id === openID}
                            onClick={() =>
                              setOpenID(
                                paymentItem.id !== openID ? paymentItem.id : "",
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Box>
    </div>
  );
};

export default HistoryBox;
