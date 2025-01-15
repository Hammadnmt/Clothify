import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useGetOrderQuery } from "@/services/ordersApi";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
  CreditCard,
  MapPin,
  Package,
  ShoppingCart,
  Box,
  Info,
} from "lucide-react";

const StatusBadge = ({ status, type }) => {
  const getVariant = () => {
    if (type === "payment") {
      return status === "Paid" ? "success" : "destructive";
    }
    return status === "Delivered" ? "success" : "secondary";
  };

  return <Badge variant={getVariant()}>{status}</Badge>;
};

const OrderItem = ({ item, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border rounded-lg p-4"
  >
    <div className="relative w-24 h-24">
      <img
        src={item.product.images[0]}
        alt="Product"
        className="w-full h-full object-cover rounded-md"
      />
      <Badge className="absolute top-0 right-0" variant="secondary">
        {item.variant.size}
      </Badge>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="font-medium text-base line-clamp-1 underline">
            {item.product.name}
          </p>

          <p className="font-medium text-sm text-gray-500">
            Size: {item.variant.size}
          </p>
          <p className="text-sm text-gray-500">Color: {item.variant.color}</p>
          <div className="flex items-center gap-2 text-gray-500">
            <p className="text-sm">Quantity: {item.quantity}</p>
            <p className="text-sm text-gray-500">×</p>
            <p className="text-sm">${item.price.toFixed(2)}</p>
          </div>
        </div>
        <p className="text-lg font-semibold text-right">
          ${item.total.toFixed(2)}
        </p>
      </div>
    </div>
  </div>
);

export default function OrderSummary() {
  const { id } = useParams();
  const { data: orderData, isLoading, isError } = useGetOrderQuery(id);
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || {};

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !orderData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-lg font-semibold text-red-600">Order not found</p>
        <Link to="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

  const { data } = orderData;
  const order = data;
  return (
    <div className="container mx-auto p-4 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="text-primary h-6 w-6" />
          <h1 className="text-2xl font-bold">Order Details</h1>
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <StatusBadge status={order.orderStatus} type="order" />
      </div>

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Payment Method</span>
            </div>
            <p className="font-medium">{order.paymentMethod}</p>
            <StatusBadge status={order.paymentStatus} type="payment" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Order Summary</span>
            </div>
            <p className="text-sm">Items: {order.summary.totalItems}</p>
            <p className="text-sm">Unique Items: {order.summary.uniqueItems}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-gray-500" />
          <h2 className="font-semibold">Shipping Address</h2>
        </div>
        <div className="space-y-1 text-sm">
          <p className="font-medium">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Box className="h-4 w-4 text-gray-500" />
          <h2 className="font-semibold">Order Items</h2>
        </div>
        <div className="space-y-4">
          {order.items.map((item) => (
            <OrderItem
              key={item._id}
              item={item}
              onClick={() => navigate(`/product/${item.product._id}`)}
            />
          ))}

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">No. of items:</span>
              <span>
                {order.items.reduce((acc, curr) => acc + curr.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {order.notes && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-gray-500" />
            <h2 className="font-semibold">Notes</h2>
          </div>
          <p className="text-sm text-gray-600">{order.notes}</p>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => {
            if (from === "/profile") {
              return navigate(-1);
            } else {
              return navigate("/", { replace: true });
            }
          }}
        >
          Go Back
        </Button>
        {/* <Button>Track Order</Button> */}
      </div>
    </div>
  );
}
