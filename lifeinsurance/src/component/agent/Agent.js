import React from 'react';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';
import { useNavigate } from 'react-router-dom';

const Agent = () => {
    const navigate = useNavigate();

    // Dynamic card data
    const cardData = [
        {
            title: 'Profile',
            route: '/agent_profile',
            buttonText: 'View More'
        },
        {
            title: 'Customers',
            route: '/add_customer',
            buttonText: 'View More'
        },
        {
            title: 'Insurance Accounts',
            route: '/agent_accounts',
            buttonText: 'View More'
        },
        // {
        //     title: 'Policy Payment',
        //     route: '/policy_payment',
        //     buttonText: 'View More'
        // },
        {
            title: 'Agent Commission',
            route: '/agent-withdrawals',
            buttonText: 'View More'
        },
        // You can easily add more card objects here
    ];

    // Card Style
    const cardStyle = {
        backgroundColor: '#f7f7f7',
        borderRadius: '0', // No rounded corners for a rectangular shape
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: 'center',
        width: '100%',
        height: '150px', // Adjusted size for smaller cards
        transition: 'transform 0.2s',
    };

    // Card Body Style
    const cardBodyStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    };

    return (
        <div>
            <Navbar />
            
            <div className="bg-warning text-center display-3 py-3 text-dark fw-bold">Agent Dashboard</div>

            <div className="container">
                <div className="row my-5">
                    {cardData.map((card, index) => (
                        <div className="col-4 mb-4" key={index}>
                            <div className="card" style={cardStyle}>
                                <div className="card-body" style={cardBodyStyle}>
                                    <div className="text fw-bold fs-3">{card.title}</div>
                                    <button className="btn btn-outline-success"
                                        onClick={() => navigate(card.route)}>
                                        {card.buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Agent;
