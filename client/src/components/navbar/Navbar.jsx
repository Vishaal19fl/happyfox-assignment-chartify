import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";
import GoogleTranslate from "../googleTranslate/GoogleTranslate";
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [active, setActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = () => {
    if (location.pathname === '/chart-page') {
      setActive(true);
    } else {
      window.scrollY > 0 ? setActive(true) : setActive(false);
    }
  };

  useEffect(() => {
    isActive(); 
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, [location.pathname]); // Added location.pathname as dependency

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={active ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <span>
            <img src="/img/chart.png" width='55px' alt="" />
          </span>
          <Link className="link" to="/">
            <span className="text">chartify</span>
          </Link>
          <span className="dot">.</span>
        </div>
        
        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        <div className={`links ${isMenuOpen ? 'active' : ''}`}>
          <Link className="link" to='/chart-page'>
            <span>Organize Team</span>
          </Link>


          <div className="user" onClick={() => setOpen(!open)}>
            <img className="profilepic" src="/img/vishaal2.jpg" alt="" />
            <span>Vishaal</span>
            {open && (
              <div className="options">
                <Link className="link" to="/profile">
                  View Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
