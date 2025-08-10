// components/Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`d-flex flex-column bg-dark text-white ${isExpanded ? "p-3" : "p-2"} min-vh-100`} style={{ width: isExpanded ? "200px" : "70px", transition: "width 0.3s" }}>
      
      {/* Toggle button */}
      <button
        className="btn btn-outline-light mb-3"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* Menu */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link to="/" className="nav-link text-white d-flex align-items-center">
            <FaTachometerAlt className="me-2" />
            {isExpanded && "Dashboard"}
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/users" className="nav-link text-white d-flex align-items-center">
            <FaUsers className="me-2" />
            {isExpanded && "Users"}
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/Customers" className="nav-link text-white d-flex align-items-center">
            <FaChartBar className="me-2" />
            {isExpanded && "Customers"}
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/settings" className="nav-link text-white d-flex align-items-center">
            <FaCog className="me-2" />
            {isExpanded && "Settings"}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
