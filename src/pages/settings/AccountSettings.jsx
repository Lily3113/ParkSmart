// src/pages/settings/AccountSettings.jsx
// This component handles account-related settings.

import React from 'react';
import '../../App.css'; // Assuming shared styles

const AccountSettings = ({ navigateTo }) => {
    return (
        <section className="settings-page-section">
            <div className="settings-container">
                <h2>Account Settings</h2>
                <p className="settings-description">Manage your privacy, security, and account details.</p>

                <div className="settings-content">
                    {/* Placeholder for Account settings options */}
                    <div className="setting-item">
                        <h3>Privacy</h3>
                        <p>Control who can see your personal information.</p>
                    </div>
                    <div className="setting-item">
                        <h3>Security</h3>
                        <p>Manage two-step verification and security notifications.</p>
                    </div>
                    <div className="setting-item">
                        <h3>Change Number</h3>
                        <p>Update the phone number associated with your account.</p>
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

export default AccountSettings;