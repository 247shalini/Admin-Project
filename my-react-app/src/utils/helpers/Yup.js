import { object } from "dot-object";
/**
 * Converts yup error to object
 * @param {*} error
 */
export const getValidationErrors = (error) => {
  let message = {};
  error.inner.forEach((err) => {
    if (!message[err.path]) {
      message[err.path] = err.message;
    }
  });
  return object(message);
};
