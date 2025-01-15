import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { removeFromCart } from "@/services/cartSlice";
import AddToCart from "./AddToCart";
import { calculateGrandTotal } from "@/utils/helper";
import { Badge } from "./ui/badge";

export default function CartDrawer() {
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const { baseTotal, saleTotal, discountPercentage, finalPrice } =
    calculateGrandTotal(items);

  const handleDeletion = (item) => {
    dispatch(removeFromCart(item));
  };

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
        <SheetDescription>
          Review your selected items and proceed to checkout.
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 mt-6">
        {items.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">Your cart is empty.</p>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-4 border-b pb-4"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={item.images[0] || "/placeholder.jpg"}
                    alt={item.name || "Product Image"}
                    className="w-24 h-36 object-cover rounded-md"
                  />
                  {item.price?.sale && (
                    <Badge className="absolute left-0 top-0 bg-red-500 rounded-md">
                      Sale
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <h4 className="font-medium text-gray-800 line-clamp-1">
                    {item.name || "Unnamed Product"}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {item.selectedColor || "N/A"} | {item.selectedSize || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {item.quantity} × $
                    {(item.price?.sale ?? item.price.base).toFixed(2)}
                  </p>

                  <div className="flex items-center gap-8">
                    <AddToCart item={item} />

                    <button
                      onClick={() => handleDeletion(item)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="text-gray-800 font-medium">Total</span>
            <span className="text-gray-800 font-semibold">$ {baseTotal}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-800 font-medium">No. of Items</span>
            <span className="text-gray-800 font-semibold">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-800 font-medium">Discount</span>
            <span className="text-gray-800 font-semibold">
              {discountPercentage} %
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-800 font-medium">Grand Total</span>
            <span className="text-green-600 font-extrabold">
              $ {finalPrice}
            </span>
          </div>

          <Link to={"/checkout"}>
            <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      )}
    </SheetContent>
  );
}
