import { useNavigate } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { Box, CreditCard } from "lucide-react";

export default function OrderCard({ order }) {
  const navigate = useNavigate();
  console.log(order);

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={"flex items-center justify-center gap-1"}>
              <Box size={14} /> {order.orderStatus}
            </Badge>
            <Badge
              variant="outline"
              className={"flex items-center justify-center gap-1"}
            >
              <CreditCard size={14} /> {order.paymentStatus}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(order.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-1">
            Order #{order._id}
          </p>
          <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            navigate(`/ordersummary/${order._id}`, {
              state: { from: "/profile" },
            })
          }
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
