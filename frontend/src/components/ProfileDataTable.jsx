import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Link } from "react-router";

export default function ProfileDataTable({
  orders = [],
  emptyMessage = "No orders",
}) {
  return (
    <>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-600">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Product</TableHead>
              <TableHead className="text-left">Price</TableHead>
              <TableHead className="text-left">Qty</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) =>
              order.items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.product?.name || "-----"}</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {item.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      to={`/ordersummary/${order._id}`}
                      className="text-blue-500"
                    >
                      Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}
