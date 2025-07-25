// src/pages/ChangeAvatarPage.jsx

import React from 'react';
import '../App.css'; // Link to its specific CSS

const ChangeAvatarPage = ({ navigateTo, onAvatarChange, currentAvatar }) => {
    // Array of pre-defined avatar image paths (assuming they are in public/images/avatars/)
    // You'll need to place these image files in your public/images/avatars/ folder.
    const avatars = [
        '/images/avatars/avatar1.jpeg',
        '/images/avatars/avatar2.jpeg',
        '/images/avatars/avatar3.jpeg',
        '/images/avatars/avatar4.jpeg',
        '/images/avatars/avatar5.jpeg',
        '/images/avatars/avatar6.jpeg',
        '/images/avatars/avatar7.jpeg',
        '/images/avatars/avatar8.jpeg',
    ];

    const handleAvatarSelect = (newAvatarUrl) => {
        if (onAvatarChange) {
            onAvatarChange(newAvatarUrl); // Call the function passed from App.jsx to update avatar
            navigateTo('profile'); // Navigate back to profile page after selection
        }
    };

    return (
        <section className="change-avatar-page-section">
            <div className="change-avatar-header">
                <h1 className="change-avatar-title">Choose Your Avatar</h1>
                <p className="change-avatar-subtitle">Select a new profile picture from the options below.</p>
            </div>
            
            <div className="avatar-grid">
                {avatars.map((avatarUrl, index) => (
                    <div 
                        key={index} 
                        className={`avatar-option ${currentAvatar === avatarUrl ? 'selected' : ''}`}
                        onClick={() => handleAvatarSelect(avatarUrl)}
                    >
                        <img 
                            src={avatarUrl} 
                            alt={`Avatar ${index + 1}`} 
                            className="avatar-image" 
                            onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/100/CCCCCC/333333?text=Err'; }}
                        />
                    </div>
                ))}
            </div>

            <div className="back-button-container">
                <button className="btn btn-secondary ripple-effect" onClick={() => navigateTo('profile')}>
                    Back to Profile
                </button>
            </div>
        </section>
    );
};

export default ChangeAvatarPage;