import React from "react";
import Box from "../../../components/box/box";
import PieChart, {
  PieChartData,
} from "../../../components/pie-chart/pie-chart";

const pieData: PieChartData[] = [
  { value: 9, label: "Albertaaaaaaaaaaaaa" },
  { value: 222, label: "Zenekaaaaaaaaaaaaaa" },
  { value: 44, label: "karolaaaaaaaaaaaaaaaaaaaa" },
  { value: 332, label: "Tomekaaaaaaaaaaaaaa" },
  { value: 122, label: "Twoja Staraaaaaaaaaaaaa" },
];

const Home = () => {
  return (
    <div className="flex flex-row w-full">
      <Box className="m-5 w-full h-[300px] flex justify-center p-5 pb-[1000px]">
        <PieChart data={pieData} size={300} minValue={0.05} />
      </Box>
    </div>
  );
};

export default Home;
