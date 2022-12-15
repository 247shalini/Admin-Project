import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Dropdown, DropdownButton } from "react-bootstrap";
import Header from "../layouts/partials/header";
import axios from "axios";
import { showSuccess, showError } from "../utils/Toast";
import { userValidation } from "../utils/validations/User";
import { getValidationErrors } from "../utils/helpers";

const initialValue = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  status: "",
};

const View = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState(initialValue);
  const [roleValue, setRoleValue] = useState("");

  const onInputChange = (e) => {
    const { name, value } = e.target;
    console.log("res --", name, value);
    const newFormValues = Object.assign({}, userInfo);
    newFormValues[name] = value.trim();
    setUserInfo(newFormValues);
    // for errors
    const newFormErrors = Object.assign({}, formErrors);
    newFormErrors[name] = "";
    setFormErrors(newFormErrors);
  };

  const handleSelect = (e) => {
    setRoleValue(e);
  };

  const getUserInfo = async () => {
    try {
      await axios
        .get(
          `http://localhost:8000/admin/user-info?id=${searchParams.get("id")}`
        )
        .then((res) => {
          const user = res.data.details;
          setUserInfo({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status,
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    } catch (error) {
      console.log("catch error", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      userValidation.validateSync(userInfo, {
        abortEarly: false,
      });
      const userRole = roleValue ? roleValue : userInfo?.role;
      console.log("error", userInfo, userRole);
      await axios
        .post(`http://localhost:8000/admin/update/${searchParams.get("id")}`, {
          userInfo,
          userRole,
        })
        .then((res) => {
          setUserInfo(initialValue);
          navigate("/home");
          showSuccess(res.data.message);
        })
        .catch((error) => {
          console.log("error", error);
          showError(error.response.data.error);
        });
    } catch (error) {
      console.log("catch error", error);
      setFormErrors(getValidationErrors(error));
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </>
                </svg>
                Edit User
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
              <div class="admin-form-wrapper1">
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
                          value={userInfo?.firstName}
                          onChange={onInputChange}
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
                          value={userInfo?.lastName}
                          onChange={onInputChange}
                        />
                        {formErrors.lastName ? (
                          <div className="error-msg">{formErrors.lastName}</div>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group
                        className="admin-custom-form mb-4"
                        controlId="formBasicEmail"
                      >
                        <Form.Label>
                          Email <span className="mandatory">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder=""
                          name="email"
                          value={userInfo?.email}
                          className="text-lowercase"
                          onChange={onInputChange}
                        />
                        {formErrors.email ? (
                          <div className="error-msg">{formErrors.email}</div>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Form.Group
                        className="admin-custom-form mb-4"
                        controlId="formBasicRole"
                      >
                        <Form.Label>
                          Role <span className="mandatory">*</span>
                        </Form.Label>

                        <DropdownButton
                          alignRight
                          title={roleValue ? roleValue : userInfo?.role}
                          id="user-role-dropdown-menu"
                          name="role"
                          onSelect={handleSelect}
                        >
                          <Dropdown.Item eventKey="Admin">Admin</Dropdown.Item>
                          <Dropdown.Item eventKey="Student">
                            Student
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="Teacher">
                            Teacher
                          </Dropdown.Item>
                        </DropdownButton>
                        {formErrors.role ? (
                          <div className="error-msg">{formErrors.role}</div>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="status"
                        value={userInfo?.status}
                        disabled
                      />
                      {formErrors.status ? (
                        <div className="error-msg">{formErrors.status}</div>
                      ) : null}
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
                      Update User
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
};

export default View;
