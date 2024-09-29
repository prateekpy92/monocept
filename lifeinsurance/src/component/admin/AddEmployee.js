import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { getAllStates, getCitiesByState } from '../../stateService';
import validator from 'validator';
import moment from 'moment'; // Add moment.js for date formatting

const AddEmployee = ({ data }) => {
    const {
        show, setShow, firstName, setFirstName, mobileNumber, setMobileNumber,
        salary, setSalary, userName, setUsername, password, setPassword,
        state, setState, pincode, setPincode, lastName, setLastName, email, setEmail,
        dateOfBirth, setDateOfBirth, houseNo, setHouseNo, apartment, setApartment,
        city, setCity, addEmployeeHandler
    } = data;

    const [msg, setMsg] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [selectedState, setSelectedState] = useState(''); // For state selection
    const [cities, setCities] = useState([]);
    const [states] = useState(getAllStates());
    const navigate = useNavigate();
    

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
        if (!mobileNumber) {
            errors.mobileNumber = "Mobile number is required.";
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            errors.mobileNumber = "Mobile number must be exactly 10 digits.";
        }

        // Email validation
        if (!email) {
            errors.email = "Email is required.";
        } else if (!validator.isEmail(email)) {
            errors.email = "Email is invalid.";
        }

        // Password validation
        if (!password) {
            errors.password = "Password is required.";
        } else if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })) {
            errors.password = "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.";
        }

        // Salary validation
        if (!salary) {
            errors.salary = "Salary is required.";
        } else if (isNaN(salary) || salary <= 0) {
            errors.salary = "Salary must be a valid number greater than 0.";
        }

        // Date of birth validation
        const currentDate = new Date().toISOString().split("T")[0];
        if (!dateOfBirth) {
            errors.dateOfBirth = "Date of birth is required.";
        } else if (dateOfBirth > currentDate) {
            errors.dateOfBirth = "Date of birth cannot be in the future.";
        }

        // House No validation
        if (!houseNo) {
            errors.houseNo = "House Number is required.";
        }

        // Apartment validation
        if (!apartment) {
            errors.apartment = "Apartment is required.";
        }

        // Pin code validation
        if (!pincode) {
            errors.pincode = "Pin Code is required.";
        } else if (!/^\d{6}$/.test(pincode)) {
            errors.pincode = "Pin Code must be exactly 6 digits.";
        }

        // City and state validation
        if (!city) {
            errors.city = "City is required.";
        }
        if (!state) {
            errors.state = "State is required.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            // Formatting the date of birth to "dd/MM/yyyy"
            const formattedDateOfBirth = moment(dateOfBirth).format('DD/MM/YYYY');

            const employeeData = {
                salary,
                username: userName,
                password,
                firstName,
                lastName,
                mobileNumber,
                email,
                dateOfBirth: formattedDateOfBirth, // Use formatted date here
                houseNo,
                apartment,
                city,
                state,
                pincode: parseInt(pincode) // Ensuring pincode is passed as a number
            };

            // Sending the employee data to the backend
            await addEmployeeHandler(employeeData);

            // Success message
            toast.success('Employee added successfully!');

            // Reset form fields after successful submission
            setFirstName('');
            setLastName('');
            setMobileNumber('');
            setSalary('');
            setUsername('');
            setPassword('');
            setEmail('');
            setDateOfBirth('');
            setHouseNo('');
            setApartment('');
            setPincode('');
            setCity('');
            setState('');

            setTimeout(() => {
                navigate('/all_employee'); // Redirect after success
            }, 1000);

        } catch (error) {
            console.error('Error adding employee:', error.response); // Log the detailed error
            toast.error('Failed to add employee.');
        } finally {
            setShow(false);
        }
    };

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        const cityList = getCitiesByState(state);
        setCities(cityList);
        setState(state);
        setCity('');
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
                    <Modal.Title>Add Employee</Modal.Title>
                </Modal.Header>
                <div className="text-danger text-center fw-bold">{msg}</div>
                <Modal.Body>
                    <form className="p-2">
                        <div className='container'>
                            <div className='row'>
                                <div className='col-6'>
                                    {/* First Name */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control rounded-pill"
                                            id="firstName"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                        <label htmlFor="firstName">First Name</label>
                                        {formErrors.firstName && (
                                            <div className="text-danger">{formErrors.firstName}</div>
                                        )}
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control rounded-pill"
                                            id="mobileNumber"
                                            placeholder="Mobile Number"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                        />
                                        <label htmlFor="mobileNumber">Mobile Number</label>
                                        {formErrors.mobileNumber && (
                                            <div className="text-danger">{formErrors.mobileNumber}</div>
                                        )}
                                    </div>

                                    {/* Salary */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control rounded-pill"
                                            id="salary"
                                            placeholder="Salary"
                                            value={salary}
                                            onChange={(e) => setSalary(e.target.value)}
                                        />
                                        <label htmlFor="salary">Salary</label>
                                        {formErrors.salary && (
                                            <div className="text-danger">{formErrors.salary}</div>
                                        )}
                                    </div>

                                    {/* Username */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control rounded-pill"
                                            id="userName"
                                            placeholder="Username"
                                            value={userName}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        <label htmlFor="userName">Username</label>
                                        {formErrors.userName && (
                                            <div className="text-danger">{formErrors.userName}</div>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control rounded-pill"
                                            id="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <label htmlFor="password">Password</label>
                                        {formErrors.password && (
                                            <div className="text-danger">{formErrors.password}</div>
                                        )}
                                    </div>

                                    {/* State */}
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-control rounded-pill"
                                            id="state"
                                            value={state}
                                            onChange={handleStateChange}
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state, index) => (
                                                <option key={index} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="state">State</label>
                                        {formErrors.state && (
                                            <div className="text-danger">{formErrors.state}</div>
                                        )}
                                    </div>

                                    {/* Pincode */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control rounded-pill"
                                            id="pincode"
                                            placeholder="Pincode"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                        />
                                        <label htmlFor="pincode">Pincode</label>
                                        {formErrors.pincode && (
                                            <div className="text-danger">{formErrors.pincode}</div>
                                        )}
                                    </div>
                                </div>
                                <div className='col-6'>
                                    {/* Last Name */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control rounded-pill"
                                            id="lastName"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                        <label htmlFor="lastName">Last Name</label>
                                        {formErrors.lastName && (
                                            <div className="text-danger">{formErrors.lastName}</div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control rounded-pill"
                                            id="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <label htmlFor="email">Email Address</label>
                                        {formErrors.email && (
                                            <div className="text-danger">{formErrors.email}</div>
                                        )}
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="date"
                                            className="form-control rounded-pill"
                                            id="dateOfBirth"
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                        />
                                        <label htmlFor="dateOfBirth">Date Of Birth</label>
                                        {formErrors.dateOfBirth && (
                                            <div className="text-danger">{formErrors.dateOfBirth}</div>
                                        )}
                                    </div>

                                    {/* House Number */}
                                    <div className="form-floating mb-4">
                                        <input
                                            type="text"
                                            className="form-control rounded-pill"
                                            id="houseNo"
                                            placeholder="House Number"
                                            value={houseNo}
                                            onChange={(e) => setHouseNo(e.target.value)}
                                        />
                                        <label htmlFor="houseNo">House Number</label>
                                        {formErrors.houseNo && (
                                            <div className="text-danger">{formErrors.houseNo}</div>
                                        )}
                                    </div>

                                    {/* Apartment */}
                                    <div className="form-floating mb-4">
                                        <input
                                            type="text"
                                            className="form-control rounded-pill"
                                            id="apartment"
                                            placeholder="Apartment"
                                            value={apartment}
                                            onChange={(e) => setApartment(e.target.value)}
                                        />
                                        <label htmlFor="apartment">Apartment</label>
                                        {formErrors.apartment && (
                                            <div className="text-danger">{formErrors.apartment}</div>
                                        )}
                                    </div>

                                    {/* City */}
                                    <div className="form-floating mb-2">
                                        <select
                                            className="form-control rounded-pill"
                                            id="city"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map((city, index) => (
                                                <option key={index} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="city">City</label>
                                        {formErrors.city && (
                                            <div className="text-danger">{formErrors.city}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>Close</Button>
                    <Button variant="outline-primary" onClick={handleSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </>
    );
}

export default AddEmployee;
