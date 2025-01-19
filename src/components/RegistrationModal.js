import React, { useState, useEffect, useRef } from "react";
import { registerUser, signInWithUsername } from "../services/firebase";

import "./RegistrationModal.css";

const RegistrationModal = ({ onClose, inviteCodeFromURL }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const canvasRef = useRef(null);

   // Function to generate a random captcha code
  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptcha(code);
    drawCaptcha(code);
  };

  // Function to draw the captcha on canvas
  const drawCaptcha = (code) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Set background color
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Add noise: random lines and circles
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = getRandomColor();
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Add random dots (noise)
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fillStyle = getRandomColor();
      ctx.fill();
    }

    // Draw captcha text with random rotation and positioning
    ctx.font = '30px Arial';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      ctx.fillStyle = getRandomColor();
      const x = (i * (width / 6)) + Math.random() * 10;
      const y = height / 2 + Math.random() * 10;
      const rotation = Math.random() * 0.2 - 0.1; // Random rotation between -0.1 and 0.1 radians

      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const refreshCaptcha = () => {
    generateCaptcha();
  };


  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userCaptcha = document.getElementById('captcha-input').value;
    if (userCaptcha !== captcha) {
      setError("Captcha is not correct! Please try it again.");
      setLoading(false);
      return;
    }

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

  useEffect(() => {
    setInviteCode(inviteCodeFromURL);
  }, [inviteCodeFromURL]);


  useEffect(() => {
    generateCaptcha();
  }, []);

  // Handle phone number input change
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

    // Allow only numbers and ensure the length is 10 digits
    if (value.length <= 10 && /^[0-9]*$/.test(value)) {
      setPhone(value)
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
          <div className="phone-input-container">
            <span className="prefix">+63</span>
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={handlePhoneNumberChange}
              required
              className="login-input-field"
            />
          </div>
          <input
            type="text"
            placeholder="Invite Code (Optional)"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="login-input-field"
          />
          <input type="text" id="captcha-input" className="login-input-field" placeholder="Enter the code" required />

          {error && <p className="error">{error}</p>}

          <div className="captcha-container">
            <canvas id="auth-code" ref={canvasRef} width="200" height="50" ></canvas>
            <button type="button" onClick={refreshCaptcha} className="refresh-btn">
              <i className="fas fa-redo-alt"></i> Refresh
            </button>
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
