import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const COLORS = ["#4ADE80", "#38BDF8", "#FF7849", "#F87171", "#A78BFA"];

const TopSellingChart = ({
  data = [],
  chartType = "bar",
  title = "Top Selling Products",
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">No data available to display.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="name" tick={{ fill: "#6B7280" }} />
              <YAxis tick={{ fill: "#6B7280" }} />
              <Tooltip cursor={{ fill: "#F3F4F6" }} />
              <Bar dataKey="totalSold" fill="#4ADE80" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                dataKey="totalSold"
                nameKey="name"
                cx="65%"
                cy="40%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopSellingChart;
