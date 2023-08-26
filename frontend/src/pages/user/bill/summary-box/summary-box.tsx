import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Box from "../../../../components/box/box";
import Button, { Color } from "../../../../components/button/button";
import PieChart, {
  PieChartData,
} from "../../../../components/pie-chart/pie-chart";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";
import { BillBalance } from "../../../../utils/models/bill/bill-balance";
import shortenNumber from "../../../../utils/other/shortenNumber";
import BillApi from "../../../../utils/api/bill/bill-api";
import Username from "../../../../components/username/username";
import { useParams } from "react-router-dom";
import { UIContext } from "../../../../contexts/ui-context";

interface props {
  currency: string;
}

const SummaryBox = ({ currency }: props) => {
  const [chartSize, setChartSize] = useState(0);
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
  const [billBalanceData, setBillBalanceData] = useState<BillBalance>({
    balance: 0,
    users: [],
  });
  const [showAll, setShowAll] = useState(false);
  const [showNumber, setShowNumber] = useState(5);
  const { width } = useWindowDimensions();
  const { id } = useParams();

  const { openHandingOverMoney } = useContext(UIContext)!;

  useEffect(() => {
    if (!billBalanceData?.users) return;

    const pieData: PieChartData[] = [];

    for (const item of billBalanceData.users) {
      pieData.push({
        value: item.balance,
        label: item.id,
      });
    }

    setPieChartData(pieData);
  }, [billBalanceData]);

  useEffect(() => {
    const fetchBillBalance = async () => {
      try {
        const data = await BillApi.getBillBalance(id!);
        data.users.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
        setBillBalanceData(data);
      } catch (e) {}
    };

    fetchBillBalance();
    setShowNumber(5);
  }, [id]);

  useEffect(() => {
    if (width > 426) {
      setChartSize(250);
    } else {
      setChartSize(150);
    }
  }, [width]);

  const renderHandingOverButton = (
    userID: string,
    value: number,
    index: number,
  ) => {
    return (
      <div
        key={index}
        className="flex md:flex-row flex-col w-full items-center gap-3 justify-between"
      >
        <div className="flex flex-row bg-slate-100 w-full rounded-xl h-full items-center justify-between font-montserrat shadow">
          <div className="text-xl w-[200px] ml-3 truncate p-2">
            <Username id={userID} />
          </div>
          <div className="flex flex-row w-[100px] text-lg">
            <div>
              {shortenNumber(value)}
              {currency}
            </div>
          </div>
        </div>
        {value < 0 && (
          <Button
            text="Przekaz"
            color={Color.GREEN}
            className="w-full md:w-[150px] mb-5 md:mb-0"
            onClick={() => {
              const paymentCallback = () => {
                let newBill = { ...billBalanceData };

                let newUsers = [];
                for (const item of newBill?.users!) {
                  if (item.id !== userID) {
                    newUsers.push(item);
                  }
                }

                newBill.users = newUsers;
                setBillBalanceData(newBill);
              };

              openHandingOverMoney(
                "Przekazanie środków",
                Math.abs(value),
                paymentCallback,
                {
                  userID: userID,
                  username: "",
                  active: false,
                },
              );
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Box className="w-full" title="Podsumowanie">
        <div className="w-full flex justify-center flex-col items-center p-5">
          <div className="pb-8" style={{ width: `${chartSize}px` }}>
            <PieChart
              data={pieChartData}
              size={chartSize}
              minValue={0.05}
              maxNumber={showNumber}
              currency={currency}
              sum={billBalanceData.balance}
            />
          </div>

          <div className="w-full border my-5"></div>
          <div className="flex flex-col gap-3 w-full max-w-[500px] justify-center">
            {billBalanceData?.users
              .slice(
                0,
                showAll ? billBalanceData?.users.length : showNumber - 1,
              )
              .map((item, index) => {
                return renderHandingOverButton(item.id, item.balance, index);
              })}
          </div>
          {billBalanceData?.users.length! > showNumber - 1 && !showAll && (
            <div className="text-lg mt-3">
              <Button
                color={Color.PURPLE}
                text="Pokaż wszystkich"
                className="text-base"
                onClick={() => setShowAll(true)}
                leftIcon={<IoIosArrowDown />}
                rightIcon={<IoIosArrowDown />}
              />
            </div>
          )}
        </div>
      </Box>
    </div>
  );
};

export default SummaryBox;
