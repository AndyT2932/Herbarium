import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { logoutUser } from './logout.jsx'

const Navbar = () => {
  return (
    <nav style={{alignSelf: 'flex-start', background: "#3F4F44"}} className="navbar navbar-expand-lg sticky-top shadow-sm w-100">
      <div className="container-fluid">
        <Link className="navbar-brand mainFont" style={{color: '#DCD7C9'}} to="/">HERBARIUM</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link mainFont" style={{color: '#DCD7C9'}}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/login"  className="nav-link mainFont" style={{color: '#DCD7C9'}}>Login</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/signup"  className="nav-link mainFont" style={{color: '#DCD7C9'}}>Signup</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/upload"  className="nav-link mainFont" style={{color: '#DCD7C9'}}>Upload</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/map"  className="nav-link mainFont" style={{color: '#DCD7C9'}}>Map</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about"  className="nav-link mainFont" style={{color: '#DCD7C9'}}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/herbarium"  className="nav-link mainFont" style={{color: '#DCD7C9'}}>Herbarium</NavLink>
            </li>
            <li className="nav-item">
              <span onClick={logoutUser} className="nav-link mainFont" style={{color: '#DCD7C9'}}>Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
