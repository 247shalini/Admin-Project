import * as yup from "yup";

export const addUserValidation = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("First name required")
    .matches(/^[a-zA-Z() ]+$/, "First Name must contain alphabets only")
    .min(2, "First Name must be at least 2 characters")
    .max(20, "First Name length must not exceed 20 characters"),
  lastName: yup
    .string()
    .trim()
    .required("Last name required")
    .matches(/^[a-zA-Z() ]+$/, "Last Name must contain alphabets only")
    .min(2, "Last Name must be at least 2 characters")
    .max(20, "Last Name length must not exceed 20 characters"),
  email: yup
    .string()
    .trim()
    .required("Email required")
    .email("Please enter valid email"),
  password: yup
    .string()
    .required("Password required")
    .max(20, "Password length must not exceed 20 characters")
    .matches(
      /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{8,50}$/,
      "Password should be at least 8 characters long and must contain at least one alphabet and one number"
    ),

  role: yup.string().trim().required("User role required"),
  // status: yup.string().trim().required("Status required"),
});
