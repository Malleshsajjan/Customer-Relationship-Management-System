import React, { useState } from "react";
import "./LoginModal.css"; // Styles for the popup

const LoginModal = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Static authentication details
  const validUser = { id: "admin", pass: "1234" };

  const handleLogin = () => {
    if (userId === validUser.id && password === validUser.pass) {
      onLoginSuccess();
    } else {
      setError("Invalid credentials. Try again!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <h2>{isRegistering ? "Register" : "Login"}</h2>
        
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleLogin}>{isRegistering ? "Register" : "Login"}</button>
        <p onClick={() => setIsRegistering(!isRegistering)} className="switch">
          {isRegistering ? "Already have an account? Login" : "New user? Register"}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
