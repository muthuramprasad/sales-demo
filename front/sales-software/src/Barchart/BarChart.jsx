import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Sales",
        data: [30, 50, 70, 40, 60],
        backgroundColor: "rgb(54,162,235)",
        borderColor: "rgb(0, 0, 0)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Sales Data" },
    },
  };

  return <Bar data={data} className="ant-card-bar-chart" style={{marginTop:'20px'}} options={options} />;
};

export default BarChart;
