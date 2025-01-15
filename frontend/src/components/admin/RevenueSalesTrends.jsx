import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RevenueSalesTrends = ({ revenueTrends = [], orderTrends = [] }) => {
  const combinedData = revenueTrends.map((revenueItem) => {
    const matchingOrder = orderTrends.find(
      (order) => order._id === revenueItem._id
    );
    return {
      timePeriod: revenueItem._id,
      revenue: revenueItem.monthlyRevenue || 0,
      orders: matchingOrder ? matchingOrder.monthlyOrders : 0,
    };
  });

  return (
    <Card className="w-full p-4">
      <CardHeader>
        <CardTitle>Revenue and Sales Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={combinedData}
                margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timePeriod" />
                <YAxis
                  yAxisId="left"
                  // label={{
                  //   value: "Revenue ($)",
                  //   angle: -90,
                  //   position: "insideLeft",
                  // }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  // label={{
                  //   value: "Orders",
                  //   angle: -90,
                  //   position: "insideRight",
                  // }}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#4ADE80"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={combinedData}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timePeriod" />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: "Revenue ($)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Orders",
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="#38BDF8"
                  name="Revenue"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  fill="#4ADE80"
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueSalesTrends;
