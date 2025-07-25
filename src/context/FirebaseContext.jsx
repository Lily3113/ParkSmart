// src/context/FirebaseContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    // signInAnonymously, // <--- REMOVED THIS IMPORT
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const FirebaseContext = createContext(null);

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};

// =========================================================
// IMPORTANT: REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
// For production, consider using environment variables (e.g., process.env.REACT_APP_...)
// rather than hardcoding.
const firebaseConfig = {
    apiKey: "AIzaSyD-bjX-o15WoKNrx5cB4NLo4437R00FmGM",
    authDomain: "smartparking-c6d39.firebaseapp.com",
    projectId: "smartparking-c6d39",
    storageBucket: "smartparking-c6d39.firebasestorage.app",
    messagingSenderId: "890113424601",
    appId: "1:890113424601:web:071cd1c8812702653792c8",
    measurementId: "G-7NC6ERSWWD"
};
const APP_ID_FOR_FIRESTORE_PATHS = firebaseConfig.appId;
// =========================================================

export const FirebaseProvider = ({ children }) => {
    const [app, setApp] = useState(null);
    const [auth, setAuth] = useState(null);
    const [db, setDb] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const login = async (email, password) => {
        if (!auth) {
            console.error("FirebaseContext: Auth instance is null during login attempt.");
            throw new Error("Firebase Auth not initialized.");
        }
        console.log("FirebaseContext: Attempting to log in with:", email);
        return await signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email, password) => {
        if (!auth) {
            console.error("FirebaseContext: Auth instance is null during signup attempt.");
            throw new Error("Firebase Auth not initialized.");
        }
        console.log("FirebaseContext: Attempting to sign up with:", email);
        return await createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        if (!auth) {
            console.error("FirebaseContext: Auth instance is null during logout attempt.");
            throw new Error("Firebase Auth not initialized.");
        }
        console.log("FirebaseContext: Attempting to log out.");
        return await signOut(auth);
    };


    useEffect(() => {
        let firebaseAppInstance;
        let authInstance;
        let dbInstance;

        try {
            if (!firebaseConfig.apiKey) {
                console.error("Firebase config is incomplete. Please update src/context/FirebaseContext.jsx with your actual Firebase project details.");
                setIsAuthReady(true);
                return;
            }

            firebaseAppInstance = initializeApp(firebaseConfig);
            setApp(firebaseAppInstance);

            authInstance = getAuth(firebaseAppInstance);
            setAuth(authInstance);
            dbInstance = getFirestore(firebaseAppInstance);
            setDb(dbInstance);

            // Removed the signInUser() function call and its definition
            // as it was causing auth/admin-restricted-operation error.
            // We will now rely solely on explicit login/signup.

            const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
                setUser(currentUser);
                console.log("FirebaseContext: Auth state changed. Current user:", currentUser ? currentUser.uid : "None (logged out or anonymous)");
                setIsAuthReady(true); // Set true once auth state is first determined
            });

            return () => unsubscribe();

        } catch (error) {
            console.error("FirebaseContext: Failed to initialize Firebase:", error);
            setIsAuthReady(true);
        }
    }, []); // Empty dependency array ensures this runs once on mount

    const value = { app, auth, db, user, isAuthReady, appId: APP_ID_FOR_FIRESTORE_PATHS, login, signup, logout };

    if (!isAuthReady) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--ps-dark-blue)' }}>
                Loading application...
            </div>
        );
    }

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
};