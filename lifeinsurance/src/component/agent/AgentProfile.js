import React, { useEffect, useState } from 'react';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';
import { EditAgentService, AgentByUsername } from '../../services/agent/Agent';
import { emailRegex, mobileRegex, nameRegex } from "../../validation/Validation";
import { errorEmail, errorFirstname, errorLastname } from "../../validation/ErrorMessage";
import profile from "../../images/profile.webp";

const AgentProfile = () => {
    const [id, setId] = useState();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [msg, setMsg] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);  // State for tracking form validity

    // Error states for individual fields
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [mobileNumberError, setMobileNumberError] = useState("");
    const [dobError, setDobError] = useState("");

    const getAgentData = async () => {
        try {
            const username = localStorage.getItem('username');
            if (!username) throw new Error("No username found in localStorage");

            const response = await AgentByUsername(username);
            if (response.status === 200) {
                setId(response.data.id);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setMobileNumber(response.data.mobileNumber);
                setDateOfBirth(response.data.dateOfBirth);
                setEmail(response.data.email);
            } else {
                throw new Error(`Failed to fetch data, status: ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to fetch agent data:", error.response ? error.response.data : error.message);
            setMsg("Failed to fetch agent data. Please check your credentials and try again.");
        }
    };

    const data = {
        id,
        firstName,
        lastName,
        dateOfBirth,
        mobile: mobileNumber,
        email
    };

    const editAgentProfiledata = async () => {
        try {
            let response = await EditAgentService(data);
            if (response.status === 200) {
                alert("Updated successfully");
            } else {
                throw new Error(`Failed to update data, status: ${response.status}`);
            }
        } catch (error) {
            console.error("Failed to update agent data:", error.response ? error.response.data : error.message);
            alert("Some issue occurred while updating. Please check your credentials and try again.");
        }
    };

    // Validate Date of Birth to be greater than 18 years
    const isAgeValid = (dob) => {
        const today = new Date();
        const dobDate = new Date(dob);
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        const dayDiff = today.getDate() - dobDate.getDate();
        return (age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0))));
    };

    // Validate form fields on change and show error messages
    const validateForm = () => {
        let isValid = true;

        // Validate first name
        if (!nameRegex.test(firstName)) {
            setFirstNameError(errorFirstname);
            isValid = false;
        } else {
            setFirstNameError("");
        }

        // Validate last name
        if (!nameRegex.test(lastName)) {
            setLastNameError(errorLastname);
            isValid = false;
        } else {
            setLastNameError("");
        }

        // Validate email
        if (!emailRegex.test(email)) {
            setEmailError(errorEmail);
            isValid = false;
        } else {
            setEmailError("");
        }

        // Validate mobile number
        if (!mobileRegex.test(mobileNumber)) {
            setMobileNumberError("Invalid mobile number");
            isValid = false;
        } else {
            setMobileNumberError("");
        }

        // Validate date of birth
        if (!isAgeValid(dateOfBirth)) {
            setDobError("You must be 18 years or older.");
            isValid = false;
        } else {
            setDobError("");
        }

        setIsFormValid(isValid);  // Set form validity based on the validations
    };

    useEffect(() => {
        getAgentData();
    }, []);

    useEffect(() => {
        validateForm();  // Validate form on every change of inputs
    }, [firstName, lastName, email, mobileNumber, dateOfBirth]);

    return (
        <div>
            <Navbar />
            <div className="container rounded">
                <div className="row offset-1 justify-content-between">
                    <div className="col-md-3 border-right bg-white">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img
                                className="rounded-circle mt-5"
                                width="220px"
                                src={profile}
                                alt="Profile"
                            />
                            <span className="font-weight-bold">{firstName + " " + lastName}</span>
                            <span className="text-black-50">{email}</span>
                        </div>
                    </div>
                    <div className="col-8 border-right bg-white">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Details</h4>
                            </div>
                            <div className="text-danger text-center">{msg}</div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">FirstName</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) => {
                                            setFirstName(e.target.value);
                                        }}
                                    />
                                    <small className="text-danger">{firstNameError}</small>
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">LastName</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={lastName}
                                        placeholder="Last name"
                                        onChange={(e) => {
                                            setLastName(e.target.value);
                                        }}
                                    />
                                    <small className="text-danger">{lastNameError}</small>
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
                                        }}
                                    />
                                    <small className="text-danger">{emailError}</small>
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Mobile</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Mobile"
                                        value={mobileNumber}
                                        onChange={(e) => {
                                            setMobileNumber(e.target.value);
                                        }}
                                    />
                                    <small className="text-danger">{mobileNumberError}</small>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">DOB</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="YYYY-MM-DD"
                                        value={dateOfBirth}
                                        onChange={(e) => {
                                            setDateOfBirth(e.target.value);
                                        }}
                                    />
                                    <small className="text-danger">{dobError}</small>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-6 d-flex">
                                    <button
                                        className="btn btn-warning fw-bold"
                                        type="button"
                                        onClick={() => getAgentData()}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="btn btn-primary px-3 fw-bold ms-3"
                                        type="button"
                                        onClick={() => editAgentProfiledata()}
                                        disabled={!isFormValid}  // Disable save button if form is invalid
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
            <Footer />
        </div>
    );
};

export default AgentProfile;
