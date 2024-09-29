import React, { useState } from 'react';

const PlanCard = ({ data, schemehandler }) => {
    const [planId] = useState(data.planId);
    const [planName] = useState(data.planName);

    const getSchemesData = async () => {
        schemehandler(data);
    };

    return (
        <div className="col-md-4 d-flex justify-content-center mb-4">
            <div style={{
                width: '250px',  // Set fixed width
                height: '250px', // Set fixed height
                backgroundColor: '#dc3545', // Bootstrap danger color
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                borderRadius: '10px',  // Rounded corners
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',  // Add a subtle shadow
                cursor: 'pointer',
                transition: 'transform 0.3s ease',  // Add hover effect
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={getSchemesData}
            >
                {planName}
            </div>
        </div>
    );
}

export default PlanCard;
