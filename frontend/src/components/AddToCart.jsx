import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementQuantityOfItem,
  incrementQuantityOfItem,
} from "@/services/cartSlice";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";

export default function AddToCart({
  className = "",
  size,
  variant = "default",
  children,
  item,
  disabled = false,
}) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const itemInCart = cartItems.find(
    (product) =>
      product._id === item._id &&
      product?.selectedVariant?._id === item?.selectedVariant?._id &&
      product?.selectedSize === item?.selectedSize
  );

  const handleAddToCart = () => {
    if (!item) return;

    if (!itemInCart) {
      const updatedItem = { ...item, quantity: 1 };
      dispatch(addToCart(updatedItem));
    }
  };

  if (
    itemInCart &&
    itemInCart.selectedVariant._id === item?.selectedVariant?._id
  ) {
    const { quantity } = itemInCart;

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(decrementQuantityOfItem(itemInCart));
          }}
        >
          <MinusCircleIcon className="text-gray-400 hover:fill-black hover:stroke-white" />
        </button>
        <span>{quantity}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(incrementQuantityOfItem(itemInCart));
          }}
        >
          <PlusCircleIcon className="text-gray-400 hover:fill-black hover:stroke-white" />
        </button>
      </div>
    );
  }

  return (
    <Button
      size={size}
      className={className}
      variant={variant}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        handleAddToCart();
      }}
    >
      {children}
    </Button>
  );
}
