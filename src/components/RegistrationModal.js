import React, { useState } from "react";
import { registerUser, signInWithUsername } from "../services/firebase";

import "./RegistrationModal.css";

const RegistrationModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions");
      setLoading(false);
      return;
    }

    try {
        await registerUser({ name, username, password, phone, inviteCode });
        const { user, data } = await signInWithUsername(username, password);
        localStorage.setItem("playerData", JSON.stringify(data))
        
        onClose();
        window.location.reload();
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-modal-overlay">
      <div className="registration-modal-container">
        <button className="registration-close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="registration-modal-title">Register To Win!</h2>
        <p className="registration-modal-subtitle">Welcome to ExtremeWin88</p>
        <form className="registration-form" onSubmit={handleRegistration}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="login-input-field"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input-field"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="login-input-field"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="login-input-field"
          />
          <input
            type="text"
            placeholder="Invite Code (Optional)"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="login-input-field"
          />
          {error && <p className="error">{error}</p>}

          <div className="captcha-section">
            <div class="h-captcha" data-sitekey="dd885e3c-c2a4-4558-a262-424636f2e31a"></div>
          </div>

          <div className="terms-section">
            <label>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
              />
              I accept the <a href="/terms-and-conditions" target="_blank">Terms and Conditions</a>
            </label>
            <p className="privacy-note">
              By clicking the button above, I confirm that I have read and agree to ExtremeWin88 <a href="/privacy-policy" target="_blank">Privacy Policy</a>.
            </p>
          </div>
          <br/>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
