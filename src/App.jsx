// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Context Provider
import { FirebaseProvider, useFirebase } from './context/FirebaseContext'; // NEW: Import useFirebase here too

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Modal from './components/Modal';

// Page Components
import HomePage from './pages/HomePage';
import AboutUsDetails from './pages/AboutUsDetails';
import ContactUsPage from './pages/ContactUsPage';
import FAQSection from './pages/FAQSection';
import AuthPage from './pages/AuthPage';

// Protected Page Components
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import ChangeAvatarPage from './pages/ChangeAvatarPage';

// Import the PrivateRoute component
import PrivateRoute from './components/PrivateRoute';

// Import ALL necessary CSS files
import './App.css';

const AppContent = () => {
    const navigate = useNavigate();
    // NEW: Get user and isAuthReady from FirebaseContext
    const { user, isAuthReady } = useFirebase(); // Make sure this line is present

    // Initialize local user state based on Firebase user or a default
    const [localUser, setLocalUser] = useState(() => ({
        // Provide sensible defaults for when user is null or undefined initially
        name: user?.displayName || 'ParkSmart User', // Use Firebase display name if available
        avatar: user?.photoURL || '/images/pd.jpeg', // Use Firebase photo URL if available
        username: user?.email ? `@${user.email.split('@')[0]}` : '@parksmartuser', // Derive from email or default
        about: 'Hey there! I\'m using ParkSmart.',
        phone: '+1 234 567 8900',
        links: [
            { name: 'ParkSmart Website', url: 'https://www.example.com' },
            { name: 'Support Page', url: 'https://www.example.com/support' }
        ]
    }));

    // Effect to update localUser state when the Firebase user changes
    // This is important because the Firebase user object might become available
    // AFTER the initial render, or change (e.g., login/logout).
    React.useEffect(() => {
        if (user) {
            setLocalUser({
                name: user.displayName || 'ParkSmart User',
                avatar: user.photoURL || '/images/pd.jpeg',
                username: user.email ? `@${user.email.split('@')[0]}` : '@parksmartuser',
                about: localUser.about, // Keep existing if not updated by Firebase
                phone: localUser.phone,
                links: localUser.links
            });
        } else {
            // If user logs out, reset to default or anonymous state
            setLocalUser({
                name: 'Guest User',
                avatar: '/images/pd.jpeg',
                username: '@guest',
                about: 'Please log in.',
                phone: '',
                links: []
            });
        }
    }, [user]); // Re-run this effect whenever the Firebase user object changes

    // Modal state and handlers - good to keep at a high level if used across pages
    const [modal, setModal] = useState({ show: false, message: '', type: 'info', callback: null });

    const showModal = (message, type = 'info', callback = null) => {
        setModal({ show: true, message, type, callback });
    };

    const closeModal = () => {
        setModal({ show: false, message: '', type: 'info', callback: null });
    };

    const handleModalConfirm = () => {
        if (modal.callback) {
            modal.callback();
        }
        closeModal();
    };

    const navigateTo = (path) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    const handleAvatarChange = (newAvatarUrl) => {
        setLocalUser(prevUser => ({ ...prevUser, avatar: newAvatarUrl }));
        console.log(`Avatar changed to: ${newAvatarUrl}`);
    };

    // ====================================================================
    // IMPORTANT: Conditional rendering based on isAuthReady
    // If Firebase auth state isn't ready, show a loading indicator
    // This prevents components from trying to access `user` before it's determined.
    if (!isAuthReady) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--ps-dark-blue)', flexDirection: 'column' }}>
                <p>Initializing application...</p>
                {/* You can add a spinner here */}
                <div className="loading-spinner"></div> {/* Add CSS for a loading spinner */}
            </div>
        );
    }
    // ====================================================================


    return (
        <div className="App">
            {/* Navbar now uses localUser */}
            <Navbar navigateTo={navigateTo} user={localUser} setUser={setLocalUser} />
            <main>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about-us" element={<AboutUsDetails navigateTo={navigateTo} />} />
                    <Route path="/faq" element={<FAQSection navigateTo={navigateTo} />} />
                    <Route path="/contact" element={<ContactUsPage navigateTo={navigateTo} />} />

                    {/* Authentication Routes (These should NOT be protected) */}
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<AuthPage />} />
                    <Route path="/auth" element={<AuthPage />} />

                    {/* ============================================== */}
                    {/* PROTECTED ROUTES - Wrapped with PrivateRoute */}
                    {/* ============================================== */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/map" element={<MapPage showModal={showModal} navigateTo={navigateTo} />} />
                        <Route path="/profile" element={<ProfilePage navigateTo={navigateTo} user={localUser} setUser={setLocalUser} />} /> {/* Pass localUser */}
                        <Route path="/change-avatar" element={<ChangeAvatarPage
                            navigateTo={navigateTo}
                            onAvatarChange={handleAvatarChange}
                            currentAvatar={localUser.avatar}
                        />} />
                        {/* Protect other "Coming Soon" pages as needed */}
                        <Route path="/settings" element={<div style={{ padding: '5rem', textAlign: 'center' }}><h1>Settings Page (Coming Soon!)</h1><button className="btn btn-primary ripple-effect" onClick={() => navigateTo('/')}>Back to Home</button></div>} />
                        <Route path="/account-settings" element={<div style={{ padding: '5rem', textAlign: 'center' }}><h1>Account Settings (Coming Soon!)</h1><button className="btn btn-primary ripple-effect" onClick={() => navigateTo('/profile')}>Back to Profile</button></div>} />
                        <Route path="/chat-settings" element={<div style={{ padding: '5rem', textAlign: 'center' }}><h1>Chat Settings (Coming Soon!)</h1><button className="btn btn-primary ripple-effect" onClick={() => navigateTo('/profile')}>Back to Profile</button></div>} />
                        <Route path="/notification-settings" element={<div style={{ padding: '5rem', textAlign: 'center' }}><h1>Notification Settings (Coming Soon!)</h1><button className="btn btn-primary ripple-effect" onClick={() => navigateTo('/profile')}>Back to Profile</button></div>} />
                        <Route path="/storage-settings" element={<div style={{ padding: '5rem', textAlign: 'center' }}><h1>Storage and Data (Coming Soon!)</h1><button className="btn btn-primary ripple-effect" onClick={() => navigateTo('/profile')}>Back to Profile</button></div>} />
                        <Route path="/help-center" element={<div style={{ padding: '5rem', textAlign: 'center' }}><h1>Help Center (Coming Soon!)</h1><button className="btn btn-primary ripple-effect" onClick={() => navigateTo('/profile')}>Back to Profile</button></div>} />
                        <Route path="/invite-friend" element={<div style={{ padding: '5rem', textAlign: 'center' }}><h1>Invite a Friend (Coming Soon!)</h1><button className="btn btn-primary ripple-effect" onClick={() => navigateTo('/profile')}>Back to Profile</button></div>} />
                    </Route>
                    {/* ============================================== */}

                    {/* 404 Not Found Page */}
                    <Route path="*" element={
                        <div style={{ padding: '5rem', textAlign: 'center' }}>
                            <h1>404 - Page Not Found</h1>
                            <p>The page you requested could not be found.</p>
                            <button className="btn btn-primary ripple-effect" onClick={() => navigateTo('/')}>Go to Homepage</button>
                        </div>
                    } />
                </Routes>
            </main>
            <Footer />
            <Modal
                show={modal.show}
                message={modal.message}
                type={modal.type}
                onClose={closeModal}
                onConfirm={handleModalConfirm}
            />
        </div>
    );
};

function App() {
    return (
        <Router>
            <FirebaseProvider>
                <AppContent />
            </FirebaseProvider>
        </Router>
    );
}

export default App;