import * as Yup from "yup";

export const userAddSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(4, "Min 4 characters")
    .max(80, "Name is too long, Max(80)")
    .required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  role: Yup.string()
    .oneOf(["user", "admin"], "Role must be either 'user' or 'admin'")
    .required("Role is required"),
});

export const userUpdateSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(4, "Min 4 characters")
    .max(80, "Name is too long, Max(80)")
    .required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  role: Yup.string()
    .oneOf(["user", "admin"], "Role must be either 'user' or 'admin'")
    .required("Role is required"),
});

export const userEmailSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export const userPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
