import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import io from "socket.io-client";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// Define the type for sensor data
interface SensorData {
  timestamp: number;
  avg_inflow: number;
  avg_outflow: number;
  pressure: number;
  flow_rate: number;
  vibration: number;
  temperature: number;
  humidity: number;
  precipitation: number;
  count?: number; // Add count property to track how many times a value has been updated
}

const SensorGroupChart = () => {
  const [sensorData, setSensorData] = useState<{
    [key: string]: { [timestamp: number]: SensorData };
  }>({}); // Historical data for all sensors

  const roundToNearest5Minutes = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    date.setSeconds(0, 0);
    return date.getTime();
  };

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

    socket.on("sensor-data", (newData: { [sensorId: string]: SensorData }) => {
      setSensorData((prevData) => {
        const updatedData = { ...prevData };

        Object.entries(newData).forEach(([sensorId, newSensorData]) => {
          if (!updatedData[sensorId]) {
            updatedData[sensorId] = {};
          }

          const roundedTimestamp = roundToNearest5Minutes(
            newSensorData.timestamp,
          );

          if (!updatedData[sensorId][roundedTimestamp]) {
            // Add the timestamp explicitly in the new sensor data
            updatedData[sensorId][roundedTimestamp] = {
              ...newSensorData,
              count: 1,
            };
          } else {
            const currentData = updatedData[sensorId][roundedTimestamp];
            updatedData[sensorId][roundedTimestamp] = {
              timestamp: roundedTimestamp, // Ensure the timestamp is included
              avg_inflow:
                (currentData.avg_inflow * currentData.count +
                  newSensorData.avg_inflow) /
                (currentData.count + 1),
              avg_outflow:
                (currentData.avg_outflow * currentData.count +
                  newSensorData.avg_outflow) /
                (currentData.count + 1),
              pressure:
                (currentData.pressure * currentData.count +
                  newSensorData.pressure) /
                (currentData.count + 1),
              flow_rate:
                (currentData.flow_rate * currentData.count +
                  newSensorData.flow_rate) /
                (currentData.count + 1),
              vibration:
                (currentData.vibration * currentData.count +
                  newSensorData.vibration) /
                (currentData.count + 1),
              temperature:
                (currentData.temperature * currentData.count +
                  newSensorData.temperature) /
                (currentData.count + 1),
              humidity:
                (currentData.humidity * currentData.count +
                  newSensorData.humidity) /
                (currentData.count + 1),
              precipitation:
                (currentData.precipitation * currentData.count +
                  newSensorData.precipitation) /
                (currentData.count + 1),
              count: currentData.count + 1,
            };
          }
        });

        return updatedData;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const renderChart = (sensorId: string) => {
    const sensorHistory = sensorData[sensorId];

    if (!sensorHistory) return null;

    const sortedTimestamps = Object.keys(sensorHistory)
      .map((ts) => parseInt(ts, 10))
      .sort((a, b) => a - b);
    const timestamps = sortedTimestamps.map((ts) =>
      new Date(ts).toLocaleTimeString(),
    );

    const avgInflow = sortedTimestamps.map(
      (ts) => sensorHistory[ts].avg_inflow,
    );
    const avgOutflow = sortedTimestamps.map(
      (ts) => sensorHistory[ts].avg_outflow,
    );
    const pressure = sortedTimestamps.map((ts) => sensorHistory[ts].pressure);
    const flowRate = sortedTimestamps.map((ts) => sensorHistory[ts].flow_rate);
    const vibration = sortedTimestamps.map((ts) => sensorHistory[ts].vibration);
    const temperature = sortedTimestamps.map(
      (ts) => sensorHistory[ts].temperature,
    );
    const humidity = sortedTimestamps.map((ts) => sensorHistory[ts].humidity);
    const precipitation = sortedTimestamps.map(
      (ts) => sensorHistory[ts].precipitation,
    );

    const chartData = {
      labels: timestamps,
      datasets: [
        {
          label: "Avg Inflow",
          data: avgInflow,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Avg Outflow",
          data: avgOutflow,
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Pressure",
          data: pressure,
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Flow Rate",
          data: flowRate,
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Vibration",
          data: vibration,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Temperature",
          data: temperature,
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Humidity",
          data: humidity,
          borderColor: "rgba(75, 192, 192, 0.7)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Precipitation",
          data: precipitation,
          borderColor: "rgba(153, 102, 255, 0.7)",
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    const options: ChartOptions<"line"> = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        x: {
          title: { display: true, text: "Time" },
        },
        y: {
          title: { display: true, text: "Values" },
        },
      },
    };

    return (
      <div
        key={sensorId}
        className="rounded-lg border bg-white p-4 shadow-md"
        style={{ width: "48%", height: "400px", marginBottom: "50px" }}
      >
        <h3 className="mb-4 text-center text-lg font-semibold">
          Sensor {sensorId}
        </h3>
        <Line data={chartData} options={options} />
      </div>
    );
  };

  return (
    <div className="flex flex-wrap justify-between p-6">
      {Object.keys(sensorData)
        .slice(0, 4) // Limit to the first 4 sensors
        .map((sensorId) => renderChart(sensorId))}
    </div>
  );
};

export default SensorGroupChart;
