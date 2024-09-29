import React, { useEffect, useState } from "react";
import Table from "../shared/table/AgentTable";
import PaginationApp from "../shared/page/PaginationApp";
import { Modal, Button, Form } from "react-bootstrap";
import {
  GetAllAgent,
  DeleteAgentService,
  EditAgentService,
  SaveAgent,
} from "../../services/agent/Agent";
import PageSizeSetter from "../shared/page/PageSizeSetter";
import Navbar from "../shared/navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";
import validator from "validator";
import { getAllStates, getCitiesByState } from "../../stateService";

const AddAgent = () => {
  const [pageSize, setPageSize] = useState(3);
  const [pageNumber, setPageNumber] = useState(0);
  const [data, setData] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [formData, setFormData] = useState({
    FIRSTNAME: "",
    LASTNAME: "",
    MOBILE: "",
    EMAIL: "",
    DATEOFBIRTH: "",
    USERNAME: "",
    PASSWORD: "",
    HOUSENO: "",
    APARTMENT: "",
    CITY: "",
    STATE: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [employee, setEmployee] = useState();
  const [onDelete, setOnDelete] = useState();
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");

  const getAgents = async () => {
    try {
      let response = await GetAllAgent(pageNumber, pageSize);
      if (response && response.data) {
        setData(response.data.content || []);
        setTotalRecord(response.headers["agent-count"] || 0);
        setTotalPage(
          Math.ceil((response.headers["agent-count"] || 0) / pageSize)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const [states] = useState(getAllStates());
  const [cities, setCities] = useState([]);
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    const cityList = getCitiesByState(state);
    setCities(cityList);
    setFormData({ ...formData, state, city: "" });
  };

  useEffect(() => {
    getAgents();
  }, [pageNumber, pageSize, employee, onDelete]);

  useEffect(() => {
    setPageNumber(0);
    getAgents();
  }, [pageSize]);

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const validateForm = () => {
    const errors = {};

    // First name validation
    if (!formData.firstName) {
      errors.firstName = "First Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      errors.firstName = "First Name must contain only letters and spaces.";
    }

    // Last name validation
    if (!formData.lastName) {
      errors.lastName = "Last Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      errors.lastName = "Last Name must contain only letters and spaces.";
    }

    // Mobile number validation
    if (!formData.mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Mobile number must be exactly 10 digits.";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!validator.isEmail(formData.email)) {
      errors.email = "Email is invalid.";
    }

    // Username validation
    if (!formData.username) {
      errors.username = "Username is required.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username =
        "Username must only contain letters, numbers, and underscores.";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (
      !validator.isStrongPassword(formData.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      errors.password =
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required.";
    } else {
      const currentDate = new Date();
      const dob = new Date(formData.dateOfBirth);
      const age = currentDate.getFullYear() - dob.getFullYear();
      const monthDifference = currentDate.getMonth() - dob.getMonth();
      const dayDifference = currentDate.getDate() - dob.getDate();

      if (
        age < 18 ||
        (age === 18 &&
          (monthDifference < 0 ||
            (monthDifference === 0 && dayDifference < 0)))
      ) {
        errors.dateOfBirth = "Agent must be at least 18 years old.";
      }
    }

    // Pin code validation
    if (!formData.pinCode) {
      errors.pinCode = "Pin Code is required.";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      errors.pinCode = "Pin Code must be exactly 6 digits.";
    }

    // Required fields validation
    if (!formData.houseNo) errors.houseNo = "House Number is required.";
    if (!formData.apartment) errors.apartment = "Apartment is required.";
    if (!formData.city) errors.city = "City is required.";
    if (!formData.state) errors.state = "State is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let response;
      if (id) {
        response = await EditAgentService({ id, ...formData });
        toast.success("Agent updated successfully!");
      } else {
        response = await SaveAgent(formData);
        toast.success("Agent added successfully!");
      }

      setShowModal(false);
      getAgents();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const updateAgent = (agent) => {
    setFormData(agent);
    setId(agent.id);
    setShowModal(true);
  };

  const DeleteAgent = async (data) => {
    try {
      let response = await DeleteAgentService(data.id);
      setOnDelete(response);
      toast.success("Agent deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
      <div className='bg-warning text-center display-3 py-3 text-dark fw-bold'>Agent Management</div>
        <div className="row mb-3 align-items-center">
          <div className="col-md-2">
            <PageSizeSetter
              setPageSize={setPageSize}
              setTotalpage={setTotalPage}
              totalrecord={totalRecord}
              pageSize={pageSize}
              setPageNumber={setPageNumber}
            />
          </div>
          <div className="col-md-10 text-end">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add New Agent
            </Button>
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{id ? "Update Agent" : "Add New Agent"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              className="shadow-lg p-4 rounded border border-warning"
              onSubmit={handleSubmit}
            >
              <div className="h3 mb-4 text-center">Profile Details</div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label">
                    First Name*
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill agent-name-highlight"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {formErrors.firstName && (
                    <div className="text-danger">{formErrors.firstName}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill agent-name-highlight"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {formErrors.lastName && (
                    <div className="text-danger">{formErrors.lastName}</div>
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label htmlFor="mobile" className="form-label">
                    Mobile No*
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  {formErrors.mobile && (
                    <div className="text-danger">{formErrors.mobile}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email*
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {formErrors.email && (
                    <div className="text-danger">{formErrors.email}</div>
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label htmlFor="username" className="form-label">
                    Username*
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {formErrors.username && (
                    <div className="text-danger">{formErrors.username}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">
                    Password*
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-pill"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {formErrors.password && (
                    <div className="text-danger">{formErrors.password}</div>
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    className="form-control rounded-pill"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                  {formErrors.dateOfBirth && (
                    <div className="text-danger">{formErrors.dateOfBirth}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="houseNo" className="form-label">
                    House No*
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="houseNo"
                    name="houseNo"
                    value={formData.houseNo}
                    onChange={handleChange}
                  />
                  {formErrors.houseNo && (
                    <div className="text-danger">{formErrors.houseNo}</div>
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label htmlFor="apartment" className="form-label">
                    Apartment*
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                  />
                  {formErrors.apartment && (
                    <div className="text-danger">{formErrors.apartment}</div>
                  )}
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    as="select"
                    name="state"
                    onChange={handleStateChange}
                    value={formData.state}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    as="select"
                    name="city"
                    onChange={handleChange}
                    value={formData.city}
                    disabled={!selectedState}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <div className="col-md-6">
                  <label htmlFor="pinCode" className="form-label">
                    Pin Code*
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="pinCode"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                  />
                  {formErrors.pinCode && (
                    <div className="text-danger">{formErrors.pinCode}</div>
                  )}
                </div>
              </div>
              <button type="submit" className="btn btn-primary rounded-pill">
                {id ? "Update" : "Add"}
              </button>
            </form>
          </Modal.Body>
        </Modal>

        <Table data={data} deleteAgent={DeleteAgent} updateAgent={updateAgent} />
        <PaginationApp
          totalPage={totalPage}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </div>
      <ToastContainer />
      <style jsx="true">{`
        .container {
          max-width: 1800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .row {
          margin-bottom: 20px;
        }

        .form-control {
          border: 2px solid #007bff;
          padding: 10px;
          border-radius: 25px;
          font-size: 16px;
        }

        .form-control:focus {
          border-color: #0056b3;
          outline: none;
        }

        .btn-primary {
          padding: 10px 20px;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #007bff;
          color: white;
        }

        .table {
          width: 100%;
          margin-top: 20px;
          background-color: white;
        }

        .table th,
        .table td {
          padding: 12px;
          text-align: center;
          border: 1px solid #ddd;
        }

        .table-hover tbody tr:hover {
          background-color: #f1f1f1;
        }

        .thead-light th {
          background-color: #f8f9fa;
        }

        /* New class for agent name with gold/yellow background */
        .agent-name-highlight {
          background-color: #ffd700; /* Gold color */
          color: black; /* Ensure text is readable */
          padding: 5px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default AddAgent;
