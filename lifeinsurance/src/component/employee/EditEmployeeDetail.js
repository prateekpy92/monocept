import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar/Navbar";
import {
  EmployeeByUsername,
  EditEmployeeService
} from "../../services/employee/Employee";
import { emailRegex, mobileRegex, nameRegex } from "../../validation/Validation";
import { errorEmail, errorFirstname, errorLastname, errorMobile } from "../../validation/ErrorMessage";
import { useNavigate } from "react-router-dom";
import profile from "../../images/profile.webp";

function EditProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [isValidForm, setIsValidForm] = useState(false);
  const [ageError, setAgeError] = useState(""); // New state for age validation
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = new useNavigate();

  const getEmployeeDetails = async () => {
    try {
      let response = await EmployeeByUsername(localStorage.getItem("username"));
      setData(response.data);
      setFirstName(response.data.userDetails.firstName);
      setLastName(response.data.userDetails.lastName);
      setMobile(response.data.userDetails.mobileNumber);
      setEmail(response.data.userDetails.email);
      setDob(response.data.userDetails.dateOfBirth);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  const saveEmployeeDetail = async () => {
    try {
      let response = await EditEmployeeService(
        data.employeeId,
        firstName,
        lastName,
        mobile,
        email,
        dob
      );
      if (response.status === 200) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const validateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1;
    }
    return age;
  };

  useEffect(() => {
    const isFormValid =
      nameRegex.test(firstName) &&
      nameRegex.test(lastName) &&
      mobileRegex.test(mobile) &&
      emailRegex.test(email) &&
      validateAge(dob) >= 18;

    setIsValidForm(isFormValid);
    setAgeError(validateAge(dob) < 18 ? "Employee must be at least 18 years old." : "");
  }, [firstName, lastName, mobile, email, dob]);

  return (
    <div>
      <Navbar />
      <div className="container rounded">
        <div className="row offset-1 justify-content-between">
          <div className="col-md-3 border-right bg-white">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img className="rounded-circle mt-5" width="220px" src={profile} alt="Profile" />
              <span className="font-weight-bold">{firstName + " " + lastName}</span>
              <span className="text-black-50">{email}</span>
            </div>
          </div>

          <div className="col-8 border-right bg-white">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Profile Details</h4>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <label className="labels">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (!nameRegex.test(e.target.value)) {
                        setFirstNameError(errorFirstname);
                      } else {
                        setFirstNameError("");
                      }
                    }}
                  />
                  {firstNameError && <div className="text-danger">{firstNameError}</div>}
                </div>
                <div className="col-md-6">
                  <label className="labels">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (!nameRegex.test(e.target.value)) {
                        setLastNameError(errorLastname);
                      } else {
                        setLastNameError("");
                      }
                    }}
                  />
                  {lastNameError && <div className="text-danger">{lastNameError}</div>}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="labels">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!emailRegex.test(e.target.value)) {
                        setEmailError(errorEmail);
                      } else {
                        setEmailError("");
                      }
                    }}
                  />
                  {emailError && <div className="text-danger">{emailError}</div>}
                </div>
                <div className="col-md-6">
                  <label className="labels">Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      if (!mobileRegex.test(e.target.value)) {
                        setMobileError(errorMobile);
                      } else {
                        setMobileError("");
                      }
                    }}
                  />
                  {mobileError && <div className="text-danger">{mobileError}</div>}
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6">
                  <label className="labels">DOB</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  {ageError && <div className="text-danger">{ageError}</div>}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-6 d-flex">
                  <button
                    className="btn btn-warning fw-bold"
                    type="button"
                    onClick={getEmployeeDetails}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-primary px-3 fw-bold ms-3"
                    type="button"
                    onClick={saveEmployeeDetail}
                    disabled={!isValidForm}
                  >
                    Save
                  </button>
                </div>
              </div>

            </div>
          </div>
          <div style={{ marginTop: "30vh" }}></div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
