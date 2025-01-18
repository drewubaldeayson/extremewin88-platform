import React from 'react';
import './LiveChatButton.css'; // Import the CSS file for styling
import companyLogo from "../assets/icons/extremewin88logo-rounded.svg";

const LiveChatButton = ({ onClick }) => {
  return (
    <div className="floating-button" onClick={onClick}>
      <img src={companyLogo}/>
    </div>
  );
};

export default LiveChatButton;