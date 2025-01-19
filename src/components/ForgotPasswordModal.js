import React, { useState } from 'react';
import Swal from "sweetalert2";
import LoginModal from "./LoginModal.js";
import {forgotPassword, sendResetCodeFunction} from "../services/firebase.js";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [OTPCode, setOTPCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);


  const toggleLoginModal = () => {
    onClose();
    setIsLoginModalVisible(!isLoginModalVisible);
  };

  // Handle phone number input change
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Handle reset code input change
  const handleResetCodeChange = (e) => {
    setResetCode(e.target.value);
  };

  // Handle new password input change
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Simulate sending a reset code via SMS
  const sendResetCode = async () => {
    setIsSubmitting(true);

    if(phoneNumber== ""){
        Swal.fire("Error", "Please enter your phone number to proceed with updating your password", "error");
        setIsSubmitting(false);
        return;
    }


    try {
        const response = await sendResetCodeFunction(phoneNumber);
        if (response.success) {
            setOTPCode(response.resetCode);
            setMessageSent(true);
            setIsSubmitting(false);
            Swal.fire("Success", "A verification code has been sent to your phone successfully.", "success");
        }
    } catch (err) {
        Swal.fire("Error", err.message, "error");
        setIsSubmitting(false);
    }

  };

  // Simulate updating the password after receiving the reset code
  const updatePassword = async() => {
    setIsResetting(true);

    if (resetCode === OTPCode) {

        // Validation: Check if passwords match
        if(newPassword.trim() != "" && confirmPassword.trim() !=""){
            if (newPassword !== confirmPassword) {
                Swal.fire("Error", "The password you entered do not match with the confirm password field.", "error");
                setIsResetting(false);
                return;
            }else{
                try {
                    await forgotPassword(phoneNumber, newPassword);
                    Swal.fire("Success", "Your password has been successfully updated. You may now login again with your new updated password.", "success");
                    toggleLoginModal();
                    setIsResetting(false);
                } catch (error) {
                    Swal.fire("Error",error.message, "error");
                    setIsResetting(false);
                }
            }
        }else{
            Swal.fire("Error", "Please enter a valid password", "error");
            setIsResetting(false);
        }

    } else {
      Swal.fire("Error", "Invalid reset code. Please try again.", "error");
      setIsResetting(false);
      return;
    }
  };

  return (
    <div className={`fpwm-modal ${isOpen ? 'is-open' : ''}`} onClick={onClose}>
      <div className="fpwm-modal-content" onClick={(e) => e.stopPropagation()}>
        {!messageSent ? (
          <div>
            <p className='color-black'>Please enter your phone number to receive a verification code</p>
            <input
              type="number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Phone number"
              className="login-input-field mb-20"
              required
            />
            
            <button onClick={sendResetCode} className="signin-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Code'}
            </button>
          </div>
        ) : (
          <div>
            <p className='color-black'>Enter the reset code sent to your phone</p>
            <input
              type="number"
              value={resetCode}
              onChange={handleResetCodeChange}
              className="login-input-field"
              placeholder="Reset Code"
              required
            />
            <p className="color-black semibold">Enter your new password below</p>
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className="login-input-field"
              placeholder="New Password"
              required
            />
            <input
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="login-input-field"
            />
            <br/>
            <button onClick={updatePassword}  className="signin-button" disabled={isResetting}> {isResetting ? 'Updating...' : 'Update Password'} </button>

          
          </div>
        )}

        {isLoginModalVisible && (
          <LoginModal onClose={toggleLoginModal} />
        )}

        <div className="signup-section">
            <span>
            Go back to <a onClick={toggleLoginModal} className="signup-link">Login</a>
            </span>
        </div>  
      </div>
  
    </div>
  );
};

export default ForgotPasswordModal;
