import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = ({ onLoginSuccess }) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleForm = () => {
    setIsNewUser(!isNewUser);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isNewUser) {
        // Registering a new user
        const newUser = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "consumer",
        };

        const response = await axios.post("http://localhost:8080/api/register", newUser);
        alert(`✅ Registered:\n${response.data.name} (${response.data.email})`);
        console.log("✔️ Registered:", response.data);
      } else {
        // Logging in an existing user
        const loginUser = {
          email: formData.email,
          password: formData.password,
        };

        const response = await axios.post("http://localhost:8080/api/login", loginUser, {
          validateStatus: () => true, // Let us handle error responses
        });

        if (response.status === 200) {
          const { role, name, email } = response.data;
        
        
          localStorage.setItem("useRole", role);
          localStorage.setItem("userName", name);
          localStorage.setItem("userEmail", email);
        
          alert(`✅ Logged in as: ${name}`);
          onLoginSuccess();
        }
         else if (response.status === 401) {
          alert("❌ Incorrect password.");
        } else if (response.status === 404) {
          alert("❌ User not found.");
        } else {
          alert("❌ Login failed. Please try again.");
        }
      }

      // Reset form
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      alert("Something went wrong: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 mb-4">
          <h2>Welcome to the CRM Dashboard</h2>
          <p>This is your hub for managing users, customers, and reports.</p>
        </div>

        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{isNewUser ? "New User Registration" : "Sign In"}</h5>
              <button className="btn btn-sm btn-light" onClick={toggleForm}>
                {isNewUser ? "Switch to Sign In" : "Register"}
              </button>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {isNewUser && (
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="text"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    
                    
                  />
                </div>

                <button type="submit" className="btn btn-success w-100">
                  {isNewUser ? "Register" : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
