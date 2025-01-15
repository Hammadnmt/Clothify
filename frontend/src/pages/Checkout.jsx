import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  ShoppingCart,
  Trash,
  Package,
  MapPin,
  CreditCard,
  Star,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import AddToCart from "@/components/AddToCart";
import { Badge } from "@/components/ui/badge";
import Message from "@/components/Message";
import Logger from "@/utils/logger";

import { saveAddress } from "@/services/addressSlice";
import { removeFromCart, resetCart } from "@/services/cartSlice";
import {
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
} from "@/services/ordersApi";
import { calculateGrandTotal, formatPrice } from "@/utils/helper";
import { Textarea } from "@/components/ui/textarea";
import { PaymentForm } from "@/components/PaymentForm";

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");

  const { cartItems } = useSelector((state) => state.cart);
  const { address } = useSelector((state) => state.address);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { baseTotal, saleTotal, discountPercentage, finalPrice } =
    calculateGrandTotal(cartItems);

  const [formData, setFormData] = useState({
    name: address?.name || "",
    addressLine: address?.addressLine || "",
    postal: address?.postal || "",
    city: address?.city || "",
    country: address?.country || "",
    phone: address?.phone || "",
    paymentMethod: address?.paymentMethod || "",
    notes: "",
  });

  const [createOrder, { isLoading, isSuccess, isError }] =
    useCreateOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  // useEffect(() => {
  //   if (isSuccess && orderId) {
  //     dispatch(saveAddress(formData));
  //     dispatch(resetCart());
  //     Logger.success("Order placed successfully");
  //     navigate(`/ordersummary/${orderId}`);
  //   }
  // }, [isSuccess, orderId, navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (cartItems.length === 0) return;

    let isFormValid = false;
    for (const [key, value] of Object.entries(formData)) {
      if (key === "notes" && value === "") {
        continue;
      }
      isFormValid = value.trim();
    }

    if (!isFormValid) {
      Logger.error("Please fill all the fields");
      return;
    }

    try {
      const items = cartItems.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
      }));

      const response = await createOrder({
        items,
        shippingAddress: {
          fullName: formData.name,
          address: formData.addressLine,
          postalCode: formData.postal,
          city: formData.city,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || "",
      }).unwrap();

      console.log(response);
      const orderId = response?.data?._id;
      setOrderId(orderId);

      if (["Credit Card", "Debit Card"].includes(formData.paymentMethod)) {
        const paymentResponse = await createPaymentIntent(orderId);

        setClientSecret(paymentResponse.data.clientSecret);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        dispatch(saveAddress(formData));
        dispatch(resetCart());
        Logger.success("Order placed successfully");
        navigate(`/ordersummary/${orderId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (e, item) => {
    e.stopPropagation();
    dispatch(removeFromCart(item));
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="flex flex-col items-center space-y-4">
            <Package className="w-16 h-16 text-gray-400" />
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-gray-500">
              Time to fill it with amazing products!
            </p>
            <Link to="/">
              <Button className="mt-4">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Shopping Cart
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {cartItems.map((item, index) => {
                  const variant = item.variants.find(
                    (v) =>
                      v.color.toLowerCase() ===
                      item.selectedVariant.color.toLowerCase()
                  );
                  const sizeObj = variant?.sizes.find(
                    (s) => s.size === item.selectedSize
                  );

                  return (
                    <AccordionItem
                      key={`${item._id}-${index}`}
                      value={`item-${index}`}
                    >
                      <AccordionTrigger>
                        <div className="flex items-center gap-4 w-full">
                          <div className="relative">
                            <img
                              src={item.images[0] || "/placeholder.jpg"}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            {item.price.sale &&
                              item.price.sale < item.price.base && (
                                <Badge className="absolute left-0 top-0 bg-red-500 rounded-lg text-[8px]">
                                  Sale
                                </Badge>
                              )}
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="font-medium underline">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{item.selectedSize}</span>
                              <span>•</span>
                              <span>{item.selectedColor}</span>
                            </div>
                          </div>
                          <div className="text-right mr-4">
                            <div className="font-semibold">
                              {item.price.sale &&
                              item.price.sale < item.price.base ? (
                                <span className="text-red-500">
                                  {formatPrice(item.price)}
                                </span>
                              ) : (
                                formatPrice(item.price)
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              Qty: {item.quantity} / Stock:{" "}
                              {sizeObj?.stock || 0}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span>
                              {item.ratings.average} ({item.ratings.count}{" "}
                              reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <AddToCart item={item} />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleDelete(e, item)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                            <Link
                              to={`/product/${item._id}`}
                              className="underline text-blue-600"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between items-center flex-col space-y-4">
              <div className="w-full flex justify-between items-center">
                <span className="text-base sm:text-lg font-medium">Total</span>
                <span className="text-lg sm:text-xl font-semibold">
                  ${baseTotal}
                </span>
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="text-base sm:text-lg font-medium">
                  Quantity
                </span>
                <span className="text-lg sm:text-xl font-semibold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="text-base sm:text-lg font-medium">
                  Discount
                </span>
                <span className="text-lg sm:text-xl font-semibold">
                  {discountPercentage} %
                </span>
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="text-base sm:text-lg font-medium">Tax</span>
                <span className="text-lg sm:text-xl font-semibold">0 %</span>
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="text-base sm:text-lg font-medium">
                  Shipping
                </span>
                <span className="text-lg sm:text-xl font-semibold">FREE</span>
              </div>
              <div className="w-full flex justify-between items-center border-t-2 pt-4">
                <span className="text-base sm:text-lg font-medium">
                  Grand Total
                </span>
                <span className="text-xl sm:text-2xl font-bold text-green-500">
                  ${finalPrice}
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {!orderId && !clientSecret && (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Details
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    disabled={isLoading}
                    required
                  />
                  <Input
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    placeholder="Address Line"
                    disabled={isLoading}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      disabled={isLoading}
                      required
                    />
                    <Input
                      name="postal"
                      value={formData.postal}
                      onChange={handleInputChange}
                      placeholder="Postal Code"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    disabled={isLoading}
                    required
                  />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    type="tel"
                    disabled={isLoading}
                    required
                  />

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Method
                    </label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: value,
                        }))
                      }
                      disabled={isLoading}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash on Delivery">
                          Cash on Delivery
                        </SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        {/* <SelectItem value="PayPal">PayPal</SelectItem> */}
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Special instructions for delivery man..."
                    rows="4"
                    disabled={isLoading}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Place Order (
                        {cartItems.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}{" "}
                        items)
                      </>
                    )}
                  </Button>
                </CardFooter>
                {isError && (
                  <Message
                    type="error"
                    title="Failed to place order"
                    dismissible={false}
                  />
                )}
              </Card>
            </form>
          )}
          {orderId &&
            clientSecret &&
            ["Credit Card", "Debit Card"].includes(formData.paymentMethod) && (
              <Card className="mt-4">
                <CardHeader>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </h2>
                </CardHeader>
                <CardContent>
                  <PaymentForm
                    orderId={orderId}
                    clientSecret={clientSecret}
                    onSuccess={() => {
                      dispatch(saveAddress(formData));
                      dispatch(resetCart());
                      Logger.success("Payment successful");
                      navigate(`/ordersummary/${orderId}`);
                    }}
                  />
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
