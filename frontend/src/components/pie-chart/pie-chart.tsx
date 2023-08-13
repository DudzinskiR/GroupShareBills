import React, { useEffect, useState } from "react";
import { couldStartTrivia } from "typescript";

interface props {
  data: PieChartData[];
  maxNumber?: number;
  size?: number;
  minValue?: number;
}

export interface PieChartData {
  value: number;
  label: string;
}

interface valueData {
  value: number;
  label: string;
  percentage: number;
}

const compareValueData = (a: valueData, b: valueData) => {
  if (a.percentage < b.percentage) return -1;
  else if (a.percentage > b.percentage) return 1;
  return 0;
};

const chartColors = [
  "bg-gradient-to-r from-sky-500 to-indigo-500",
  "bg-gradient-to-r from-lime-500 to-lime-600",
  "bg-gradient-to-r from-indigo-500 to-indigo-600",
  "bg-gradient-to-r from-yellow-300 to-yellow-400",
  "bg-gradient-to-r from-orange-400 to-orange-500",
  "bg-gradient-to-r from-green-500 to-green-600",
  "bg-gradient-to-r from-violet-600 to-violet-700",
];

const pointCoordinates = [
  "100% 0%",
  "100% 50%",
  "100% 100%",
  "50% 100%",
  "0% 100%",
  "0% 50%",
  "0% 0%",
];

const PieChart = ({
  data,
  maxNumber = 5,
  size = 220,
  minValue = 0.1,
}: props) => {
  const [valueData, setValueData] = useState<valueData[]>([]);

  let currentAngle = 0;
  let currentLabelAngle = 0;

  useEffect(() => {
    const sum = data.reduce(
      (acc: number, cur: PieChartData) => acc + cur.value,
      0,
    );

    if (sum === 0) return;

    let newValueData: valueData[] = [];

    for (let item of data) {
      newValueData.push({
        value: item.value,
        label: item.label,
        percentage: item.value / sum,
      });
    }

    newValueData.sort(compareValueData).reverse();

    const sumOtherValues = newValueData
      .slice(maxNumber - 1)
      .reduce((sum, data) => sum + data.value, 0);

    if (newValueData.length > 4) {
      newValueData = [
        ...newValueData.slice(0, 4),
        {
          value: sumOtherValues,
          label: "Inni",
          percentage: sumOtherValues / sum,
        },
      ];
    }
    let additionalPercentage = 0;

    for (const item of newValueData) {
      if (item.percentage < minValue) {
        additionalPercentage += minValue - item.percentage;
        item.percentage = minValue;
      }
    }

    for (const item of newValueData) {
      if (item.percentage > minValue) {
        item.percentage -= (item.percentage / sum) * additionalPercentage;
      }
    }

    console.log(additionalPercentage);

    setValueData(newValueData);
    console.log(newValueData);
  }, [data, maxNumber, minValue]);

  return (
    <div
      className={`flex justify-center relative z-0`}
      style={{
        height: `${size * 1.05}px`,
        width: `${size * 1.05}px`,
      }}
    >
      {valueData.map((item, index) => {
        const angle = (item.percentage + 0.01) * 360;
        currentAngle -= item.percentage * 360;

        let polygon = "polygon(50% 50%, 50% 0%, ";
        polygon += pointCoordinates.slice(0, Math.floor(angle / 45)).join(",");

        if (Math.floor(angle / 45) !== 0) polygon += ",";

        polygon += `${
          50 + Math.floor(Math.sin((angle * Math.PI) / 180) * 50)
        }% `;
        polygon += `${
          50 - Math.floor(Math.cos((angle * Math.PI) / 180) * 50)
        }%)`;

        return (
          <div
            key={index}
            className={`flex justify-center items-center absolute`}
            style={{
              clipPath: polygon,
              transform: `rotate(${currentAngle}deg)`,
              height: `${size * 1.05}px`,
              width: `${size * 1.05}px`,
            }}
          >
            <div
              className={`rounded-full hover:saturate-[2] duration-150 ${
                chartColors[index % chartColors.length]
              }`}
              style={{
                height: `${size * 0.95}px`,
                width: `${size * 0.95}px`,
              }}
            ></div>
          </div>
        );
      })}

      <div className="relative">
        {valueData.map((item, index) => {
          currentLabelAngle -= item.percentage * 360;
          const halfAngle = (item.percentage / 2) * 360;

          const cos = -Math.cos(
            ((currentLabelAngle + halfAngle) * Math.PI) / 180,
          );
          const sin = Math.sin(
            ((currentLabelAngle + halfAngle) * Math.PI) / 180,
          );

          let top = size + (cos * size) / 2 - size / 2;
          top += (top * 2 - size / 2) * 0.1;

          let left = (sin * size) / 2;
          left += (left * 2 - size / 2) * 0.1;

          return (
            <div
              key={index}
              className="absolute select-none font-bold text-lg w-[75px] truncate"
              style={{
                top: `${top}px`,
                left: `${left}px`,
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      <div
        className="absolute bg-white rounded-full left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] flex justify-center items-center"
        style={{
          height: `${size * 0.65}px`,
          width: `${size * 0.65}px`,
        }}
      >
        <div
          className="bg-red-600 rounded-full"
          style={{
            height: `${size * 0.6}px`,
            width: `${size * 0.6}px`,
          }}
        >
          <div className="flex justify-center items-center h-full flex-col">
            <div className="text-white font-bold text-lg">Do oddania</div>
            <div className="text-white font-bold text-3xl">550zł</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
