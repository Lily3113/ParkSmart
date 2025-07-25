// src/pages/ProfilePage.jsx

import React, { useState } from 'react'; // Import useState for local edit states
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserCircle, faKey, faBell, faCommentDots, faCloudDownloadAlt, 
    faQuestionCircle, faShareAlt, faSignOutAlt, faPencilAlt, faCheck, faTimes,
    faPhoneAlt, faLink, faChevronRight // Added faPencilAlt, faCheck, faTimes, faPhoneAlt, faLink, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import '../App.css'; 

const ProfilePage = ({ navigateTo, user, setUser }) => {
    // Local states for editing username and about, initialized from user prop
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [editedUsername, setEditedUsername] = useState(user.username || '');

    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [editedAbout, setEditedAbout] = useState(user.about || '');

    const profileOptions = [
        { icon: faKey, text: "Account", subText: "Privacy, security, change number", page: "account-settings" },
        { icon: faCommentDots, text: "Chats", subText: "Theme, wallpapers, chat history", page: "chat-settings" },
        { icon: faBell, text: "Notifications", subText: "Message, group & call tones", page: "notification-settings" },
        { icon: faCloudDownloadAlt, text: "Storage and data", subText: "Network usage, auto-download", page: "storage-settings" },
        { icon: faQuestionCircle, text: "Help", subText: "Help Centre, contact us, privacy policy", page: "help-center" },
        { icon: faShareAlt, text: "Invite a friend", subText: "", page: "invite-friend" },
    ];

    const handleLogout = () => {
        console.log("User logged out (simulated from Profile Page)");
        setUser(null); 
        navigateTo('login'); 
    };

    // Handlers for Username editing
    const handleSaveUsername = () => {
        setUser(prevUser => ({ ...prevUser, username: editedUsername }));
        setIsEditingUsername(false);
    };
    const handleCancelUsername = () => {
        setEditedUsername(user.username); // Revert to original
        setIsEditingUsername(false);
    };

    // Handlers for About editing
    const handleSaveAbout = () => {
        setUser(prevUser => ({ ...prevUser, about: editedAbout }));
        setIsEditingAbout(false);
    };
    const handleCancelAbout = () => {
        setEditedAbout(user.about); // Revert to original
        setIsEditingAbout(false);
    };

    return (
        <section className="profile-page-section">
            <div className="profile-header">
                <h1 className="profile-page-title">Profile</h1>
            </div>

            <div className="profile-avatar-area">
                <div className="profile-large-avatar-wrapper" onClick={() => navigateTo('change-avatar')}>
                    <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="profile-large-avatar" 
                        onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/150/CCCCCC/333333?text=User'; }}
                    />
                    <div className="change-avatar-overlay">
                        <FontAwesomeIcon icon={faUserCircle} /> Change
                    </div>
                </div>
                <h2 className="profile-user-name">{user.name}</h2>
            </div>

            {/* About Section (Status) */}
            <div className="profile-info-card">
                <div className="info-item">
                    <div className="info-text-group">
                        <span className="info-label">About</span>
                        {isEditingAbout ? (
                            <input 
                                type="text" 
                                value={editedAbout} 
                                onChange={(e) => setEditedAbout(e.target.value)} 
                                className="info-input"
                            />
                        ) : (
                            <span className="info-value">{user.about || "Add your status"}</span>
                        )}
                    </div>
                    <div className="info-actions">
                        {isEditingAbout ? (
                            <>
                                <button onClick={handleSaveAbout} className="icon-button save-icon"><FontAwesomeIcon icon={faCheck} /></button>
                                <button onClick={handleCancelAbout} className="icon-button cancel-icon"><FontAwesomeIcon icon={faTimes} /></button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditingAbout(true)} className="icon-button edit-icon"><FontAwesomeIcon icon={faPencilAlt} /></button>
                        )}
                    </div>
                </div>
            </div>

            {/* Username Section */}
            <div className="profile-info-card">
                <div className="info-item">
                    <div className="info-text-group">
                        <span className="info-label">Username</span>
                        {isEditingUsername ? (
                            <input 
                                type="text" 
                                value={editedUsername} 
                                onChange={(e) => setEditedUsername(e.target.value)} 
                                className="info-input"
                            />
                        ) : (
                            <span className="info-value">{user.username || "Set your username"}</span>
                        )}
                    </div>
                    <div className="info-actions">
                        {isEditingUsername ? (
                            <>
                                <button onClick={handleSaveUsername} className="icon-button save-icon"><FontAwesomeIcon icon={faCheck} /></button>
                                <button onClick={handleCancelUsername} className="icon-button cancel-icon"><FontAwesomeIcon icon={faTimes} /></button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditingUsername(true)} className="icon-button edit-icon"><FontAwesomeIcon icon={faPencilAlt} /></button>
                        )}
                    </div>
                </div>
            </div>

            {/* Phone Section */}
            <div className="profile-info-card">
                <div className="info-item">
                    <FontAwesomeIcon icon={faPhoneAlt} className="info-icon" />
                    <div className="info-text-group">
                        <span className="info-value">{user.phone || "No phone number"}</span>
                        <span className="info-label">Phone</span>
                    </div>
                </div>
            </div>

            {/* Links Section */}
            {user.links && user.links.length > 0 && (
                <div className="profile-info-card">
                    {user.links.map((link, index) => (
                        <a 
                            key={index} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="info-item link-item"
                        >
                            <FontAwesomeIcon icon={faLink} className="info-icon" />
                            <div className="info-text-group">
                                <span className="info-value">{link.name}</span>
                                <span className="info-label">{link.url}</span>
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} className="option-arrow-icon" />
                        </a>
                    ))}
                </div>
            )}

            {/* Other Profile Options */}
            <div className="profile-options-list">
                {profileOptions.map((option, index) => (
                    <div 
                        key={index} 
                        className="profile-option-item" 
                        onClick={() => navigateTo(option.page)}
                    >
                        <div className="option-icon-text">
                            <FontAwesomeIcon icon={option.icon} className="option-icon" />
                            <div className="option-text-group">
                                <span className="option-main-text">{option.text}</span>
                                {option.subText && <span className="option-sub-text">{option.subText}</span>}
                            </div>
                        </div>
                        <FontAwesomeIcon icon={faChevronRight} className="option-arrow-icon" />
                    </div>
                ))}
            </div>

            <div className="profile-logout-container">
                <button className="btn btn-primary ripple-effect logout-button" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
            </div>

            <div className="back-to-home-prompt">
                <button className="btn btn-secondary ripple-effect" onClick={() => navigateTo('home')}>
                    Back to Homepage
                </button>
            </div>
        </section>
    );
};

export default ProfilePage;