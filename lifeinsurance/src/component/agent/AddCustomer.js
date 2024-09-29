import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Navbar from "../shared/navbar/Navbar";
import Footer from "../shared/footer/Footer";
import {
  saveCustomer,
  getAllCustomer,
  
} from "../../services/customer/CustomerService";
import Table from "../../component/shared/table/Table";
import PageSizeSetter from "../shared/page/PageSizeSetter";
import PaginationApp from "../shared/page/PaginationApp";
import {
  eightCharAlphanumericPasswordRegex,
  emailRegex,
  houseNoRegex,
  mobileRegex,
  nameRegex,
  pinRegex,
} from "../../validation/Validation";
import {
  errorCity,
  errorEmail,
  errorFirstname,
  errorHouseNo,
  errorLastname,
  errorMobile,
  errorPassword,
  errorPin,
  errorState,
} from "../../validation/ErrorMessage";

const AddCustomer = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [actionData, setActionData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [totalpage, setTotalpage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [msg, setMsg] = useState("");

  const data = {
    firstName,
    lastName,
    username,
    password,
    dateOfBirth,
    mobileNumber,
    email,
    houseNo,
    apartment,
    city,
    pincode,
    state,
  };

  const addCustomerData = async () => {
    try {
      await saveCustomer(data);
      setModalShow(false);
      GetAll();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const GetAll = async () => {
    let response = await getAllCustomer(pageNumber, pageSize);
    setActionData(response.data.content);
    setTotalpage(
      Math.ceil(parseInt(response.headers["customer-count"]) / pageSize)
    );
    setTotalElements(
      Math.ceil(parseInt(response.headers["customer-count"]) / pageSize)
    );
  };

  useEffect(() => {
    GetAll();
  }, [pageNumber, pageSize, totalpage, totalElements]);

  return (
    <>
      <Navbar />

      <div className="bg-dark text-center display-3 py-3 text-white fw-bold">
        Customer Management
      </div>

      <div className="container">
        <div className="row my-3 align-items-center">
          <div className="col-2">
            <Button
              variant="primary"
              className="mb-3 btn-lg fw-bold"
              onClick={() => setModalShow(true)}
            >
              Add New Customer
            </Button>
          </div>

          <div className="col-4 offset-1">
            <PaginationApp
              totalpage={totalpage}
              setpage={setPageNumber}
              pageNumber={pageNumber}
            />
          </div>

          <div className="col-3">
            <input
              className="form-control rounded-pill text-primary fw-bold"
              placeholder="Search here"
            />
          </div>

          <div className="col-2">
            <PageSizeSetter
              setPageSize={setPageSize}
              setTotalpage={setTotalpage}
              totalrecord={totalElements}
              pageSize={pageSize}
              setPageNumber={setPageNumber}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <Table
          data={actionData}
          isDeleteButton={true}
          isUpdateButton={false}
          deleteFun={""}
        />
      </div>

      {/* Modal for Add Customer */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Add New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="row g-3">
            <div className="text-danger text-center fw-bold">{msg}</div>
            <div className="col-md-6">
              <label className="form-label fw-bold">First Name</label>
              <input
                type="text"
                className="form-control rounded-5"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (!nameRegex.test(e.target.value)) {
                    setMsg(errorFirstname);
                  } else {
                    setMsg("");
                  }
                }}
              />
              {msg === errorFirstname && (
                <div className="text-danger">{msg}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Last Name</label>
              <input
                type="text"
                className="form-control rounded-5"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (!nameRegex.test(e.target.value)) {
                    setMsg(errorLastname);
                  } else {
                    setMsg("");
                  }
                }}
              />
              {msg === errorLastname && (
                <div className="text-danger">{msg}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Username</label>
              <input
                type="text"
                className="form-control rounded-5"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                className="form-control rounded-5"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!eightCharAlphanumericPasswordRegex.test(e.target.value)) {
                    setMsg(errorPassword);
                  } else {
                    setMsg("");
                  }
                }}
              />
              {msg === errorPassword && (
                <div className="text-danger">{msg}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control rounded-5"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!emailRegex.test(e.target.value)) {
                    setMsg(errorEmail);
                  } else {
                    setMsg("");
                  }
                }}
              />
              {msg === errorEmail && <div className="text-danger">{msg}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Mobile</label>
              <input
                type="text"
                className="form-control rounded-5"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  if (!mobileRegex.test(e.target.value)) {
                    setMsg(errorMobile);
                  } else {
                    setMsg("");
                  }
                }}
              />
              {msg === errorMobile && (
                <div className="text-danger">{msg}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Date Of Birth</label>
              <input
                type="date"
                className="form-control rounded-5"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">House Number</label>
              <input
                type="text"
                className="form-control rounded-5"
                value={houseNo}
                onChange={(e) => {
                  setHouseNo(e.target.value);
                  if (!houseNoRegex.test(e.target.value)) {
                    setMsg(errorHouseNo);
                  } else {
                    setMsg("");
                  }
                }}
              />
              {msg === errorHouseNo && (
                <div className="text-danger">{msg}</div>
              )}
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Apartment</label>
              <input
                type="text"
                className="form-control rounded-5"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">City</label>
              <input
                type="text"
                className="form-control rounded-5"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (!nameRegex.test(e.target.value)) {
                    setMsg(errorCity);
                  } else {
                    setMsg("");
                  }
                }}
              />
              {msg === errorCity && <div className="text-danger">{msg}</div>}
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">State</label>
              <input
                type="text"
                className="form-control rounded-5"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  if (!nameRegex.test(e.target.value)) {
                    setMsg(errorState);
                  } else {
                    setMsg("");
                  }
                }}
              />
              {msg === errorState && <div className="text-danger">{msg}</div>}
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">PinCode</label>
              <input
                type="text"
                className="form-control rounded-5"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value);
                  if (!pinRegex.test(e.target.value)) {
                    setMsg(errorPin);
                  } else {
                    setMsg("");
                  }
                }}
              />
              {msg === errorPin && <div className="text-danger">{msg}</div>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={addCustomerData}
            disabled={msg !== ""}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default AddCustomer;
