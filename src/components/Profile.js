import React, { useState, useEffect } from 'react';
import './Profile.css';
import { updatePassword, fetchPlayerDetails} from '../services/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

const Profile = () => {
    const [username, setUsername] = useState("");
    const auth = getAuth();
    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        email: '',
        referralLink: '',
    });

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handleInputChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleUpdatePassword = async () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            Swal.fire("Error","New password and confirm password do not match", "error");
            return;
        }
        try {
            await updatePassword(profile.email, passwords.oldPassword, passwords.newPassword);
            Swal.fire("Success", "Password updated successfully!", "success");
        } catch (error) {
            Swal.fire("Error",error.message, "error");
        }
    };


    const copyToClipboard = () => {
        const inviteUrl = profile.referralLink;
        navigator.clipboard.writeText(inviteUrl).then(() => {
          Swal.fire("Success", "Referral link is now copied to clipboard", "success");
        }).catch(err => {
          Swal.fire("Error","Failed to copy the referral link!", "error");
        });
    };

    useEffect(() => {
            // Listen for changes in Firebase authentication state
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            const playerData = JSON.parse(localStorage.getItem("playerData"));
            setUsername(playerData.username)
            return true;
          }
        });
    
        return () => unsubscribeAuth();
    }, [auth]);

    useEffect(() => {
        const loadProfile = async () => {
          try {
            const playerDetails = await fetchPlayerDetails(username);
            setProfile({
              name: playerDetails.name,
              phone: playerDetails.phone,
              email: playerDetails.email,
              username: playerDetails.username,
              referralLink: `https://extremewin88.com?code=${playerDetails.invite_code}`,
            });
          } catch (error) {
            console.error('Error fetching player details:', error);
          }
        };
    
        loadProfile();
    }, [username]);
    

    return (
        <div className="profile-container">
            <div className="profile-info">
                <h2>My Profile Info </h2>
              
                <div className="profile-section">
                    
                    <div className="profile-row">
                        <div className="profile-label">Username:</div>
                        <div className="profile-value">{profile.username}</div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-label">Name:</div>
                        <div className="profile-value">{profile.name}</div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-label">Phone Number:</div>
                        <div className="profile-value">{profile.phone}</div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-label">E-Mail:</div>
                        <div className="profile-value">{profile.email}</div>
                    </div>
                </div>
                <br/>
                <div className="referral-section">
                    <h3>My Referral Details</h3>
                    <div className="referral-row">
                        <div className="profile-label">Your Referral Link:</div>
                        <div className="profile-value">
                            <a onClick={copyToClipboard} >{profile.referralLink}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="password-change">
            <h3>Change Password</h3>
            <p className="password-change-subtitle">Change Password or Reset account Password</p>
            <input
                type="password"
                placeholder="Old Password"
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handleInputChange}
            />
            <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleInputChange}
            />
            <input
                type="password"
                placeholder="Confirm New Password"
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={handleInputChange}
            />
            <button className="updateProfileButton" onClick={handleUpdatePassword}>Update</button>
            </div>
        </div>
    );
};

export default Profile;
