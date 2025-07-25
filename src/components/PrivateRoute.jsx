// src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext'; // Import your Firebase context

const PrivateRoute = ({ children }) => {
    const { user, isAuthReady } = useFirebase();

    // While authentication state is being determined, show a loading message/spinner
    if (!isAuthReady) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--ps-dark-blue)' }}>
                Checking authentication...
            </div>
        );
    }

    // If user is logged in, render the children (the protected component)
    if (user) {
        return children ? children : <Outlet />; // Outlet is for nested routes, children for direct element prop
    }

    // If user is not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;