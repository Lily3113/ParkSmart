// src/pages/SettingsPage.jsx

import React from 'react';
import '../App.css'; // Make sure this import is present and correct

const SettingsPage = ({ navigateTo }) => {
    // Define the settings categories with their descriptions and paths
    const settingsCategories = [
        { id: 'account', title: 'Account', description: 'Privacy, security, change number', path: '/settings/account' },
        { id: 'chats', title: 'Chats', description: 'Theme, wallpapers, chat history', path: '/settings/chats' },
        { id: 'notifications', title: 'Notifications', description: 'Message, group & call tones', path: '/settings/notifications' },
        { id: 'storage-data', title: 'Storage and data', description: 'Network usage, auto-download', path: '/settings/storage-data' },
        { id: 'help', title: 'Help', description: 'Help Centre, contact us, privacy policy', path: '/settings/help' },
        { id: 'invite-friend', title: 'Invite a Friend', description: 'Share ParkSmart with your friends.', path: '/settings/invite-friend' },
    ];

    return (
        <section className="settings-page-section">
            <div className="settings-container"> {/* This is the main container for the settings page */}
                <h2>Settings</h2>
                <p className="settings-description">Manage your preferences and account.</p>

                <div className="settings-options-grid">
                    {/* Map through the settingsCategories array to render each setting card */}
                    {settingsCategories.map(category => (
                        <div
                            key={category.id} // Use a unique ID for the key
                            className="setting-card ripple-effect"
                            onClick={() => navigateTo(category.path)} // Navigate to the defined path
                        >
                            <h3>{category.title}</h3>
                            <p>{category.description}</p>
                        </div>
                    ))}
                </div>

                <div className="settings-footer">
                    <button className="btn btn-secondary ripple-effect" onClick={() => navigateTo('/profile')}>
                        Back to Profile
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SettingsPage;