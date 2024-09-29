import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/navbar/Navbar';
import profile from "../../images/profile.webp";
import { emailRegex, mobileRegex, nameRegex } from "../../validation/Validation";
import { errorEmail, errorFirstname, errorLastname } from "../../validation/ErrorMessage";
import { getCustomerByUsername, updateCustomerService } from '../../services/customer/CustomerService';
import Footer from '../shared/footer/Footer';

function CustomerProfile() {
    const [id, setId] = useState();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [msg, setMsg] = useState(""); 
    const [formErrors, setFormErrors] = useState({}); // To store form errors
    const [isFormValid, setIsFormValid] = useState(false); 
    const navigate = useNavigate();

    const getCustomerData = async () => {
        try {
            let response = await getCustomerByUsername(localStorage.getItem('username'));
            if (response && response.data) {
                setId(response.data.id);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setMobileNumber(response.data.mobile);
                setDateOfBirth(response.data.dateOfBirth);
                setEmail(response.data.email);
            }
        } catch (error) {
            setMsg("Failed to fetch customer data. Please try again.");
        }
    };

    const val = {
        id,
        firstName,
        lastName,
        mobile: mobileNumber,
        email,
        dateOfBirth
    };

    const editCustomerProfiledata = async () => {
        try {
            let response = await updateCustomerService(val);
            alert("Customer updated successfully!");
            navigate("/customer");
        } catch (error) {
            setMsg("Error updating customer profile. Please try again.");
        }
    };

    const getCurrentDate = () => {
        return new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    };

    const validateForm = () => {
        const errors = {};
        if (!nameRegex.test(firstName)) {
            errors.firstName = errorFirstname;
        }
        if (!nameRegex.test(lastName)) {
            errors.lastName = errorLastname;
        }
        if (!mobileRegex.test(mobileNumber)) {
            errors.mobile = "Invalid mobile number";
        }
        if (!emailRegex.test(email)) {
            errors.email = errorEmail;
        }
        if (dateOfBirth > getCurrentDate()) {
            errors.dateOfBirth = "Date of birth cannot be in the future";
        }
        setFormErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    };

    useEffect(() => {
        getCustomerData();
    }, []);

    useEffect(() => {
        validateForm();
    }, [firstName, lastName, mobileNumber, email, dateOfBirth]);

    return (
        <div>
            <Navbar />
            <div className='bg-warning text-center display-3 py-3 text-dark fw-bold'>Customer Profile</div>
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
                                        }}
                                    />
                                    {formErrors.firstName && (
                                        <div className="text-danger">{formErrors.firstName}</div>
                                    )}
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
                                        }}
                                    />
                                    {formErrors.lastName && (
                                        <div className="text-danger">{formErrors.lastName}</div>
                                    )}
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
                                    {formErrors.email && (
                                        <div className="text-danger">{formErrors.email}</div>
                                    )}
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
                                    {formErrors.mobile && (
                                        <div className="text-danger">{formErrors.mobile}</div>
                                    )}
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">DOB</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        placeholder="YYYY-MM-DD"
                                        value={dateOfBirth}
                                        max={getCurrentDate()}
                                        onChange={(e) => {
                                            setDateOfBirth(e.target.value);
                                        }}
                                    />
                                    {formErrors.dateOfBirth && (
                                        <div className="text-danger">{formErrors.dateOfBirth}</div>
                                    )}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-6 d-flex">
                                    <button
                                        className="btn btn-warning fw-bold"
                                        type="button"
                                        onClick={() => {
                                            getCustomerData();
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="btn btn-primary px-3 fw-bold ms-3"
                                        type="button"
                                        onClick={() => {
                                            editCustomerProfiledata();
                                        }}
                                        disabled={!isFormValid}
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
}

export default CustomerProfile;
