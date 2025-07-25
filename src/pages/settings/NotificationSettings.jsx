// src/pages/settings/NotificationSettings.jsx
// This component handles notification-related settings.

import React from 'react';
import '../../App.css'; // Assuming shared styles

const NotificationSettings = ({ navigateTo }) => {
    return (
        <section className="settings-page-section">
            <div className="settings-container">
                <h2>Notification Settings</h2>
                <p className="settings-description">Configure message, group, and call tones.</p>

                <div className="settings-content">
                    {/* Placeholder for Notification settings options */}
                    <div className="setting-item">
                        <h3>Message Tones</h3>
                        <p>Select alert tones for individual messages.</p>
                    </div>
                    <div className="setting-item">
                        <h3>Group Tones</h3>
                        <p>Choose distinct tones for group chat notifications.</p>
                    </div>
                    <div className="setting-item">
                        <h3>Call Tones</h3>
                        <p>Set custom ringtones for incoming calls.</p>
                    </div>
                </div>

                <div className="settings-footer">
                    <button
                        className="btn btn-secondary ripple-effect"
                        onClick={() => navigateTo('/settings')}
                    >
                        Back to Settings
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NotificationSettings;