import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddQuery = ({ onClose, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();

    if (trimmedQuestion === '') {
      setError('Please enter a non-empty query.');
      return;
    }

    if (trimmedQuestion.length > 200) {
      setError('Question length should not exceed 200 characters.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/insuranceapp/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          question: trimmedQuestion,
        }),
      });

      if (response.ok) {
        alert('Query submitted successfully!');
        navigate("/customer");
        onSubmit();
      } else {
        setMessage('Failed to submit query.');
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      setMessage('Query submitted successfully!');
    }
  };

  const handleClose = () => {
    setQuestion('');
    setMessage('');
    navigate("/customer");
  };

  // Updated styles for a cleaner and more uniform layout
  const containerStyle = {
    background: '#f0f4f8',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '600px',
    margin: '50px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const formStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle = {
    fontWeight: '600',
    marginBottom: '10px',
    fontSize: '1.1rem',
    color: '#333',
  };

  const inputTextStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  };

  const buttonStyle = {
    background: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    fontSize: '1rem',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  };

  const buttonHoverStyle = {
    background: '#0056b3',
  };

  const errorStyle = {
    color: 'red',
    fontWeight: '500',
    marginBottom: '15px',
  };

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#007bff',
  };

  return (
    <>
      <NavBar />

      <div style={containerStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <h2 style={headingStyle}>Submit Your Query</h2>
          
          <label style={labelStyle}>
            Username: <span>{username}</span>
          </label>
          
          <label style={labelStyle}>
            Your Question:
            <textarea 
              style={inputTextStyle} 
              value={question} 
              onChange={handleQuestionChange} 
              placeholder="Type your query here..."
            />
          </label>

          {error && <p style={errorStyle}>{error}</p>}

          <div style={buttonContainerStyle}>
            <button 
              style={buttonStyle} 
              type="submit"
              onMouseOver={(e) => (e.target.style.background = buttonHoverStyle.background)}
              onMouseOut={(e) => (e.target.style.background = buttonStyle.background)}
            >
              Submit Query
            </button>
            <button 
              style={buttonStyle} 
              type="button" 
              onClick={handleClose}
              onMouseOver={(e) => (e.target.style.background = buttonHoverStyle.background)}
              onMouseOut={(e) => (e.target.style.background = buttonStyle.background)}
            >
              Close
            </button>
          </div>
        </form>
        
        {message && <p>{message}</p>}
      </div>

      <Footer />
    </>
  );
};

export default AddQuery;
