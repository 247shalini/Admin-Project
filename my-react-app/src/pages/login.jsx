import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getValidationErrors } from "../utils/helpers";
import { LoginValidation } from "../utils/validations";
import { Form } from "react-bootstrap";
import { showSuccess, showError } from "../utils/Toast";

export default function Login() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    const newFormValues = Object.assign({}, formValues);
    newFormValues[name] = value.trim();
    setFormValues(newFormValues);

    const newFormErrors = Object.assign({}, formErrors);
    newFormErrors[name] = "";
    setFormErrors(newFormErrors);
  };

  localStorage.removeItem("superAdminSession");

  const handleSubmit = async (e) => {
    //Prevent page reload
    e.preventDefault();
    try {
      LoginValidation.validateSync(formValues, {
        abortEarly: false,
      });
      await axios
        .post("http://localhost:8000/admin/login", formValues)
        .then((res) => {
          console.log(res);
          localStorage.setItem("superAdminSession", res.data.token);
          navigate("/home");
          showSuccess(res.data.message);
        })
        .catch((error) => {
          console.log("error", error.response.data.error);
          showError(error.response.data.error);
        });
    } catch (error) {
      console.log("catch error", error);
      setFormErrors(getValidationErrors(error));
    }
  };

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">
          <h2 className="text-center">Login</h2>
        </div>
        <div className="form">
          <Form onSubmit={handleSubmit} className={"form"}>
            <div className="input-container">
              <label>Email </label>
              <input type="text" name="email" onChange={onInputChange} />
            </div>
            {formErrors.email ? (
              <div className="error-msg">{formErrors.email}</div>
            ) : null}
            <div className="input-container">
              <label>Password </label>
              <input type="password" name="password" onChange={onInputChange} />
            </div>
            {formErrors.password ? (
              <div className="error-msg">{formErrors.password}</div>
            ) : null}
            <div className="button-container">
              <input type="submit" />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
