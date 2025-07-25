// src/pages/ChangeAvatarPage.jsx

import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import '../App.css'; // Assuming shared styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const avatarOptions = [
    // IMPORTANT: Make sure the file extensions here EXACTLY match your files in public/images/avatars/
    // If your files are a mix of .jpeg and .png, adjust each line accordingly.
    '/images/avatars/avatar1.jpeg',
    '/images/avatars/avatar2.jpeg',
    '/images/avatars/avatar3.jpeg',
    '/images/avatars/avatar4.jpeg',
    '/images/avatars/avatar5.jpeg',
    '/images/avatars/avatar6.jpeg',
    '/images/avatars/avatar7.jpeg',
    '/images/avatars/avatar8.jpeg',
    '/images/avatars/avatar9.jpeg',
    '/images/avatars/avatar10.jpeg',
    '/images/avatars/avatar11.jpeg',
    '/images/avatars/avatar12.jpeg',
    '/images/avatars/avatar13.jpeg',
    '/images/avatars/avatar14.jpeg',
    '/images/avatars/avatar15.jpeg',
    '/images/avatars/avatar16.jpeg',
    '/images/avatars/avatar17.jpeg',
    '/images/avatars/avatar18.jpeg',
    '/images/avatars/avatar19.jpeg',
    '/images/avatars/avatar20.jpeg',
    '/images/avatars/avatar21.jpeg',
    '/images/avatars/avatar22.jpeg',
    '/images/avatars/avatar23.jpeg',
    '/images/avatars/avatar24.jpeg',
];

const ChangeAvatarPage = ({ navigateTo, onAvatarChange, currentAvatar }) => {
    const { user, isAuthReady, updateUserProfile } = useFirebase();
    // Initialize selectedAvatar with currentAvatar (the saved one) or a default
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || avatarOptions[0]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // This useEffect handles initial sync and updates when the *saved* avatar (currentAvatar) changes.
    // It does NOT depend on `selectedAvatar` itself, preventing the glitch.
    useEffect(() => {
        // Only update selectedAvatar if currentAvatar is available and different from the current selectedAvatar
        // This ensures the UI reflects the *saved* avatar when the page loads or after a successful save.
        if (currentAvatar && selectedAvatar !== currentAvatar) {
            setSelectedAvatar(currentAvatar);
        }
        // Also handle case where user logs out or currentAvatar becomes null
        else if (isAuthReady && !user && selectedAvatar !== avatarOptions[0]) {
            setSelectedAvatar(avatarOptions[0]);
        }
    }, [currentAvatar, isAuthReady, user]); // Only depend on currentAvatar, isAuthReady, and user

    const handleAvatarSelect = (avatarUrl) => {
        // This directly updates the local state, which should now persist without interference
        setSelectedAvatar(avatarUrl);
        setMessage(''); // Clear any previous messages
        console.log("Avatar selected:", avatarUrl); // Keep for debugging
    };

    const handleSaveAvatar = async () => {
        if (!user || !isAuthReady) {
            setMessage('You must be logged in to change your avatar.', 'error');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');
        setMessageType('');

        try {
            // Update photoURL in Firebase Authentication
            await updateUserProfile(user, { photoURL: selectedAvatar });

            // Call the prop function to update local state in App.jsx (if used)
            onAvatarChange(selectedAvatar);

            setMessage('Avatar updated successfully!', 'success');
            setMessageType('success');
            console.log("Avatar updated in Firebase and local state:", selectedAvatar);

            // Optional: Redirect after a short delay
            setTimeout(() => {
                navigateTo('/profile');
            }, 1500);

        } catch (error) {
            console.error("Error updating avatar:", error);
            setMessage(`Failed to update avatar: ${error.message}`, 'error');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while Firebase auth is initializing
    if (!isAuthReady) {
        return (
            <section className="change-avatar-section">
                <div className="change-avatar-container loading-state">
                    <p>Loading user data...</p>
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                </div>
            </section>
        );
    }

    // Show access denied if user is not logged in
    if (!user) {
        return (
            <section className="change-avatar-section">
                <div className="change-avatar-container not-logged-in">
                    <h2>Access Denied</h2>
                    <p>You must be logged in to change your avatar.</p>
                    <button className="btn btn-primary ripple-effect" onClick={() => navigateTo('/login')}>Login / Sign Up</button>
                    <button className="btn btn-secondary ripple-effect" onClick={() => navigateTo('/profile')}>Back to Profile</button>
                </div>
            </section>
        );
    }

    return (
        <section className="change-avatar-section">
            <div className="change-avatar-container">
                <h2>Change Your Avatar</h2>
                <div className="current-avatar-preview">
                    {/* This is the image that should update */}
                    <img src={selectedAvatar} alt="Current Avatar" className="current-avatar-img" />
                    <p>Your current selection</p>
                </div>

                {message && (
                    <div className={`message-box ${messageType}`}>
                        <FontAwesomeIcon icon={messageType === 'success' ? faCheckCircle : faTimesCircle} />
                        <span>{message}</span>
                    </div>
                )}

                <div className="avatar-grid">
                    {avatarOptions.map((avatarUrl, index) => (
                        <div
                            key={index}
                            className={`avatar-option ${selectedAvatar === avatarUrl ? 'selected' : ''}`}
                            onClick={() => handleAvatarSelect(avatarUrl)}
                        >
                            {/* Each clickable avatar option */}
                            <img src={avatarUrl} alt={`Avatar ${index + 1}`} />
                        </div>
                    ))}
                </div>

                <div className="avatar-actions">
                    <button
                        className="btn btn-primary ripple-effect"
                        onClick={handleSaveAvatar}
                        disabled={loading || selectedAvatar === currentAvatar} // Disable if no change or loading
                    >
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Save New Avatar'}
                    </button>
                    <button
                        className="btn btn-secondary ripple-effect"
                        onClick={() => navigateTo('/profile')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ChangeAvatarPage;