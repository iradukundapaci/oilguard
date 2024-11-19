import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";

interface SensorPieChartProps {
  sensors: {
    total: number;
    online: number;
    offline: number;
  };
}

const SensorPieChart: React.FC<SensorPieChartProps> = ({ sensors }) => {
  const data = [
    { name: "Online Sensors", value: sensors.online },
    { name: "Offline Sensors", value: sensors.offline },
  ];

  const COLORS = ["#3FD97F", "#FF9C55"];

  return (
    <Box
      sx={{
        backgroundColor: "white",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "16px",
        width: "100%",
        maxWidth: "500px",
        margin: "auto",
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        align="center"
        sx={{ marginBottom: "16px", fontWeight: 600 }}
      >
        Sensor Status
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SensorPieChart;
