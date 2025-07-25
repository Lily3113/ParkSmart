// src/pages/settings/StorageDataSettings.jsx
// This component handles storage and data usage settings.

import React from 'react';
import '../../App.css'; // Assuming shared styles

const StorageDataSettings = ({ navigateTo }) => {
    return (
        <section className="settings-page-section">
            <div className="settings-container">
                <h2>Storage and Data Settings</h2>
                <p className="settings-description">Manage network usage and media auto-download preferences.</p>

                <div className="settings-content">
                    {/* Placeholder for Storage and Data settings options */}
                    <div className="setting-item">
                        <h3>Network Usage</h3>
                        <p>View and reset your data usage statistics.</p>
                    </div>
                    <div className="setting-item">
                        <h3>Auto-Download</h3>
                        <p>Configure automatic media downloads over Wi-Fi or mobile data.</p>
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

export default StorageDataSettings;