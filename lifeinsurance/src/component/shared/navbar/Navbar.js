import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.clear();
        navigate('/login');
    };

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm">
            <Navbar.Brand href="/" className="fw-bold text-danger">
                <i className="bi bi-shield-heart text-danger"></i>
                <span>Life</span><span className="text-danger">InSurance</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
                    {/* Removed Our Services and More options */}
                    <Nav.Link onClick={() => navigate('/about')}>About Us</Nav.Link>
                    <Nav.Link onClick={() => navigate('/contact')}>Contact Us</Nav.Link>
                </Nav>
                <div className='d-flex align-items-center'>
                    {localStorage.getItem('auth') ? (
                        <Button variant="outline-primary" className="ms-2" onClick={handleLogout}>Logout</Button>
                    ) : (
                        <>
                            <Button variant="outline-primary" className="ms-2" onClick={() => navigate('/login')}>Login</Button>
                            <Button variant="primary" className="ms-2" onClick={() => navigate('/register')}>Sign Up</Button>
                        </>
                    )}
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;
