import DynamicForm from "@/components/admin/DynamicForm";
import { OrderValidationSchema } from "@/validationSchemas/order";
import { productValidationSchema } from "@/validationSchemas/product";
import { userAddSchema, userUpdateSchema } from "@/validationSchemas/user";

export const userFormConfig = {
  validationSchema: userAddSchema,
  fields: [
    {
      name: "name",
      label: "Full Name",
      type: DynamicForm.FIELD_TYPES.TEXT,
      required: true,
      placeholder: "Enter full name",
    },
    {
      name: "email",
      label: "Email",
      type: DynamicForm.FIELD_TYPES.EMAIL,
      required: true,
      placeholder: "Enter email",
    },
    {
      name: "password",
      label: "Password",
      type: DynamicForm.FIELD_TYPES.PASSWORD,
      placeholder: "Enter password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: DynamicForm.FIELD_TYPES.PASSWORD,
      placeholder: "Enter confirm password",
    },
    {
      name: "role",
      label: "Role",
      type: DynamicForm.FIELD_TYPES.SELECT,
      required: true,
      options: [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
      ],
    },
  ],
  transformData: (data, isEdit) => {
    return { ...data, password: data.password };
  },
};

export const userUpdateFormConfig = {
  validationSchema: userUpdateSchema,
  fields: [
    {
      name: "name",
      label: "Full Name",
      type: DynamicForm.FIELD_TYPES.TEXT,
      required: true,
      placeholder: "Enter full name",
    },
    {
      name: "email",
      label: "Email",
      type: DynamicForm.FIELD_TYPES.EMAIL,
      required: true,
      placeholder: "Enter email",
    },
    {
      name: "role",
      label: "Role",
      type: DynamicForm.FIELD_TYPES.SELECT,
      required: true,
      options: [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
      ],
    },
  ],
  transformData: (data, isEdit) => {
    return isEdit
      ? { name: data.name, email: data.email, role: data.role }
      : {};
  },
};

export const productFormConfig = {
  validationSchema: productValidationSchema,

  fields: [
    {
      name: "name",
      label: "Product Name",
      type: DynamicForm.FIELD_TYPES.TEXT,
      required: true,
      placeholder: "Enter product name",
    },
    {
      name: "description",
      label: "Description",
      type: DynamicForm.FIELD_TYPES.TEXTAREA,
      placeholder: "Enter product description",
    },
    {
      name: "price",
      label: "Price",
      type: DynamicForm.FIELD_TYPES.NUMBER,
      required: true,
      placeholder: "Enter price",
      step: "0.01",
    },
    {
      name: "category",
      label: "Category",
      type: DynamicForm.FIELD_TYPES.SELECT,
      required: true,
      options: [],
      placeholder: "Select a category",
    },
    {
      name: "subCategory",
      label: "Sub Category",
      type: DynamicForm.FIELD_TYPES.SELECT,
      required: true,
      options: [],
      placeholder: "Select a sub-category",
    },
    {
      name: "size",
      label: "Size",
      type: DynamicForm.FIELD_TYPES.TEXT,
      placeholder: "Enter size (e.g., S, M, L)",
    },
    {
      name: "color",
      label: "Color",
      type: DynamicForm.FIELD_TYPES.TEXT,
      placeholder: "Enter color",
    },
    {
      name: "material",
      label: "Material",
      type: DynamicForm.FIELD_TYPES.TEXT,
      placeholder: "Enter material (e.g., Cotton, Wool)",
    },
    {
      name: "stock",
      label: "Stock Quantity",
      type: DynamicForm.FIELD_TYPES.NUMBER,
      required: true,
      placeholder: "Enter stock quantity",
    },
    {
      name: "tags",
      label: "Tags",
      type: DynamicForm.FIELD_TYPES.TEXT,
      placeholder: "Enter tags (comma-separated)",
    },
    {
      name: "brand",
      label: "Brand",
      type: DynamicForm.FIELD_TYPES.TEXT,
      placeholder: "Enter brand",
    },
    {
      name: "images",
      label: "Product Images",
      type: DynamicForm.FIELD_TYPES.TEXTAREA,
      placeholder: "Enter image URLs (one per line)",
      rows: 3,
    },
  ],
  transformData: (data, isEdit) => {
    return {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock, 10),
      tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
      images: data.images
        ? data.images.split("\n").map((url) => url.trim())
        : [],
    };
  },
};

export const orderFormConfig = {
  validationSchema: OrderValidationSchema,

  fields: [
    {
      name: "totalAmount",
      label: "Total Amount",
      type: DynamicForm.FIELD_TYPES.NUMBER,
      required: true,
      placeholder: "Enter total amount",
      step: "0.01",
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: DynamicForm.FIELD_TYPES.SELECT,
      required: true,
      options: [
        { value: "Credit Card", label: "Credit Card" },
        { value: "PayPal", label: "PayPal" },
        { value: "Debit Card", label: "Debit Card" },
        { value: "Cash on Delivery", label: "Cash on Delivery" },
      ],
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: DynamicForm.FIELD_TYPES.SELECT,
      required: true,
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Completed", label: "Completed" },
        { value: "Failed", label: "Failed" },
        { value: "Refunded", label: "Refunded" },
      ],
    },
    {
      name: "orderStatus",
      label: "Order Status",
      type: DynamicForm.FIELD_TYPES.SELECT,
      required: true,
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Processing", label: "Processing" },
        { value: "Shipped", label: "Shipped" },
        { value: "Delivered", label: "Delivered" },
        { value: "Cancelled", label: "Cancelled" },
        { value: "Returned", label: "Returned" },
      ],
    },
    {
      name: "shippingAddress",
      label: "Shipping Address",
      type: DynamicForm.FIELD_TYPES.NESTED,
      nestedFields: [
        {
          name: "fullName",
          label: "Customer Name",
          type: DynamicForm.FIELD_TYPES.TEXT,
          required: true,
          placeholder: "Enter customer name",
        },
        {
          name: "address",
          label: "Address",
          type: DynamicForm.FIELD_TYPES.TEXT,
          required: true,
          placeholder: "Enter address",
        },
        {
          name: "city",
          label: "City",
          type: DynamicForm.FIELD_TYPES.TEXT,
          required: true,
          placeholder: "Enter city",
        },
        {
          name: "country",
          label: "Country",
          type: DynamicForm.FIELD_TYPES.TEXT,
          required: true,
          placeholder: "Enter country",
        },
        {
          name: "postalCode",
          label: "Postal Code",
          type: DynamicForm.FIELD_TYPES.TEXT,
          required: true,
          placeholder: "Enter postal code",
        },
        {
          name: "phone",
          label: "Phone",
          type: DynamicForm.FIELD_TYPES.TEXT,
          required: true,
          placeholder: "Enter phone number",
        },
      ],
    },
  ],
  transformData: (data, isEdit) => {
    return {
      ...data,
      totalAmount: parseFloat(data.totalAmount),
    };
  },
};
