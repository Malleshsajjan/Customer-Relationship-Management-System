import React, { useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>CRM Dashboard</h2>
      </div>
      <div className="navbar-right">
        {isAuthenticated && <FaBell className="icon" />}
        {isAuthenticated && (
          <div className="profile-container" onClick={handleProfileClick}>
            <FaUserCircle className="icon" />
            {isProfileOpen && (
              <div className="profile-menu">
                <button className="profile-item">My Profile</button>
                <button className="profile-item" onClick={onLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;