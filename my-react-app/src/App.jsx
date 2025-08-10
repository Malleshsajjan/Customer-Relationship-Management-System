import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Home from "./pages/Home";

import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check login state on page load
    const role = localStorage.getItem("useRole");
    if (role) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="app">
        {isAuthenticated && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Home /> // Optional dashboard content
                ) : (
                  <Dashboard onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            {isAuthenticated && (
              <>
                <Route path="/users" element={<Users />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/reports" element={<Reports />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
