// src/pages/settings/ChatSettings.jsx
// This component handles chat-related settings, including theme, wallpapers, and chat history.

import React, { useState, useEffect } from 'react';
import '../../App.css'; // Assuming shared styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faPalette, faHistory, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

const ChatSettings = ({ navigateTo }) => {
    // State for theme: true if dark mode, false if light mode
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Initialize from localStorage or default to false (light mode)
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    // Effect to apply theme class to the body and save to localStorage
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const handleExportChatHistory = () => {
        // Placeholder for chat history export logic
        alert("Exporting chat history... (This is a placeholder action)");
        console.log("Export chat history clicked.");
    };

    const handleClearChatHistory = () => {
        // Placeholder for chat history clear logic
        if (window.confirm("Are you sure you want to clear all chat conversations? This action cannot be undone.")) {
            alert("Chat history cleared! (This is a placeholder action)");
            console.log("Clear chat history confirmed.");
        }
    };

    return (
        <section className="settings-page-section">
            <div className="settings-container">
                <h2>Chat Settings</h2>
                <p className="settings-description">Customize your chat experience, themes, and data.</p>

                <div className="settings-content">
                    {/* Theme Section */}
                    <div className="setting-item interactive-setting">
                        <div className="setting-item-header">
                            <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} className="setting-icon" />
                            <h3>Theme</h3>
                        </div>
                        <p>Choose your preferred chat theme (light or dark mode).</p>
                        <div className="theme-toggle-container">
                            <span>Light</span>
                            <label className="switch">
                                <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                                <span className="slider round"></span>
                            </label>
                            <span>Dark</span>
                        </div>
                    </div>

                    {/* Wallpapers Section */}
                    <div className="setting-item interactive-setting">
                        <div className="setting-item-header">
                            <FontAwesomeIcon icon={faPalette} className="setting-icon" />
                            <h3>Wallpapers</h3>
                        </div>
                        <p>Set custom wallpapers for your chat backgrounds.</p>
                        {/* UPDATED: Link to WallpaperSettings page */}
                        <button
                            className="btn btn-secondary ripple-effect"
                            onClick={() => navigateTo('/settings/wallpapers')}
                        >
                            Browse Wallpapers
                        </button>
                    </div>

                    {/* Chat History Section */}
                    <div className="setting-item interactive-setting">
                        <div className="setting-item-header">
                            <FontAwesomeIcon icon={faHistory} className="setting-icon" />
                            <h3>Chat History</h3>
                        </div>
                        <p>Export or clear your chat conversations.</p>
                        <div className="chat-history-actions">
                            <button className="btn btn-primary ripple-effect" onClick={handleExportChatHistory}>
                                <FontAwesomeIcon icon={faDownload} /> Export Chat
                            </button>
                            <button className="btn btn-secondary ripple-effect btn-danger" onClick={handleClearChatHistory}>
                                <FontAwesomeIcon icon={faTrash} /> Clear History
                            </button>
                        </div>
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

export default ChatSettings;