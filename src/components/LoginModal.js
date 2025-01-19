import React, { useState } from "react";
import { signInWithUsername } from "../services/firebase";
import RegistrationModal from "./RegistrationModal";

import "./LoginModal.css";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginModal = ({ onClose, onToggleRegistrationModal}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const openForgotPasswordModal = () => setIsForgotPasswordModalOpen(true);
  const closeForgotPasswordModal = () => setIsForgotPasswordModalOpen(false);

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
       }else{
        setError(err.message);
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="login-close-button" onClick={onClose}>
          &times;
        </button>
        {!isForgotPasswordModalOpen && ( <><h2 className="modal-title">Login</h2>
        <p className="modal-subtitle">Welcome to ExtremeWin88</p>
        </>)}
        {isForgotPasswordModalOpen && ( <><h2 className="modal-title">Forgot Password</h2>
        </>)}
        {!isForgotPasswordModalOpen && (
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
              <a onClick={openForgotPasswordModal}  className="forgot-password">
                Forgot your password?
              </a>
            </div>
            
            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {isForgotPasswordModalOpen && (
        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={closeForgotPasswordModal}
        />
      )}

        {!isForgotPasswordModalOpen && (
          <div className="signup-section">
            <p>
            No account? <a onClick={onToggleRegistrationModal} className="signup-link">Register</a>
            </p>
          </div>
        )}

      </div>
     
    </div>
  );
};
export default LoginModal;