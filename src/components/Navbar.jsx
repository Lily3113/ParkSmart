// src/components/Navbar.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Added faUserCircle
import { useFirebase } from '../context/FirebaseContext'; // Import useFirebase
import { useNavigate } from 'react-router-dom'; // Import useNavigate for internal navigation
import '../App.css'; // Assuming this contains general Navbar styles

const Navbar = () => { // Removed 'navigateTo', 'user', 'setUser' props
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // Get Firebase auth state and logout function directly from context
    const { user: firebaseUser, isAuthReady, logout } = useFirebase();
    const navigate = useNavigate(); // Use useNavigate hook for routing

    const handleLogout = async () => {
        try {
            await logout(); // Call the logout function from FirebaseContext
            console.log("User logged out via Firebase.");
            setIsProfileDropdownOpen(false); // Close dropdown on logout
            navigate('/login'); // Redirect to login page after successful logout
        } catch (error) {
            console.error("Error logging out:", error);
            // You might want to show a modal error here, if App.jsx passes showModal down
            // For now, just log to console.
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false); // Close mobile menu on navigation
        setIsProfileDropdownOpen(false); // Close profile dropdown on navigation
        window.scrollTo(0, 0); // Scroll to top
    };

    const handleProfileAvatarClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    // Render a loading state for the Navbar if Firebase auth state is not ready
    if (!isAuthReady) {
        return (
            <header className="navbar-container">
                <nav className="navbar">
                    <div className="navbar-brand">
                        <img src="/images/logo.png" alt="ParkSmart Logo" className="logo" />
                    </div>
                    <div className="nav-elements active"> {/* Keep menu open for loading state */}
                        <ul className="navbar-links">
                            <li><span>Loading...</span></li>
                        </ul>
                        <div className="navbar-auth">
                            <span>Checking status...</span>
                        </div>
                    </div>
                    <button className="menu-toggle" aria-label="Toggle navigation">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </nav>
            </header>
        );
    }

    return (
        <header className="navbar-container">
            <nav className="navbar">
                {/* Use handleNavigate with correct paths */}
                <div className="navbar-brand" onClick={() => handleNavigate('/')}>
                    <img src="/images/logo.png" alt="ParkSmart Logo" className="logo" />
                </div>

                <div className={`nav-elements ${isMobileMenuOpen ? 'active' : ''}`}>
                    <ul className="navbar-links">
                        {/* Use handleNavigate with correct paths */}
                        <li><button onClick={() => handleNavigate('/')}>Home</button></li>
                        <li><button onClick={() => handleNavigate('/map')}>Map</button></li>
                        <li><button onClick={() => handleNavigate('/contact')}>Contact Us</button></li>
                        <li><button onClick={() => handleNavigate('/faq')}>FAQ</button></li> {/* Added FAQ link */}
                        <li><button onClick={() => handleNavigate('/about-us')}>About Us</button></li> {/* Added About Us link */}
                    </ul>

                    <div className="navbar-auth">
                        {firebaseUser ? ( // Use firebaseUser to check if logged in
                            <div className="profile-menu">
                                <button className="profile-avatar-btn" onClick={handleProfileAvatarClick}>
                                    {/* Use firebaseUser.photoURL or a default, defensively */}
                                    <img
                                        src={firebaseUser.photoURL || '/images/pd.jpeg'} // Fallback image
                                        alt={firebaseUser.displayName || 'User'}
                                        onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/40/CCCCCC/333333?text=PS'; }}
                                    />
                                </button>
                                {isProfileDropdownOpen && (
                                    <ul className="profile-dropdown">
                                        <li><button onClick={() => handleNavigate('/profile')}>My Profile</button></li>
                                        <li><button onClick={() => handleNavigate('/settings')}>Settings</button></li>
                                        <li><button onClick={() => handleNavigate('/change-avatar')}>Change Avatar</button></li>
                                        <li><button onClick={handleLogout} className="logout-btn">
                                            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                        </button></li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            // If not logged in, show Login/Signup button
                            <button className="btn btn-login ripple-effect" onClick={() => handleNavigate('/login')}>
                                Login / Signup
                            </button>
                        )}
                    </div>
                </div>

                <button
                    className="menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle navigation"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </nav>
        </header>
    );
};

export default Navbar;