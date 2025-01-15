// export const BASE_URL =
//   process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

export const BASE_URL =
  import.meta.env.VITE_BASE_URL ?? "http://localhost:5000/";
export const PRODUCTS_URL = "api/v1/products";
export const CATEGORY_URL = "api/v1/category";
export const SUB_CATEGORY_URL = "api/v1/category/subcategory";
export const USERS_URL = "api/v1/users";
export const ORDERS_URL = "api/v1/orders";
export const DASHBOARD_URL = "api/v1/dashboard";
export const OTP_URL = "api/v1/otp";
export const UPLOAD_URL = "api/v1/upload";
export const BRAND_URL = "api/v1/brand";
export const REVIEW_URL = "api/v1/review";
export const FAVORITE_URL = "api/v1/favorite";
export const RECAPTCHA_URL = "/api/v1/recaptcha";
export const PAYMENT_URL = "/api/v1/payments";

export const MAX_PRODUCT_IMAGES = 15;
export const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
