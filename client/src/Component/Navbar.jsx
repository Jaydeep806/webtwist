// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">WebTwist</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/collaborations">Collaborations</Link></li>
        <li><Link to="/testimonials">Testimonials</Link></li>
        <li><Link to="/outreach">Outreach</Link></li>
        <li><Link to="/blogs">Blogs</Link></li>
        <li><Link to="/offers">Offers</Link></li>
        <li><Link to="/pricing">Pricing</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/admin">Admin Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
