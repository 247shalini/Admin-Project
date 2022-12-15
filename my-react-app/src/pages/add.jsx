import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import Header from "../layouts/partials/header";
import axios from "axios";
import { showSuccess, showError } from "../utils/Toast";
import { addUserValidation } from "../utils/validations/Add";
import { getValidationErrors } from "../utils/helpers";

const initialValue = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
};

const AddUser = () => {
  const navigate = useNavigate();
  const [userValues, setUserValues] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState(initialValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newUserValues = Object.assign({}, userValues);
    newUserValues[name] = value.trim();
    setUserValues(newUserValues);
    // for errors
    const newFormErrors = Object.assign({}, formErrors);
    newFormErrors[name] = "";
    setFormErrors(newFormErrors);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("infooo --- ", userValues);
      addUserValidation.validateSync(userValues, {
        abortEarly: false,
      });
      await axios
        .post("http://localhost:8000/admin/add-user", {
          userValues,
        })
        .then((res) => {
          setUserValues(initialValue);
          navigate("/home");
          showSuccess(res.data.message);
        })
        .catch((error) => {
          console.log("error", error);
          showError(error.response.data.errors);
        });
    } catch (error) {
      console.log("catch error", error);
      setFormErrors(getValidationErrors(error));
    }
  };

  // console.log("res --", localStorage.getItem("superAdminSession"));
  if (localStorage.getItem("superAdminSession")) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="flex-row align-items-center mb-5">
            <div className="custom-card-design-wrap">
              <div className="custom-card-header d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="title">
                  <svg
                    viewBox="0 0 24 24"
                    width="40"
                    height="24"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="css-i6dzq1"
                  >
                    <>
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </>
                  </svg>
                  Add User
                </h4>
                <a href="/home">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>{" "}
                  Back
                </a>
              </div>
              <div className="custom-card-body position-relative my-4">
                <div class="admin-form-wrapper2">
                  <Col md={12}>
                    <Row>
                      <Col md={4}>
                        <Form.Group
                          className="admin-custom-form mb-4"
                          controlId="formBasicName"
                        >
                          <Form.Label>
                            First Name <span className="mandatory">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=""
                            name="firstName"
                            onChange={handleChange}
                          />
                          {formErrors.firstName ? (
                            <div className="error-msg">
                              {formErrors.firstName}
                            </div>
                          ) : null}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group
                          className="admin-custom-form mb-4"
                          controlId="formBasicLastName"
                        >
                          <Form.Label>
                            Last Name <span className="mandatory">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=""
                            name="lastName"
                            onChange={handleChange}
                          />
                          {formErrors.lastName ? (
                            <div className="error-msg">
                              {formErrors.lastName}
                            </div>
                          ) : null}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group
                          className="admin-custom-form mb-4"
                          controlId="formBasicEmails"
                        >
                          <Form.Label>
                            Email <span className="mandatory">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=""
                            name="email"
                            className="text-lowercase"
                            onChange={handleChange}
                          />
                          {formErrors.email ? (
                            <div className="error-msg">{formErrors.email}</div>
                          ) : null}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group
                          className="admin-custom-form mb-4"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>
                            Password <span className="mandatory">*</span>
                          </Form.Label>
                          <Form.Control
                            type="password"
                            placeholder=""
                            name="password"
                            className="text-lowercase"
                            onChange={handleChange}
                          />
                          {formErrors.password ? (
                            <div className="error-msg">
                              {formErrors.password}
                            </div>
                          ) : null}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group
                          className="admin-custom-form mb-4"
                          controlId="formBasicRole"
                        >
                          <Form.Label>
                            Role <span className="mandatory">*</span>
                          </Form.Label>
                          <select
                            id="role"
                            value={userValues.role}
                            onChange={handleChange}
                            name="role"
                          >
                            <option value="">Select a role</option>
                            <option value="Admin">Admin</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Student">Student</option>
                          </select>
                          {formErrors.role ? (
                            <div className="error-msg">{formErrors.role}</div>
                          ) : null}
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                  <div className="step-btn-wrap text-center pt-3">
                    <div className="d-flex justify-content-center flex-wrap align-items-center">
                      <button
                        type={"submit"}
                        className="btn btn-primary active"
                        onClick={handleFormSubmit}
                        disabled={isLoading}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    navigate("/login");
  }
};

export default AddUser;
