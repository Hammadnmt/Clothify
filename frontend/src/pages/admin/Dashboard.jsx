import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  AlertTriangle,
} from "lucide-react";
import { useGetDashboardDataQuery } from "@/services/dashboardApi";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import RevenueSalesTrends from "@/components/admin/RevenueSalesTrends";
import TopSellingChart from "@/components/admin/TopSellingChart";
import OrdersByStatusChart from "@/components/admin/OrderByStatusChart";

const COLORS = ["#4ADE80", "#38BDF8", "#FF7849", "#F87171", "#A78BFA"];

const Dashboard = () => {
  const { data: dashData, isLoading, isError } = useGetDashboardDataQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (isError) {
    return <p>Something went wrong, Try again!</p>;
  }

  const {
    totalUsers = 0,
    totalProducts = 0,
    totalOrders = 0,
    totalRevenue = 0,
    topSellingProducts = [],
    recentOrders = [],
    lowStockProducts = [],
    ordersByStatus = [],
    revenueTrends = [],
    orderTrends = [],
    userGrowthTrends = [],
    categorySales = [],
    popularBrands = [],
  } = dashData?.data || {};

  console.log(dashData);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 p-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <DollarSign size={24} className="text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  ${totalRevenue.toFixed(2)}
                </h2>
                <p className="text-sm text-gray-400">All-Time Revenue</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <ShoppingCart size={24} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{totalOrders}</h2>
                <p className="text-sm text-gray-400">Orders Placed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <Package size={24} className="text-yellow-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{totalProducts}</h2>
                <p className="text-sm text-gray-400">Available in Store</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <Users size={24} className="text-pink-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{totalUsers}</h2>
                <p className="text-sm text-gray-400">Registered Users</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <RevenueSalesTrends
          orderTrends={orderTrends}
          revenueTrends={revenueTrends}
        />

        {/* <TopSellingChart
          data={topSellingProducts}
          chartType="bar"
          title="Top Selling Products - Bar Chart"
        /> */}
        <TopSellingChart
          data={topSellingProducts}
          chartType="pie"
          title="Top Selling Products"
        />

        <OrdersByStatusChart
          data={ordersByStatus}
          chartType="bar"
          title="Orders by Status"
        />
      </div>
    </div>
  );
};

export default Dashboard;

// OLD
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Status Breakdown</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <PieChart width={400} height={300}>
//                 <Pie
//                   data={ordersByStatus || []}
//                   dataKey="count"
//                   nameKey="_id"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   fill="#8884d8"
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                 >
//                   {ordersByStatus.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Top Selling Products</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <BarChart
//                 width={400}
//                 height={300}
//                 data={topSellingProducts || []}
//               >
//                 <Bar dataKey="totalSold" fill="#4ADE80" />
//                 <Tooltip />
//               </BarChart>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Low Stock Products</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Product</TableHead>
//                     <TableHead>Stock</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {lowStockProducts?.map((product) => (
//                     <TableRow key={product._id}>
//                       <TableCell>{product.name}</TableCell>
//                       <TableCell>{product.stock}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Orders</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>User</TableHead>
//                     <TableHead>Total</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {recentOrders?.map((order) => (
//                     <TableRow key={order._id}>
//                       <TableCell>{order.user.name}</TableCell>
//                       <TableCell>${order.totalAmount?.toFixed(2)}</TableCell>
//                       <TableCell>{order.orderStatus}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Calendar</CardTitle>
//             <p className="text-gray-400 text-sm">Upcoming events and orders.</p>
//           </CardHeader>
//           <CardContent>
//             <Calendar />
//           </CardContent>
//         </Card>
