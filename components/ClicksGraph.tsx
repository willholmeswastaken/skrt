import React from "react";
import { useDarkMode } from "usehooks-ts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { IDay } from "../models";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IClicksGraphProps {
  days: Array<IDay>;
}

const ClicksGraph: React.FC<IClicksGraphProps> = ({ days }) => {
  const { isDarkMode } = useDarkMode();
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: {
        grid: {
          drawBorder: true,
          color: isDarkMode ? "#e2e2e8" : "#302f30",
        },
        ticks: {
          beginAtZero: true,
          color: isDarkMode ? "#e2e2e8" : "#302f30",
          fontSize: 12,
        },
      },
      xAxes: {
        grid: {
          drawBorder: true,
          color: isDarkMode ? "#e2e2e8" : "#302f30",
        },
        ticks: {
          beginAtZero: true,
          color: isDarkMode ? "#e2e2e8" : "#302f30",
          fontSize: 12,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDarkMode ? "#f9f9fc" : "#302f30",
        },
      },
      title: {
        display: true,
        text: "Clicks over 7 days",
        color: isDarkMode ? "#f9f9fc" : "#302f30",
      },
    },
  };
  const data = {
    labels: days.map((x) => x.date),
    datasets: [
      {
        label: "Clicks",
        data: days.map((x) => x.visitCount),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
      <>
      {
          days.length > 0
          ? (<Line options={options} data={data} height={250} />)
          : (<p className="text-soft-dark-caption-text dark:text-soft-white-caption-text">No clicks have been recorded!</p>)
      }
  </>
  );
};

export default ClicksGraph;
