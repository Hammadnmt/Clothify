import * as Yup from "yup";

export const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Please provide the product name")
    .max(100, "Name cannot exceed 100 characters"),

  description: Yup.string()
    .trim()
    .required("Please provide the product description"),

  category: Yup.string().required("Please select a category"),

  subCategory: Yup.string().required("Please select a sub-category"),

  // tags: Yup.string().nullable(),

  brand: Yup.string().required("Please provide the brand name"),
});
