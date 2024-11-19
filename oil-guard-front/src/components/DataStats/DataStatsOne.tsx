import React from "react";

interface DataStatsProps {
  dataStats: {
    pipelines: number;
    sensors: { total: number; online: number; offline: number };
    anomalies: number;
    reports: number;
  };
}

const DataStatsOne: React.FC<DataStatsProps> = ({ dataStats }) => {
  const dataStatsList = [
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="13"
            cy="13"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M8 13h10" stroke="currentColor" strokeWidth="2" />
          <path d="M13 8v10" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      color: "#3FD97F",
      title: "Pipelines",
      value: dataStats.pipelines,
      growthRate: 0,
    },
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="13"
            cy="13"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M13 9a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
      color: "#FF9C55",
      title: "Total Sensors",
      value: dataStats.sensors.total,
      growthRate: 0,
    },
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="13,2 24,22 2,22"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path d="M13 10v4" stroke="currentColor" strokeWidth="2" />
          <circle cx="13" cy="18" r="1" fill="currentColor" />
        </svg>
      ),
      color: "red",
      title: "Anomalies",
      value: dataStats.anomalies,
      growthRate: 0,
    },
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="5"
            y="4"
            width="16"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="8"
            y1="9"
            x2="18"
            y2="9"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="8"
            y1="13"
            x2="14"
            y2="13"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      color: "#18BFFF",
      title: "Reports",
      value: dataStats.reports,
      growthRate: 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {dataStatsList.map((item, index) => (
        <div
          key={index}
          className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
        >
          <div
            className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
            style={{ backgroundColor: item.color }}
          >
            {item.icon}
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                {item.value}
              </h4>
              <span className="text-body-sm font-medium">{item.title}</span>
            </div>

            <span
              className={`flex items-center gap-1.5 text-body-sm font-medium ${
                item.growthRate > 0 ? "text-green" : "text-red"
              }`}
            >
              {item.growthRate}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataStatsOne;
