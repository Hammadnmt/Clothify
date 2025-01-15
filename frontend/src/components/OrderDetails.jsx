import { useGetOrderQuery } from "@/services/ordersApi";
import { Link, useNavigate } from "react-router";
import LoadingSpinner from "./ui/loadingSpinner";

export default function OrderDetails({ id }) {
  const navigate = useNavigate();

  const { data: orderDetails, isLoading, isError } = useGetOrderQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  if (isError) {
    return <p>Something went wrong, Please try again!</p>;
  }

  const order = orderDetails?.data;

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Order #{order._id}
          </h1>
          <p className="text-sm text-gray-500">
            Placed on: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Customer Information
          </h2>
          <div className="mt-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Name:</span> {order.user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {order.user.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {order.user.role}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Order Items</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-800 uppercase">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr
                    key={item?.product?._id || i}
                    className="border-b hover:bg-slate-100"
                  >
                    <td className="px-4 py-2">
                      <Link
                        to={`/product/${item?.product?._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-800"
                      >
                        {item?.product?.name || "-------"}
                      </Link>
                    </td>
                    <td className="px-4 py-2">${item?.price.toFixed(2)}</td>
                    <td className="px-4 py-2">{item?.quantity}</td>
                    <td className="px-4 py-2">
                      ${(item?.price * item?.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Shipping Address</h2>
          <div className="mt-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {order.shippingAddress.fullName}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {order.shippingAddress.address}
            </p>
            <p>
              <span className="font-semibold">City:</span>{" "}
              {order.shippingAddress.city}
            </p>
            <p>
              <span className="font-semibold">Country:</span>{" "}
              {order.shippingAddress.country}
            </p>
            <p>
              <span className="font-semibold">Postal Code:</span>{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
          <div className="mt-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Payment Method:</span>{" "}
              {order.paymentMethod}
            </p>
            <p>
              <span className="font-semibold">Payment Status:</span>{" "}
              {order.paymentStatus}
            </p>
            <p>
              <span className="font-semibold">Order Status:</span>{" "}
              {order.orderStatus}
            </p>
            <p>
              <span className="font-semibold">Total Amount:</span> $
              {order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
