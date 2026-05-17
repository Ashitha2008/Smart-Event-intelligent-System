import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * Dashboard Chart Component
 * Displays various chart types for analytics
 */
export default function DashboardChart({
  type = "bar",
  data = [],
  title = "",
  height = 300,
}) {
  if (!data || data.length === 0) {
    return (
      <div
        className="glass-card backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 flex items-center justify-center shadow-lg shadow-purple-500/10"
        style={{ height }}
      >
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const COLORS = [
    "#A855F7", // Purple
    "#EC4899", // Pink
    "#8B5CF6", // Violet
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#06B6D4", // Cyan
  ];

  return (
    <div className="glass-card backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 shadow-lg shadow-purple-500/10">
      {title && (
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height={height}>
        {type === "bar" && (
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#A855F7" />
          </BarChart>
        )}

        {type === "line" && (
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#A855F7"
              strokeWidth={2}
            />
          </LineChart>
        )}

        {type === "pie" && (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ₹${value}`}
              outerRadius={80}
              fill="#A855F7"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value}`}
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "0.5rem",
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
