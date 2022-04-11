import React from "react";
import { useDarkMode } from "use-dark-mode-ts";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { IDeviceAnalytic } from "../models";
import { randomColor } from "../utilities/randomColor";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IDeviceAnalyticsChartProps {
  deviceAnalytics: Array<IDeviceAnalytic>;
}

const DeviceAnalyticsChart = ({ deviceAnalytics }: IDeviceAnalyticsChartProps) => {
  const isDarkMode: boolean = useDarkMode();
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDarkMode ? "#f9f9fc" : "#302f30",
        },
      },
      title: {
        display: true,
        text: "Devices over 7 days",
        color: isDarkMode ? "#f9f9fc" : "#302f30",
      },
    },
  };
  const data = {
    labels: deviceAnalytics.map(x => x.name),
    datasets: [
      {
        label: "Devices",
        data: deviceAnalytics.map(x => x.count),
        backgroundColor: deviceAnalytics.map(_ => randomColor())
      },
    ],
  };
  return (
      <>
      {
          deviceAnalytics.length > 0
          ? (<Doughnut options={options} data={data} height={250} />)
          : (<p className="text-soft-dark-caption-text dark:text-soft-white-caption-text">No device analytics available!</p>)
      } 
  </>
  );
};

export default DeviceAnalyticsChart;
