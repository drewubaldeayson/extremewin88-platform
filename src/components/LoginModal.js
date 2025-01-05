import React, { useState } from "react";
import { signInWithUsername } from "../services/firebase";

import "./LoginModal.css";

const LoginModal = ({ onClose }) => {
    const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user, data } = await signInWithUsername(username, password);
      localStorage.setItem("playerData", JSON.stringify(data))

      onClose(); // Close the modal
      window.location.reload(); // Reload to update header UI

    } catch (err) {
       if(err?.message == "Firebase: Error (auth/invalid-credential)."){
        setError("Invalid username or password");
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Login</h2>
        <p className="modal-subtitle">Welcome to ExtremeWin88</p>
        <form className="signin-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input-field"
          />
          <input type="password" placeholder="Password" className="login-input-field" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        {error && <p className="error">{error}</p>}
          <div className="form-footer">
            <a href="#" className="forgot-password">
              Forgot your password?
            </a>
          </div>
          
          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="signup-section">
          <p>
           No account? <a href="#" className="signup-link">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginModal;