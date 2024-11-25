"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import DataStatsOne from "@/components/DataStats/DataStatsOne";
import SensorPieChart from "./SensorPieChart";
import SensorAveragesBarChart from "./SensorAverageBarChart";
import SensorGroupChart from "./SensorGroupChart";

const ECommerce: React.FC = () => {
  const [dataStats, setDataStats] = useState({
    pipelines: 0,
    sensors: {
      total: 0,
      online: 0,
      offline: 0,
      averages: {
        avgInflow: 0,
        avgOutflow: 0,
        avgPressure: 0,
        avgFlowRate: 0,
        avgTemperature: 0,
        avgHumidity: 0,
        avgPrecipitation: 0,
      },
    },
    anomalies: 0,
    reports: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics`,
        );
        const { pipelines, sensors, anomalies, reports } = response.data;
        console.log(response.data);
        setDataStats({ pipelines, sensors, anomalies, reports });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <DataStatsOne dataStats={dataStats} />
      <div className="mt-3 flex flex-wrap justify-between gap-4">
        <SensorPieChart sensors={dataStats.sensors} />
        <SensorAveragesBarChart averages={dataStats.sensors.averages} />
      </div>
      <SensorGroupChart />
    </>
  );
};

export default ECommerce;
