import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, createSearchParams } from "react-router-dom";
import {
  Table,
  Col,
  Row,
  Form,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import Header from "../layouts/partials/header";
import { confirmBox, showError, showSuccess } from "../utils/Toast";
import PageLoader from "../utils/PageLoader";
import Pagination from "../common/Pagination";

const UserListComponent = () => {
  const [userData, setUserData] = useState([]);
  const [roleValue, setRoleValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(1);
  const [nPages, setPages] = useState("");
  const navigate = useNavigate();
  const pageNo = (currentPage - 1) * recordsPerPage + 1;
  useEffect(() => {
    const params = {
      ...(roleValue && { role: roleValue }),
      ...(statusValue && { status: statusValue }),
      ...(searchValue && { search: searchValue }),
      ...(currentPage && { page: currentPage }),
    };

    navigate({
      pathname: "/home",
      search: `?${createSearchParams(params)}`,
    });

    getUserList(roleValue, statusValue, searchValue, currentPage);
  }, [roleValue, statusValue, searchValue, currentPage]);

  const getUserList = async (role, status, search, page) => {
    console.log("filter --", role, status, search, page);
    try {
      await axios
        .get(
          `http://localhost:8000/admin/user-list?role=${role}&status=${status}&search=${search}&page=${page}`
        )
        .then((res) => {
          console.log("res --", res.data);
          setUserData(res.data.details);
          setCurrentPage(res.data.currentPage);
          setPages(res.data.nPages);
          setRecordsPerPage(res.data.recordsPerPage);
          setIsPageLoading(false);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } catch (error) {
      console.log("catch error", error);
    }
  };

  const removeSchool = async (id) => {
    const isTrue = await confirmBox(
      "You want to remove this user!",
      "Yes",
      "No"
    );
    if (isTrue) {
      try {
        const superAdminSession = localStorage.getItem("superAdminSession");
        // console.log("isTrue", superAdminSession, id);
        await axios
          .post(`http://localhost:8000/admin/delete/${id}`)
          .then((res) => {
            // console.log("res --", res.data.details);
            getUserList(roleValue, statusValue, searchValue, 1);
            showSuccess(res.data.message);
            setIsPageLoading(false);
          })
          .catch((error) => {
            // console.log("error", error.response.data.errors);
            showError(error.response.data.errors);
          });
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const updateStatus = async (id, status) => {
    const updateStatus = status === "Active" ? "Deactive" : "Active";
    const isTrue = await confirmBox(
      `You want to "${updateStatus}" this user!`,
      status === "Active" ? "Deactive" : "Active",
      "Cancel"
    );
    if (isTrue) {
      try {
        const superAdminSession = localStorage.getItem("superAdminSession");
        // console.log("isTrue", superAdminSession, id, updateStatus);
        await axios
          .post(`http://localhost:8000/admin/update/${id}`, {
            status: updateStatus,
          })
          .then((res) => {
            getUserList(roleValue, statusValue, searchValue, 1);
            showSuccess(res.data.message);
            setIsPageLoading(false);
          })
          .catch((error) => {
            console.log("error", error.response.data.errors);
            showError(error.response.data.errors);
          });
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  // console.log("res --", localStorage.getItem("superAdminSession"));

  if (localStorage.getItem("superAdminSession")) {
    return isPageLoading ? (
      <PageLoader />
    ) : (
      <>
        <Header />
        <div className="container">
          <div className="flex-row align-items-center mb-5">
            <div className="custom-card-design-wrap">
              <div className="custom-card-header d-flex justify-content-between align-items-center flex-wrap mt-5">
                <Col md={12}>
                  <Row>
                    <Col md={3}>
                      <Form.Label>
                        <h4 className="home-title">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <line x1="17" y1="10" x2="3" y2="10"></line>
                            <line x1="21" y1="6" x2="3" y2="6"></line>
                            <line x1="21" y1="14" x2="3" y2="14"></line>
                            <line x1="17" y1="18" x2="3" y2="18"></line>
                          </svg>{" "}
                          User List
                        </h4>
                      </Form.Label>
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="search"
                        placeholder="search by name"
                        name="searchName"
                        id="user-search"
                        className="p-1 bg-light"
                        onChange={(e) =>
                          setTimeout(() => {
                            setSearchValue(e.target.value);
                          }, 1000)
                        }
                      />
                    </Col>
                    <Col md={2}>
                      <DropdownButton
                        alignRight
                        title={roleValue ? roleValue : "Search by role"}
                        id="user-role-dropdown-menu"
                        name="role"
                        onSelect={(value) => setRoleValue(value)}
                      >
                        <Dropdown.Item eventKey="All">All</Dropdown.Item>
                        <Dropdown.Item eventKey="Admin">Admin</Dropdown.Item>
                        <Dropdown.Item eventKey="Student">
                          Student
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="Teacher">
                          Teacher
                        </Dropdown.Item>
                      </DropdownButton>
                    </Col>
                    <Col md={2}>
                      <DropdownButton
                        alignRight
                        title={statusValue ? statusValue : "Search by status"}
                        id="user-status"
                        name="status"
                        onSelect={(value) => setStatusValue(value)}
                      >
                        <Dropdown.Item eventKey="All">All</Dropdown.Item>
                        <Dropdown.Item eventKey="Active">Active</Dropdown.Item>
                        <Dropdown.Item eventKey="Deactive">
                          Deactive
                        </Dropdown.Item>
                      </DropdownButton>
                    </Col>
                    <Col md={2}>
                      <Link to={`/add`}>
                        <button
                          // onClick={() => setOpen(!open)}
                          class="btn btn-primary w-100"
                        >
                          Add User
                        </button>
                      </Link>
                    </Col>
                  </Row>
                </Col>
              </div>
              <div className="custom-card-body position-relative p-0">
                <div class="table-responsive">
                  <Table class="table table-hover table-striped mb-2">
                    <thead class="thead-dark">
                      <tr>
                        <th width="60px">S.No</th>
                        <th width="160px">First Name</th>
                        <th>Last Name</th>
                        <th width="300px">Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {console.log("tbody -- ", userData)} */}
                      {userData.length === 0 ? (
                        <tr className="text-capitalize">
                          <td colspan="7" className="text-center text-danger">
                            <b>!! NO DATA FOUND !!</b>
                          </td>
                        </tr>
                      ) : (
                        userData.map((item, key) => {
                          return (
                            <>
                              <tr className="text-capitalize" key={key}>
                                <td>{pageNo + key}.</td>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td className="text-lowercase">
                                  <a class="link" href="mailto:admin@gmail.com">
                                    {item.email}
                                  </a>
                                </td>
                                <td
                                  className="role"
                                  onClick={() => setRoleValue(item.role)}
                                >
                                  {item.role}
                                </td>
                                <td>
                                  <Badge
                                    pill
                                    bg={
                                      item.status === "Deactive"
                                        ? "danger mt-2"
                                        : "success mt-2"
                                    }
                                    onClick={() =>
                                      updateStatus(item._id, item.status)
                                    }
                                    class="badge"
                                  >
                                    {item.status}
                                  </Badge>{" "}
                                </td>
                                <td class="action-wrap text-center">
                                  <Link to={`/edit?id=${item._id}`}>
                                    <button class="btn btn-info mr-1 btn-sm">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      >
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                      </svg>
                                    </button>
                                  </Link>
                                  <span
                                    onClick={() => removeSchool(item._id)}
                                    class="btn btn-dark btn-sm mx-2"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    >
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      <line
                                        x1="10"
                                        y1="11"
                                        x2="10"
                                        y2="17"
                                      ></line>
                                      <line
                                        x1="14"
                                        y1="11"
                                        x2="14"
                                        y2="17"
                                      ></line>
                                    </svg>
                                  </span>
                                </td>
                              </tr>
                            </>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
              {console.log("pages --- ", nPages, currentPage)}
              <Pagination
                nPages={nPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    navigate("/login");
  }
};

export default UserListComponent;
