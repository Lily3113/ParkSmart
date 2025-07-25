// src/pages/AuthPage.jsx

import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useNavigate } from 'react-router-dom'; // No need for <Link> here, as we're toggling modes
import '../App.css'; // Import the shared CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true); // State to toggle between Login and Signup

    const { login, signup, user, isAuthReady } = useFirebase();
    const navigate = useNavigate();

    // Redirect if user is already logged in
    useEffect(() => {
        if (isAuthReady && user) {
            navigate('/map');
        }
    }, [user, navigate, isAuthReady]);

    const switchModeHandler = () => {
        setIsLoginMode(prevMode => !prevMode);
        setError(''); // Clear errors when switching modes
        setEmail(''); // Clear form fields
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!isLoginMode && password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (!isLoginMode && password.length < 6) {
            setError('Password should be at least 6 characters.');
            setLoading(false);
            return;
        }

        try {
            if (isLoginMode) {
                // Login logic
                await login(email, password);
            } else {
                // Signup logic
                await signup(email, password);
            }
            // User will be redirected by the useEffect hook if successful
        } catch (err) {
            console.error(`${isLoginMode ? 'Login' : 'Signup'} error:`, err.message);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Invalid email or password. Please try again.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('This email is already in use. Please use a different email or login.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Please choose a stronger password.');
            } else {
                setError(`Failed to ${isLoginMode ? 'login' : 'create account'}. Please try again.`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthReady) {
        return (
            <div className="auth-page-container">
                <div className="auth-form-card">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <section className="auth-page-container">
            <div className="auth-form-card">
                <div className="auth-logo-container">
                    <div className="auth-logo">
                        <img src="/images/logo.png" alt="Web Dev Logo" /> {/* Replace with your actual logo URL */}
                    </div>
                    <p className="auth-slogan">Your hassle-free parking solution.</p>
                    <p className="auth-tagline">Made easy!</p>
                </div>

                <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="username"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                                required
                            />
                        </div>
                    </div>

                    {!isLoginMode && ( // Only show confirm password in signup mode
                        <div className="form-group">
                            <div className="input-wrapper">
                                <FontAwesomeIcon icon={faLock} className="input-icon" />
                                <input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="confirm password"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? (isLoginMode ? 'Logging in...' : 'Signing Up...') : (isLoginMode ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <p className="auth-link-text">
                    {isLoginMode ? 'Forgot password?' : ''}
                    <span onClick={switchModeHandler} style={{ cursor: 'pointer', color: 'var(--primary-color)', fontWeight: '600', marginLeft: isLoginMode ? '5px' : '0' }}>
                        {isLoginMode ? 'or Sign Up' : 'Already have an account? Login'}
                    </span>
                </p>
            </div>
        </section>
    );
};

export default AuthPage;