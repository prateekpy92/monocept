import React from 'react';

import contact from '../../images/contact.png';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';

const About = () => {
    return (
        <div>
            <Navbar />
            <div className='container-fluid d-flex align-items-center justify-content-center' style={{ height: '80vh' }}>
                <div className='row d-flex align-items-center justify-content-center'>
                    <div className='col-md-5 d-flex justify-content-center'>
                        <img src={contact} className='img-fluid' alt="Contact Us" style={{ maxWidth: '100%', height: 'auto', maxHeight: '500px' }} />
                    </div>
                    <div className='col-md-5'>
                        <div className='text-center display-4 fw-bold'>
                            About Us
                        </div>
                        <div className='fs-5 mt-4 text-center'>
                            Welcome to LifeInsurance, your dedicated partner in protection.
                            We are committed to delivering innovative insurance solutions with a customer-centric approach.
                            At LifeInsurance, our experienced team is here to guide you through the intricacies of insurance, ensuring your peace of mind.
                            From comprehensive coverage to seamless, technology-driven solutions, we are here to safeguard what matters most to you.
                            Thank you for considering LifeInsurance as your trusted insurance partner.
                            Contact us for personalized assistance and explore the difference of our tailored insurance offerings.
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
