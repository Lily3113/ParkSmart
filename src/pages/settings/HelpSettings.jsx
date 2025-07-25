// src/pages/settings/HelpSettings.jsx
// This component handles help and support settings.

import React from 'react';
import '../../App.css'; // Assuming shared styles

const HelpSettings = ({ navigateTo }) => {
    return (
        <section className="settings-page-section">
            <div className="settings-container">
                <h2>Help & Support</h2>
                <p className="settings-description">Find answers, contact support, and review policies.</p>

                <div className="settings-content">
                    {/* Placeholder for Help settings options */}
                    <div className="setting-item">
                        <h3>Help Centre</h3>
                        <p>Browse frequently asked questions and guides.</p>
                    </div>
                    <div className="setting-item">
                        <h3>Contact Us</h3>
                        <p>Reach out to our support team directly.</p>
                    </div>
                    <div className="setting-item">
                        <h3>Privacy Policy</h3>
                        <p>Read about our data handling and privacy practices.</p>
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

export default HelpSettings;