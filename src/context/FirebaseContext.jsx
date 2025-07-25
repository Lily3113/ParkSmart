// src/context/FirebaseContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'; 
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
// Define your app ID separately for Firestore paths, accessible outside useEffect
// This variable needs to be accessible in the 'value' object below,
// so it must be defined at the component's top level, outside any useEffect.
const APP_ID_FOR_FIRESTORE_PATHS = firebaseConfig.appId; 
// =========================================================

export const FirebaseProvider = ({ children }) => {
    const [app, setApp] = useState(null);
    const [auth, setAuth] = useState(null);
    const [db, setDb] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

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

            const signInUser = async () => {
                try {
                    // Signing in anonymously allows unauthenticated users to browse.
                    await signInAnonymously(authInstance);
                    console.log("Signed in anonymously for initial access.");
                } catch (error) {
                    console.error("Firebase initial anonymous authentication failed:", error);
                } finally {
                    setIsAuthReady(true); 
                }
            };

            signInUser();

            const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
                setUser(currentUser);
                console.log("Auth state changed. Current user:", currentUser ? currentUser.uid : "None (logged out or anonymous)");
                setIsAuthReady(true); 
            });

            return () => unsubscribe();

        } catch (error) {
            console.error("Failed to initialize Firebase:", error);
            setIsAuthReady(true); 
        }
    }, []); // Empty dependency array ensures this runs once on mount

    // The 'value' object is created here. APP_ID_FOR_FIRESTORE_PATHS is now correctly in scope.
    const value = { app, auth, db, user, isAuthReady, appId: APP_ID_FOR_FIRESTORE_PATHS };

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