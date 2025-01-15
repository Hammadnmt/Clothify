import OrderCard from "./OrderCard";
import Paginate from "./Paginate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function OrdersSection({ orders, pagination, onPageChange }) {
  const filterOrders = (status) => {
    return orders.filter((order) => order.orderStatus === status);
  };

  return (
    <Tabs defaultValue="All" className="w-full">
      <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
        <TabsTrigger value="All">All Orders</TabsTrigger>
        <TabsTrigger value="Pending">Pending</TabsTrigger>
        <TabsTrigger value="Processing">Processing</TabsTrigger>
        <TabsTrigger value="Shipped">Shipped</TabsTrigger>
        <TabsTrigger value="Delivered">Delivered</TabsTrigger>
        <TabsTrigger value="Returned">Returned</TabsTrigger>
      </TabsList>

      {[
        "All",
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ].map((status) => (
        <TabsContent key={status} value={status}>
          <div className="mb-3 space-y-4">
            {(status === "All" ? orders : filterOrders(status)).map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
          <Paginate
            currentPage={pagination?.currentPage}
            totalPages={pagination?.totalPages}
            onPageChange={(page) => onPageChange(page)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
