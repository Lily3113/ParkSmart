// src/pages/settings/WallpaperSettings.jsx
// This component will allow users to browse and select chat wallpapers.

import React, { useState, useEffect } from 'react'; // <-- CORRECTED: Added useState and useEffect here
import '../../App.css'; // Assuming shared styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const wallpaperOptions = [
    '/images/wallpapers/wallpaper1.jpeg', // Example wallpaper path
    '/images/wallpapers/wallpaper2.jpeg',
    '/images/wallpapers/wallpaper3.jpeg',
    '/images/wallpapers/wallpaper4.jpeg',
    // Add more wallpaper paths as needed
    // IMPORTANT: Ensure these paths exist in your public/images/wallpapers/ folder
];

const WallpaperSettings = ({ navigateTo }) => {
    const [selectedWallpaper, setSelectedWallpaper] = useState(null); // State to track selected wallpaper

    const handleWallpaperSelect = (wallpaperUrl) => {
        setSelectedWallpaper(wallpaperUrl);
        // In a real app, you'd save this to user preferences (e.g., Firebase)
        console.log("Wallpaper selected:", wallpaperUrl);
        // Optionally show a confirmation message
        // Using window.alert for simplicity, but consider a custom modal in a full app
        alert(`Wallpaper set to: ${wallpaperUrl.split('/').pop()}`);
    };

    const handleSaveWallpaper = () => {
        if (selectedWallpaper) {
            // Placeholder for saving logic (e.g., to Firebase user profile)
            console.log("Saving wallpaper:", selectedWallpaper);
            // Using window.alert for simplicity, but consider a custom modal in a full app
            alert("Wallpaper saved successfully! (Placeholder)");
            // After saving, you might navigate back or update a global state
            navigateTo('/settings/chats'); // Go back to Chat Settings
        } else {
            // Using window.alert for simplicity, but consider a custom modal in a full app
            alert("Please select a wallpaper first.");
        }
    };

    return (
        <section className="settings-page-section">
            <div className="settings-container">
                <h2>Browse Wallpapers</h2>
                <p className="settings-description">Choose a custom background for your chat conversations.</p>

                <div className="wallpaper-grid">
                    {wallpaperOptions.map((wallpaperUrl, index) => (
                        <div
                            key={index}
                            className={`wallpaper-option ${selectedWallpaper === wallpaperUrl ? 'selected' : ''}`}
                            onClick={() => handleWallpaperSelect(wallpaperUrl)}
                        >
                            <img src={wallpaperUrl} alt={`Wallpaper ${index + 1}`} />
                            {selectedWallpaper === wallpaperUrl && (
                                <div className="selection-overlay">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="settings-footer">
                    <button
                        className="btn btn-primary ripple-effect"
                        onClick={handleSaveWallpaper}
                        disabled={!selectedWallpaper} // Disable if no wallpaper is selected
                    >
                        Save Wallpaper
                    </button>
                    <button
                        className="btn btn-secondary ripple-effect"
                        onClick={() => navigateTo('/settings/chats')}
                    >
                        Back to Chat Settings
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WallpaperSettings;