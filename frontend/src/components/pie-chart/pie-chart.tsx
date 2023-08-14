import React, { useEffect, useState } from "react";
import shortenNumber from "../../utils/shortenNumber";
interface props {
  data: PieChartData[];
  maxNumber?: number;
  size?: number;
  minValue?: number;
  currency?: string;
  sum?: number;
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
  "bg-gradient-to-t from-lime-500 to-green-600",
  "bg-gradient-to-t from-sky-500 to-indigo-600",
  // "bg-gradient-to-r from-indigo-500 to-indigo-600",
  "bg-gradient-to-t from-yellow-300 to-yellow-400",
  "bg-gradient-to-t from-orange-400 to-orange-500",
  "bg-gradient-to-t from-violet-600 to-violet-700",
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
  maxNumber = 6,
  size = 220,
  minValue = 0.1,
  sum,
}: props) => {
  const [valueData, setValueData] = useState<valueData[]>([]);

  let currentAngle = 0;
  let currentLabelAngle = 0;

  const renderDescription = () => {
    if (sum === 0) {
      return "Wszystko w porządku";
    } else if (sum! > 0) {
      return "Otrzymasz jeszcze";
    } else {
      return "Do oddania";
    }
  };

  useEffect(() => {
    const sum = data.reduce(
      (acc: number, cur: PieChartData) => acc + cur.value,
      0,
    );

    if (sum === 0) {
      let newValueData: valueData[] = [];

      newValueData.push({
        value: 0,
        label: ``,
        percentage: 360,
      });

      setValueData(newValueData);
      return;
    }

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

    if (newValueData.length > maxNumber) {
      newValueData = [
        ...newValueData.slice(0, maxNumber - 1),
        {
          value: sumOtherValues,
          label: `Inni (${newValueData.length - maxNumber + 1})`,
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

    if (newValueData.length === 0) {
      newValueData.push({
        value: 0,
        label: ``,
        percentage: 360,
      });
    }

    setValueData(newValueData);
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
            className={`flex justify-center items-center absolute duration-0`}
            style={{
              clipPath: polygon,
              transform: `rotate(${currentAngle}deg)`,
              height: `${size * 1.05}px`,
              width: `${size * 1.05}px`,
            }}
          >
            <div
              className={`rounded-full hover:saturate-[2] border ${
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
          top += (top * 2 - size / 2) * 0.1 - 25;

          let left = (sin * size) / 2;
          left += (left * 2 - size / 2) * 0.1 - 60;

          const temp = currentLabelAngle + halfAngle;
          if (item.label) {
            return (
              <div
                key={index}
                className="absolute select-none font-bold truncate text-center"
                style={{
                  top: `${top}px`,
                  left: `${left}px`,
                  transform: `rotate(${temp}deg) ${
                    Math.abs(temp) > 90 && Math.abs(temp) < 270
                      ? `scale(-1)`
                      : ""
                  }`,
                }}
              >
                <div className="w-[150px] truncate">{item.label}</div>
                <div className="w-full flex justify-center">
                  <div className="w-2/4 border"></div>
                </div>
                <div>{shortenNumber(Math.abs(item.value))} zł</div>
              </div>
            );
          } else {
            return <div key={index}></div>;
          }
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
          className={`bg-gradient-to-b ${
            sum! < 0 ? "from-red-600 to-red-800" : "from-green-600 to-green-800"
          } rounded-full shadow hover:saturate-[1.1]`}
          style={{
            height: `${size * 0.6}px`,
            width: `${size * 0.6}px`,
          }}
        >
          <div className="flex justify-center items-center h-full flex-col">
            <div className="text-white font-bold sm:text-base text-sm text-center">
              {renderDescription()}
            </div>
            {sum !== 0 && (
              <div className="text-white font-bold sm:text-3xl text-xl">
                {shortenNumber(Math.round(Math.abs(sum!) || 0))} zł
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
