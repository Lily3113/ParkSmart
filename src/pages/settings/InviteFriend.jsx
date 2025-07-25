// src/pages/settings/InviteFriend.jsx
import React from 'react';
import '../../App.css'; // Assuming shared styles

const InviteFriend = ({ navigateTo }) => {
    return (
        <section className="settings-page-section">
            <div className="settings-container">
                <h2>Invite a Friend</h2>
                <p className="settings-description">Share ParkSmart with your friends and family!</p>

                <div className="settings-content">
                    <div className="setting-item">
                        <h3>Share via Link</h3>
                        <p>Send a direct link for them to download the app.</p>
                        {/* You can add a button here to copy the link */}
                        <button className="btn btn-primary ripple-effect" style={{ marginTop: '10px' }}>Copy Invite Link</button>
                    </div>
                    <div className="setting-item">
                        <h3>Share via Social Media</h3>
                        <p>Share on your favorite social media platforms.</p>
                        {/* You can add social media share buttons here */}
                        <button className="btn btn-secondary ripple-effect" style={{ marginTop: '10px', marginRight: '10px' }}>Facebook</button>
                        <button className="btn btn-secondary ripple-effect" style={{ marginTop: '10px' }}>Twitter</button>
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

export default InviteFriend;