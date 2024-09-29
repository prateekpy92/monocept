import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';

function EditEmployee({
  firstName, lastName, mobile, email, dob, show, 
  setFirstName, setLastName, setMobileNumber, setEmail, setDob, setShow, editData
}) {
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false); // Track if form is valid

  const handleClose = () => setShow(false);

  // Validate the form
  const validateForm = () => {
    const errors = {};

    // First name validation
    if (!firstName) {
      errors.firstName = "First Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      errors.firstName = "First Name must contain only letters and spaces.";
    }

    // Last name validation
    if (!lastName) {
      errors.lastName = "Last Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      errors.lastName = "Last Name must contain only letters and spaces.";
    }

    // Mobile number validation
    if (!mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile)) {
      errors.mobile = "Mobile number must be exactly 10 digits.";
    }

    // Email validation
    if (!email) {
      errors.email = "Email is required.";
    } else if (!validator.isEmail(email)) {
      errors.email = "Email is invalid.";
    }

    // Date of birth validation
    const currentDate = new Date();
    const birthDate = new Date(dob);
    const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
    const ageLimit = 18;

    if (!dob) {
      errors.dob = "Date of birth is required.";
    } else if (birthDate > currentDate) {
      errors.dob = "Date of birth cannot be in the future.";
    } else if (ageDifference < ageLimit || (ageDifference === ageLimit && currentDate < new Date(birthDate.setFullYear(birthDate.getFullYear() + ageLimit)))) {
      errors.dob = "Employee must be at least 18 years old.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // useEffect to check form validity every time a field changes
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [firstName, lastName, mobile, email, dob]); // Trigger validation when any field changes

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Calling the editData function to submit the updated employee details
      await editData();

      // Success message
      toast.success('Employee details updated successfully!');
      setShow(false);

    } catch (error) {
      toast.error('Failed to update employee details.');
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className='text-center'>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="p-2">
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control rounded-pill text-primary fw-bold"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
              {formErrors.firstName && (
                <div className="text-danger">{formErrors.firstName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control rounded-pill text-primary fw-bold"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
              {formErrors.lastName && (
                <div className="text-danger">{formErrors.lastName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Mobile</label>
              <input
                type="text"
                className="form-control rounded-pill text-primary fw-bold"
                onChange={(e) => setMobileNumber(e.target.value)}
                value={mobile}
              />
              {formErrors.mobile && (
                <div className="text-danger">{formErrors.mobile}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                className="form-control rounded-pill text-primary fw-bold"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              {formErrors.email && (
                <div className="text-danger">{formErrors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Date Of Birth</label>
              <input
                type="date"
                className="form-control rounded-pill text-primary fw-bold"
                onChange={(e) => setDob(e.target.value)}
                value={dob}
              />
              {formErrors.dob && (
                <div className="text-danger">{formErrors.dob}</div>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-outline-secondary' onClick={handleClose}>Close</button>
          <button className='btn btn-outline-primary' onClick={handleSubmit} disabled={!isFormValid}>Update</button>
          {/* Disabled based on form validity */}
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
}

export default EditEmployee;
