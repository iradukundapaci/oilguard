import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Typography } from "@mui/material";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SensorAveragesBarChart = ({ averages }) => {
  const labels = [
    "Avg Inflow",
    "Avg Outflow",
    "Avg Pressure",
    "Avg Flow Rate",
    "Avg Temperature",
    "Avg Humidity",
    "Avg Precipitation",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Sensor Averages",
        data: [
          averages.avgInflow,
          averages.avgOutflow,
          averages.avgPressure,
          averages.avgFlowRate,
          averages.avgTemperature,
          averages.avgHumidity,
          averages.avgPrecipitation,
        ],
        backgroundColor: [
          "#3498db",
          "#e74c3c",
          "#f1c40f",
          "#2ecc71",
          "#9b59b6",
          "#1abc9c",
          "#34495e",
        ],
        borderColor: "#2c3e50",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
        },
      },
      x: {
        title: {
          display: true,
          text: "Metrics",
        },
      },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "16px",
        width: "100%",
        maxWidth: "700px",
        margin: "auto",
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        align="center"
        sx={{ marginBottom: "16px", fontWeight: 600 }}
      >
        Sensor Averages
      </Typography>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default SensorAveragesBarChart;
