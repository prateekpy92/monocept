
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { registerCustomer } from '../../services/customer/CustomerService';
import { useNavigate } from 'react-router-dom'; 
import bgImg from '../../images/img1.jpg'; 
import { getAllStates, getCitiesByState } from '../../stateService';
import validator from 'validator';

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    dateOfBirth: '',
    username: '',
    password: '',
    houseNo: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    roles: ['ROLE_CUSTOMER']
  });

  const [errors, setErrors] = useState({});
  const [states] = useState(getAllStates());
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  const navigate = useNavigate();

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    const cityList = getCitiesByState(state);
    setCities(cityList);
    setFormData({ ...formData, state, city: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let fieldErrors = { ...errors };
    
    // Validation logic for each field
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          fieldErrors[name] =` ${name === 'firstName' ? 'First' : 'Last'} name must contain only letters.`;
        } else {
          delete fieldErrors[name];
        }
        break;
      case 'username':
        if (!/^[a-zA-Z0-9]*$/.test(value)) {
          fieldErrors.username = 'Username must not contain spaces or special characters.';
        } else {
          delete fieldErrors.username;
        }
        break;
      case 'mobileNumber':
        if (!/^\d{10}$/.test(value)) {
          fieldErrors.mobileNumber = 'Mobile number must be exactly 10 digits.';
        } else {
          delete fieldErrors.mobileNumber;
        }
        break;
      case 'email':
        if (!validator.isEmail(value)) {
          fieldErrors.email = 'Invalid email address.';
        } else {
          delete fieldErrors.email;
        }
        break;
      case 'pincode':
        if (!/^\d{6}$/.test(value)) {
          fieldErrors.pincode = 'Pincode must be exactly 6 digits.';
        } else {
          delete fieldErrors.pincode;
        }
        break;
      case 'password':
        if (!validator.isStrongPassword(value, {
          minLength: 8, 
          minLowercase: 1, 
          minUppercase: 1, 
          minNumbers: 1, 
          minSymbols: 1
        })) {
          fieldErrors.password = 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.';
        } else {
          delete fieldErrors.password;
        }
        break;
      case 'dateOfBirth':
        if (value > getCurrentDate()) {
          fieldErrors.dateOfBirth = 'Date of birth cannot be in the future.';
        } else {
          delete fieldErrors.dateOfBirth;
        }
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      alert('Please fix errors before submitting.');
      return;
    }
    try {
      const response = await registerCustomer(formData);
      alert('Customer registered successfully!');
      navigate('/');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed');
    }
  };


return (
    <section style={{
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      padding: '50px',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px',
        padding: '30px'
      }}>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
            <span style={{ display: 'block', textAlign: 'center', marginBottom: '20px' }}>
              Register and enjoy the service
            </span>
            <Form onSubmit={handleSubmit}>

              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your first name"
                />
                {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your last name"
                />
                {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your mobile number"
                />
                {errors.mobileNumber && <div className="text-danger">{errors.mobileNumber}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  max={getCurrentDate()}
                  onChange={handleChange}
                  required
                />
                {errors.dateOfBirth && <div className="text-danger">{errors.dateOfBirth}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter a username"
                />
                {errors.username && <div className="text-danger">{errors.username}</div>}
              </Form.Group>


<Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter a password"
                />
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>House Number</Form.Label>
                <Form.Control
                  type="text"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  required
                  placeholder="Enter house number"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apartment</Form.Label>
                <Form.Control
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  required
                  placeholder="Enter apartment"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control as="select" name="state" onChange={handleStateChange} value={formData.state} required>
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control as="select" name="city" onChange={handleChange} value={formData.city} disabled={!selectedState} required>
                  <option value="">Select City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="Enter pincode"
                />
                {errors.pincode && <div className="text-danger">{errors.pincode}</div>}
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-2">
                Register
              </Button>
              <Button variant="secondary" className="w-100" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CustomerRegistration;