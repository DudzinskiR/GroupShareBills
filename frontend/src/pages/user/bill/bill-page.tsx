import React, { useEffect, useState } from "react";
import Box from "../../../components/box/box";
import PieChart, {
  PieChartData,
} from "../../../components/pie-chart/pie-chart";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import Button, { Color } from "../../../components/button/button";
import BillApi from "./bill-api";
import { BillBalance } from "../../../utils/models/bill/bill-balance";
import { IoIosArrowDown } from "react-icons/io";
import shortenNumber from "../../../utils/shortenNumber";
const BillPage = () => {
  const [chartSize, setChartSize] = useState(0);
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
  const [billBalanceData, setBillBalanceData] = useState<BillBalance>();
  const [showAll, setShowAll] = useState(false);
  const [showNumber, setShowNumber] = useState(5);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width > 426) {
      setChartSize(250);
    } else {
      setChartSize(175);
    }
  }, [width]);

  useEffect(() => {
    if (!billBalanceData?.users) return;

    const pieData: PieChartData[] = [];

    for (const item of billBalanceData.users) {
      pieData.push({
        value: item.balance,
        label: item.name,
      });
    }

    setPieChartData(pieData);
  }, [billBalanceData]);

  useEffect(() => {
    const fetchBillBalance = async () => {
      try {
        const data = await BillApi.getBillBalance("1");
        data.users.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
        setBillBalanceData(data);
      } catch (e) {}
    };

    fetchBillBalance();
    setShowNumber(5);
  }, []);

  const renderHandingOverButton = (
    username: string,
    value: number,
    index: number,
  ) => {
    return (
      <div
        key={index}
        className="flex md:flex-row flex-col w-full items-center gap-3 justify-between"
      >
        <div className="flex flex-row bg-slate-100 w-full rounded-xl h-full items-center justify-between font-montserrat">
          <div className="text-xl w-[150px] ml-3 truncate p-2">{username}</div>
          <div className="flex flex-row w-[100px] text-lg">
            <div>{shortenNumber(value)} zł</div>
          </div>
        </div>
        {value < 0 && (
          <Button
            text="Przekaz"
            color={Color.GREEN}
            className="w-full md:w-[150px] mb-5 md:mb-0"
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex lg:flex-row w-full flex-col gap-5 p-5">
      <Box className="w-full" title="Podsumowanie">
        <div className="w-full flex justify-center flex-col items-center p-5">
          <div className="pb-8" style={{ width: `${chartSize}px` }}>
            <PieChart
              data={pieChartData}
              size={chartSize}
              minValue={0.05}
              maxNumber={showNumber}
              sum={pieChartData.reduce((sum, data) => sum + data.value, 0)}
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
                return renderHandingOverButton(item.name, item.balance, index);
              })}
          </div>
          {billBalanceData?.users.length! > showNumber - 1 && !showAll && (
            <div className="text-lg mt-3">
              <Button
                color={Color.PURPLE}
                text="Pokaż wszystkich"
                onClick={() => setShowAll(true)}
                leftIcon={<IoIosArrowDown />}
                rightIcon={<IoIosArrowDown />}
              />
            </div>
          )}
        </div>
      </Box>
      <Box className="w-full" title="Historia">
        {width}
      </Box>
    </div>
  );
};

export default BillPage;
