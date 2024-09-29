import React, { useRef, useState } from 'react';
import axios from 'axios';
import contact from '../../images/contact.png';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';

const Contact = () => {
    const form = useRef(); // Ref to the form element
    const [done, setDone] = useState(false); // To track if the email was successfully sent
    const [errors, setErrors] = useState({}); // To track form errors
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Function to validate form inputs
    const validateForm = () => {
        const { name, email, message } = formData;
        const newErrors = {};
        if (!name) newErrors.name = "Name is required";
        if (!email) newErrors.email = "Email is required";
        if (!message) newErrors.message = "Message is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Function to handle form submission and send data to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:8081/contact-us', formData);
                if (response.status === 200) {
                    setDone(true); // Set done state to true after successful submission
                    setFormData({ name: '', email: '', message: '' }); // Reset form
                    form.current.reset(); // Clear the form
                }
            } catch (error) {
                console.error("There was an error submitting the form", error);
            }
        }
    };

    // Function to handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="row mt-5 align-items-center">
                    <div className="col-lg-5 col-md-6 text-center">
                        <img src={contact} className="img-fluid" alt="Contact us" style={{ maxHeight: '400px' }} />
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="m-1">
                            <h1>Contact Us</h1>
                            <div className="fs-6 fw-light mb-2">Post your message below. We will get back to you ASAP</div>
                            <form ref={form} onSubmit={handleSubmit}>
                                <div className="mb-5">
                                    <label htmlFor="message">Message</label>
                                    <textarea className="form-control" id="message" name="message" rows="5" onChange={handleChange}></textarea>
                                    {errors.message && <span className="error text-danger">{errors.message}</span>}
                                </div>
                                <div className="mb-5 row">
                                    <div className="col">
                                        <label>Your Name:</label>
                                        <input type="text" maxLength="50" className="form-control" id="name" name="name" onChange={handleChange} />
                                        {errors.name && <span className="error text-danger">{errors.name}</span>}
                                    </div>
                                    <div className="col">
                                        <label htmlFor="email_addr">Your Email:</label>
                                        <input type="email" maxLength="50" className="form-control" id="email_addr" name="email" placeholder="name@example.com" onChange={handleChange} />
                                        {errors.email && <span className="error text-danger">{errors.email}</span>}
                                    </div>
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-success">Post</button>
                                </div>
                            </form>
                            {done && <span className="text-success mt-3">Thanks for contacting us!</span>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
