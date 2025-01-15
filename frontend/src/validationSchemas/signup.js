import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(4, "min 2 characters")
    .max(80, "Name is too long, Max(80)")
    .required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: Yup.string().trim().required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
