import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import LoadingSpinner from "../ui/loadingSpinner";
import useFormValidation from "@/hooks/useFormValidation";
import { OrderValidationSchema } from "@/validationSchemas/order";
import FormError from "../FormError";

export default function OrderFormDialog({
  onSubmit,
  data = {},
  isEdit = false,
  isLoading = false,
}) {
  const order = data || {};
  const initialState = isEdit
    ? {
        totalAmount: order.totalAmount?.toFixed(2) || 0,
        paymentMethod: order.paymentMethod || "",
        paymentStatus: order.paymentStatus || "Pending",
        orderStatus: order.orderStatus || "Pending",
        shippingAddress: {
          fullName: order.shippingAddress?.fullName || "",
          address: order.shippingAddress?.address || "",
          city: order.shippingAddress?.city || "",
          country: order.shippingAddress?.country || "",
          postalCode: order.shippingAddress?.postalCode || "",
          phone: order.shippingAddress?.phone || "",
        },
      }
    : {
        totalAmount: 0,
        paymentMethod: "",
        paymentStatus: "Pending",
        orderStatus: "Pending",
        shippingAddress: {
          fullName: "",
          address: "",
          city: "",
          country: "",
          postalCode: "",
          phone: "",
        },
      };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useFormValidation(OrderValidationSchema, initialState);

  const onSubmitForm = (data) => {
    if (isLoading) return;

    const updatedOrder = {
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      orderStatus: data.orderStatus,
      shippingAddress: {
        fullName: data.shippingAddress?.fullName,
        address: data.shippingAddress?.address,
        city: data.shippingAddress?.city,
        country: data.shippingAddress?.country,
        postalCode: data.shippingAddress?.postalCode,
        phone: data.shippingAddress?.phone,
      },
    };

    if (isEdit) {
      onSubmit(updatedOrder, order._id);
    } else {
      onSubmit(updatedOrder);
    }

    reset();
  };

  const paymentMethod = watch("paymentMethod");
  const paymentStatus = watch("paymentStatus");
  const orderStatus = watch("orderStatus");

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Update Order" : "Add Order"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the details of the existing order."
            : "Fill in the details to add a new order."}
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="space-y-4 max-h-[70vh] overflow-y-auto px-2"
      >
        <div>
          <Label htmlFor="totalAmount">Total Amount</Label>
          <Input
            required
            id="totalAmount"
            type="number"
            step="any"
            placeholder="Enter total amount"
            disabled={isLoading || isEdit}
            {...register("totalAmount")}
          />
          {errors.totalAmount && (
            <FormError message={errors?.totalAmount?.message} />
          )}
        </div>

        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select
            required
            disabled={isLoading}
            onValueChange={(value) => setValue("paymentMethod", value)}
            value={paymentMethod}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="PayPal">PayPal</SelectItem>
              <SelectItem value="Debit Card">Debit Card</SelectItem>
              <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentMethod && (
            <FormError message={errors?.paymentMethod?.message} />
          )}
        </div>

        <div>
          <Label htmlFor="paymentStatus">Payment Status</Label>
          <Select
            required
            disabled={isLoading}
            onValueChange={(value) => setValue("paymentStatus", value)}
            value={paymentStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentStatus && (
            <FormError message={errors?.paymentStatus?.message} />
          )}
        </div>

        <div>
          <Label htmlFor="orderStatus">Order Status</Label>
          <Select
            required
            disabled={isLoading}
            onValueChange={(value) => setValue("orderStatus", value)}
            value={orderStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select order status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Returned">Returned</SelectItem>
            </SelectContent>
          </Select>
          {errors.orderStatus && (
            <FormError message={errors?.orderStatus?.message} />
          )}
        </div>

        <div>
          <Label htmlFor="fullName">Customer Name</Label>
          <Input
            required
            id="fullName"
            type="text"
            placeholder="Enter customer name"
            disabled={isLoading}
            {...register("shippingAddress.fullName")}
          />
          {errors.fullName && <FormError message={errors?.fullName?.message} />}
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            required
            id="address"
            type="text"
            placeholder="Enter address"
            disabled={isLoading}
            {...register("shippingAddress.address")}
          />
          {errors.address && <FormError message={errors?.address?.message} />}
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            required
            id="city"
            type="text"
            placeholder="Enter city"
            disabled={isLoading}
            {...register("shippingAddress.city")}
          />
          {errors.city && <FormError message={errors?.city?.message} />}
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            required
            id="country"
            type="text"
            placeholder="Enter country"
            disabled={isLoading}
            {...register("shippingAddress.country")}
          />
          {errors.country && <FormError message={errors?.country?.message} />}
        </div>

        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            required
            id="postalCode"
            type="text"
            placeholder="Enter postal code"
            disabled={isLoading}
            {...register("shippingAddress.postalCode")}
          />
          {errors.postalCode && (
            <FormError message={errors?.postalCode?.message} />
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            required
            id="phone"
            type="text"
            placeholder="Enter phone number"
            disabled={isLoading}
            {...register("shippingAddress.phone")}
          />
          {errors.phone && <FormError message={errors?.phone?.message} />}
        </div>

        <div className="mt-4">
          <Button disabled={isLoading} className="w-full">
            {isLoading ? <LoadingSpinner /> : isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
