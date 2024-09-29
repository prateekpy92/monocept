import React, { useEffect, useState } from 'react';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [valid, setValid] = useState(false);
    const navigate = useNavigate();

    const validateUser = () => {
        if (localStorage.getItem('auth') == null || localStorage.getItem('Role') == null || localStorage.getItem('Role') !== 'ROLE_ADMIN') {
            alert("You are not logged in");
            navigate('/login');
        }
        setValid(true);
    };

    useEffect(() => {
        validateUser();
    }, []);

    const employeeHandler = () => {
        navigate('/all_employee');
    };

    // Dynamic card data
    const cardsData = [
        { title: "Employees", onClick: employeeHandler },
        { title: "Plans", onClick: () => navigate('/all_Plan') },
        { title: "Schemes", onClick: () => navigate('/schemes') },
        { title: "Agents", onClick: () => navigate('/add_agent') },
        { title: "Accounts", onClick: () => navigate('/get_all_policy') },
        { title: "Agent Withdrawal Requests", onClick: () => navigate('/withdrawal-Requests') }
    ];

    return (
        <div>
            <Navbar />
            <div className='bg-warning text-center display-3 py-3 text-dark fw-bold'>Admin Dashboard</div>
            <div className='container'>
                <div className='row justify-content-center g-4 my-5'>
                    {/* Dynamically map cards */}
                    {cardsData.map((card, index) => (
                        <div key={index} className='col-12 col-md-6 col-lg-4 d-flex'>
                            <div className="card w-100 h-100 shadow">
                                <div className="card-body text-center">
                                    <h5 className='card-title fw-bold fs-2'>{card.title}</h5>
                                    <button className='btn btn-lg btn-outline-success' onClick={card.onClick}>View More</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Admin;
