// src/component/shared/ForgotPassword.js
import React, { useState } from 'react';
import { requestOtp } from '../../services/authservices/AuthServices'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state
    try {
      // Call the backend service to send the OTP using username
      await requestOtp({ username });
      alert('OTP has been sent to the email associated with this username');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Forgot Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
