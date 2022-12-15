import * as yup from "yup";

export const LoginValidation = yup.object().shape({
  email: yup
    .string()
    .required("Email required")
    .email("Invalid email"),
  password: yup
    .string()
    .required("Password required")
});
