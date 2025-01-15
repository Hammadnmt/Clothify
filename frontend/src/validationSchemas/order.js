import * as Yup from "yup";

export const OrderValidationSchema = Yup.object().shape({
  totalAmount: Yup.number()
    .required("Total amount is required.")
    .min(0, "Total amount must be a positive value."),
  paymentMethod: Yup.string()
    .required("Payment method is required.")
    .oneOf(
      ["Credit Card", "Debit Card", "PayPal", "Cash on Delivery"],
      "Invalid payment method."
    ),
  paymentStatus: Yup.string()
    .oneOf(
      ["Pending", "Completed", "Failed", "Refunded"],
      "Invalid payment status."
    )
    .default("Pending"),
  orderStatus: Yup.string()
    .oneOf(
      [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      "Invalid order status."
    )
    .default("Pending"),
  shippingAddress: Yup.object().shape({
    fullName: Yup.string().required("Full name is required."),
    address: Yup.string().required("Address is required."),
    city: Yup.string().required("City is required."),
    country: Yup.string().required("Country is required."),
    postalCode: Yup.string().required("Postal code is required."),
    phone: Yup.string().required("Phone number is required."),
  }),
});
