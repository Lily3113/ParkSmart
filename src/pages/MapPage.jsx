// src/pages/MapPage.jsx

import React, { useRef, useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes, faCheckCircle, faParking, faClock, faDollarSign,
    faMoneyBillWave, faSpinner, faTimesCircle, faCreditCard // Re-added faMoneyBillWave, faCreditCard
} from '@fortawesome/free-solid-svg-icons';

import { useFirebase } from '../context/FirebaseContext';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';


// Fix for default Leaflet icons not showing correctly with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon definitions for different spot statuses
const availableIcon = new L.DivIcon({
    className: 'custom-div-icon available-marker',
    html: `<div class="marker-pin available-pin"></div><i class="fa fa-parking marker-icon"></i>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
});

const selectedIcon = new L.DivIcon({
    className: 'custom-div-icon selected-marker',
    html: `<div class="marker-pin selected-pin"></div><i class="fa fa-parking marker-icon"></i>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
});

const bookedIcon = new L.DivIcon({
    className: 'custom-div-icon booked-marker',
    html: `<div class="marker-pin booked-pin"></div><i class="fa fa-parking marker-icon"></i>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
});

// Define the exchange rate
const USD_TO_ZWL_RATE = 40; // $1 USD = 40 ZWL

const MapPage = ({ navigateTo, showModal }) => {
    const { db, user, isAuthReady, appId } = useFirebase();
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const markerRefs = useRef({});

    const [spots, setSpots] = useState([]);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [activeBookingTimers, setActiveBookingTimers] = useState({});
    const intervalRefs = useRef({});

    // Re-added payment-related state variables
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ecocash');
    const [selectedCurrency, setSelectedCurrency] = useState('ZWL');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userEnteredAmount, setUserEnteredAmount] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);

    // --- useCallback Definitions (placed at the top for better initialization order) ---

    const handleResize = useCallback(() => {
        if (leafletMapRef.current) {
            leafletMapRef.current.invalidateSize();
            console.log("MapPage: Map invalidateSize called on window resize.");
        }
    }, []);

    const convertAmount = useCallback((amount, fromCurrency, toCurrency) => {
        if (fromCurrency === toCurrency) {
            return amount;
        }
        if (fromCurrency === 'USD' && toCurrency === 'ZWL') {
            return amount * USD_TO_ZWL_RATE;
        }
        if (fromCurrency === 'ZWL' && toCurrency === 'USD') {
            return amount / USD_TO_ZWL_RATE;
        }
        return amount;
    }, []);

    const validatePhoneNumber = useCallback((number, method) => {
        const cleanedNumber = number.replace(/[^0-9]/g, '');

        if (!cleanedNumber.startsWith('07') || cleanedNumber.length !== 10) {
            return "Phone number must be 10 digits and start with '07' (e.g., 0771234567).";
        }

        if (method === 'ecocash') {
            if (!cleanedNumber.startsWith('077') && !cleanedNumber.startsWith('078')) {
                return "EcoCash numbers must start with 077 or 078.";
            }
        } else if (method === 'onemoney') {
            if (!cleanedNumber.startsWith('071')) {
                return "OneMoney numbers must start with 071.";
            }
        } else if (method === 'omari') {
             // Add Omari specific validation if any, otherwise it passes the 07x 10-digit check
        }
        return "";
    }, []);

    const handleMarkerClick = useCallback((spotId) => {
        const spot = spots.find(s => s.id === spotId);
        if (spot) {
            setSelectedSpot(spot);
            setShowPaymentModal(false); // Ensure payment modal is closed when new spot is selected
            setPhoneNumber(''); // Clear phone number field
            // Auto-fill amount based on selected spot and default currency
            setUserEnteredAmount(convertAmount(spot.priceUSD, 'USD', selectedCurrency).toFixed(2));
            console.log(`MapPage: Marker clicked: ${spot.id}, Status: ${spot.status}`);
        }
    }, [spots, selectedCurrency, convertAmount]);

    // handleBookSpot now directly opens the payment modal
    const handleBookSpot = useCallback(() => {
        console.log("MapPage: handleBookSpot called.");
        if (!user) {
            showModal("You must be logged in to book a spot. Please sign in or create an account.", "info", () => navigateTo('/login'));
            return;
        }

        if (selectedSpot && selectedSpot.status === 'available') {
            setShowPaymentModal(true);
            // Re-calculate amount in case currency was changed while modal was closed
            setUserEnteredAmount(convertAmount(selectedSpot.priceUSD, 'USD', selectedCurrency).toFixed(2));
        }
    }, [user, selectedSpot, selectedCurrency, convertAmount, showModal, navigateTo]);

    const handleCurrencyChange = useCallback((e) => {
        console.log("MapPage: handleCurrencyChange called. New currency:", e.target.value);
        const newCurrency = e.target.value;
        if (selectedSpot) {
            const converted = convertAmount(selectedSpot.priceUSD, 'USD', newCurrency);
            setUserEnteredAmount(converted.toFixed(2));
        }
        setSelectedCurrency(newCurrency);
    }, [selectedSpot, convertAmount]);

    const handlePaymentSubmit = useCallback(async (e) => {
        e.preventDefault();
        console.log("MapPage: handlePaymentSubmit called.");

        if (!user) {
            showModal("You must be logged in to complete payment.", "error");
            return;
        }
        if (!db) {
            showModal("Database not ready. Please try again.", "error");
            return;
        }

        if (!selectedSpot || selectedSpot.status !== 'available') {
            console.error("MapPage: Payment attempted but no available spot is selected or spot is already booked!");
            showModal("Error: Please select an available spot to book.", "error");
            setShowPaymentModal(false);
            setSelectedSpot(null);
            return;
        }

        const amountToPay = parseFloat(userEnteredAmount);
        const originalPriceUSD = selectedSpot.priceUSD;
        const expectedAmountInSelectedCurrency = convertAmount(originalPriceUSD, 'USD', selectedCurrency);

        // Allow a small tolerance for floating point comparisons
        if (Math.abs(amountToPay - expectedAmountInSelectedCurrency) > 0.01) {
            showModal(`The amount entered (${amountToPay.toFixed(2)} ${selectedCurrency}) does not match the spot price (${expectedAmountInSelectedCurrency.toFixed(2)} ${selectedCurrency}). Please enter the correct amount.`, "error");
            return;
        }

        const phoneValidationMessage = validatePhoneNumber(phoneNumber, selectedPaymentMethod);
        if (phoneValidationMessage) {
            showModal(phoneValidationMessage, "error");
            return;
        }

        setPaymentLoading(true);
        try {
            // Simulate payment success/failure
            const isSimulatedPaymentSuccessful = Math.random() > 0.1; // 90% success rate
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

            if (isSimulatedPaymentSuccessful) {
                const bookingDurationMinutes = 5; // Fixed 5-minute booking for simplicity
                const bookingEndTime = new Date(Date.now() + bookingDurationMinutes * 60 * 1000);

                const newBookingData = {
                    spotId: selectedSpot.id,
                    spotName: selectedSpot.name,
                    startTime: new Date().toISOString(),
                    endTime: bookingEndTime.toISOString(),
                    durationMinutes: bookingDurationMinutes,
                    costPaid: amountToPay,
                    currencyPaid: selectedCurrency,
                    originalPriceUSD: selectedSpot.priceUSD,
                    paymentMethod: selectedPaymentMethod,
                    phoneNumber: phoneNumber,
                    bookedAt: new Date().toISOString(),
                    status: 'active',
                    userId: user.uid,
                };

                const bookingsCollectionRef = collection(db, `artifacts/${appId}/users/${user.uid}/bookings`);
                await addDoc(bookingsCollectionRef, newBookingData);

                showModal(`Payment of ${selectedCurrency} ${amountToPay.toFixed(2)} successful! Spot ${selectedSpot.id} booked for ${bookingDurationMinutes} minutes via ${selectedPaymentMethod}.`, "success");

                // Reset state after successful booking
                setSelectedSpot(null);
                setShowPaymentModal(false);
                setPhoneNumber('');
                setUserEnteredAmount('');
                console.log(`MapPage: Spot ${selectedSpot.id} booked via ${selectedPaymentMethod} and added to Firestore.`);

            } else {
                showModal("Payment failed. Please try again.", "error");
                console.log("MapPage: Payment failed (simulated).");
            }
        } catch (error) {
            console.error("MapPage: Error during payment or booking:", error);
            showModal(`An unexpected error occurred during payment: ${error.message}`, "error");
        } finally {
            setPaymentLoading(false);
        }
    }, [user, db, appId, selectedSpot, userEnteredAmount, selectedCurrency, phoneNumber, showModal, convertAmount, validatePhoneNumber]);


    const handleCancelBooking = useCallback(async () => {
        console.log("MapPage: handleCancelBooking called.");
        if (!user || !db) {
            showModal("You must be logged in and database ready to cancel a booking.", "error");
            return;
        }

        if (selectedSpot && selectedSpot.status === 'booked') {
            showModal(`Confirm cancellation for ${selectedSpot.name} (${selectedSpot.id})?`, "confirm", async () => {
                try {
                    const bookingsRef = collection(db, `artifacts/${appId}/users/${user.uid}/bookings`);
                    const q = query(bookingsRef,
                        where("spotId", "==", selectedSpot.id),
                        where("status", "==", "active")
                    );
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const bookingDoc = querySnapshot.docs[0];
                        const bookingDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/bookings`, bookingDoc.id);
                        await updateDoc(bookingDocRef, { status: 'cancelled', cancelledAt: new Date().toISOString() });
                        showModal(`Booking for ${selectedSpot.id} has been cancelled.`, "success");
                        console.log(`MapPage: Booking for ${selectedSpot.id} cancelled in Firestore.`);
                    } else {
                        showModal("No active booking found for this spot.", "info");
                        console.log("MapPage: No active booking found for cancellation.");
                    }
                    setSelectedSpot(null); // Close the modal after action
                } catch (error) {
                    console.error("MapPage: Error cancelling booking:", error);
                    showModal(`Failed to cancel booking: ${error.message}`, "error");
                }
            });
        }
    }, [user, db, appId, selectedSpot, showModal]);

    const formatTime = useCallback((seconds) => {
        if (seconds < 0) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);


    // --- Effect for Map Initialization ---
    useEffect(() => {
        console.log("MapPage: Map initialization effect running.");
        if (mapRef.current && !leafletMapRef.current) {
            leafletMapRef.current = L.map(mapRef.current, {
                center: [-19.0154, 29.1549], // Centered on Zimbabwe
                zoom: 7,
                layers: [
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    })
                ]
            });
            console.log("MapPage: Leaflet map initialized!");

            window.leafletMapRef = leafletMapRef; // Expose for debugging
            leafletMapRef.current.invalidateSize(); // Ensure map renders correctly

            window.addEventListener('resize', handleResize);
        }

        return () => {
            const currentMap = leafletMapRef.current;
            if (currentMap) {
                currentMap.remove();
                leafletMapRef.current = null;
                console.log("MapPage: Leaflet map cleaned up.");
                delete window.leafletMapRef;
            }
            // Clear all intervals on unmount
            Object.values(intervalRefs.current).forEach(intervalId => clearInterval(intervalId));
            intervalRefs.current = {};
            window.removeEventListener('resize', handleResize);
        };
    }, [mapRef, handleResize]);


    // --- Effect for Fetching Spots from Firestore ---
    useEffect(() => {
        console.log("MapPage: Attempting to fetch spots. db:", db, "appId:", appId, "isAuthReady:", isAuthReady);
        if (!db || !appId || !isAuthReady) {
            console.log("MapPage: Firestore or App ID not ready, or Auth not ready. Skipping spot fetch.");
            return;
        }

        const fetchSpots = async () => {
            try {
                const spotsCollectionRef = collection(db, `artifacts/${appId}/public/data/parkingSpots`);
                console.log("MapPage: Fetching from path:", `artifacts/${appId}/public/data/parkingSpots`);
                const q = query(spotsCollectionRef);
                const querySnapshot = await getDocs(q);
                const fetchedSpots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (fetchedSpots.length === 0) {
                    console.warn("MapPage: No parking spots found in Firestore. Using dummy data.");
                    const dummySpots = [
                        { id: 'H1', lat: -17.8287, lng: 31.0534, status: 'available', priceUSD: 2.50, name: 'Harare CBD Parking', address: '1st Street, Harare' },
                        { id: 'H2', lat: -17.8350, lng: 31.0450, status: 'available', priceUSD: 3.00, name: 'Samora Machel Ave Lot', address: 'Samora Machel Ave, Harare' },
                        { id: 'B1', lat: -20.1543, lng: 28.5775, status: 'available', priceUSD: 2.00, name: 'Bulawayo City Centre', address: 'Main Street, Bulawayo' },
                        { id: 'B2', lat: -20.1600, lng: 28.5850, status: 'available', priceUSD: 2.75, name: 'Trade Fair Parking', address: 'Trade Fair Rd, Bulawayo' },
                        { id: 'V1', lat: -17.9243, lng: 25.8567, status: 'available', priceUSD: 3.50, name: 'Vic Falls Main Gate', address: 'Livingstone Way, Vic Falls' },
                        { id: 'V2', lat: -17.9300, lng: 25.8650, status: 'available', priceUSD: 3.20, name: 'Vic Falls Airport Parking', address: 'Airport Rd, Vic Falls' },
                        { id: 'M1', lat: -18.9200, lng: 32.6100, status: 'available', priceUSD: 1.80, name: 'Mutare Town Centre', address: 'Herbert Chitepo St, Mutare' },
                        { id: 'G1', lat: -19.4300, lng: 30.0000, status: 'available', priceUSD: 2.10, name: 'Gweru CBD Parking', address: 'Robert Mugabe Way, Gweru' },
                    ];
                    setSpots(dummySpots);
                } else {
                    setSpots(fetchedSpots);
                }
                console.log("MapPage: Successfully fetched parking spots:", fetchedSpots);
            } catch (error) {
                console.error("MapPage: Error fetching parking spots from Firestore:", error);
                showModal(`Failed to load parking spots. Using dummy data as fallback. Error: ${error.message}`, "error");
                setSpots([
                    { id: 'H1', lat: -17.8287, lng: 31.0534, status: 'available', priceUSD: 2.50, name: 'Harare CBD Parking', address: '1st Street, Harare' },
                    { id: 'H2', lat: -17.8350, lng: 31.0450, status: 'available', priceUSD: 3.00, name: 'Samora Machel Ave Lot', address: 'Samora Machel Ave, Harare' },
                ]);
            }
        };

        fetchSpots();

    }, [db, appId, isAuthReady, showModal]); // Dependencies: Firestore, appId, auth status, showModal

    // --- Effect for Listening to User Bookings (Real-time) and Managing Timers ---
    useEffect(() => {
        console.log("MapPage: Attempting to set up booking listener. db:", db, "user:", user, "appId:", appId, "isAuthReady:", isAuthReady);
        if (!db || !user || !appId || !isAuthReady) {
            console.log("MapPage: Firestore, user, or App ID not ready, or Auth not ready. Skipping booking listener.");
            // Clear existing timers if user logs out or context becomes unavailable
            Object.values(intervalRefs.current).forEach(intervalId => clearInterval(intervalId));
            intervalRefs.current = {};
            setActiveBookingTimers({});
            return;
        }

        const userBookingsRef = collection(db, `artifacts/${appId}/users/${user.uid}/bookings`);
        const q = query(userBookingsRef, where("status", "==", "active"));

        console.log(`MapPage: Setting up real-time listener for user ${user.uid}'s active bookings.`);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("MapPage: Booking snapshot received.");
            const now = Date.now();
            const currentActiveBookingsMap = {}; // Map to store active bookings from snapshot
            const newTimersMap = {}; // Map to store initial timer values

            snapshot.docs.forEach(doc => {
                const booking = { id: doc.id, ...doc.data() };
                const endTimeMs = new Date(booking.endTime).getTime();

                if (endTimeMs > now) {
                    currentActiveBookingsMap[booking.spotId] = booking;
                    newTimersMap[booking.spotId] = Math.max(0, Math.round((endTimeMs - now) / 1000));
                } else {
                    // Booking has expired, update its status in Firestore
                    console.log(`MapPage: Booking ${booking.id} for spot ${booking.spotId} has expired. Updating Firestore.`);
                    updateDoc(doc(db, `artifacts/${appId}/users/${user.uid}/bookings`, booking.id), { status: 'expired' })
                        .catch(error => console.error("MapPage: Error updating expired booking status:", error));
                }
            });

            // Update the main 'spots' state based on active bookings
            setSpots(prevSpots => prevSpots.map(spot => {
                if (currentActiveBookingsMap[spot.id]) {
                    // This spot is actively booked by the current user
                    return { ...spot, status: 'booked', timer: currentActiveBookingsMap[spot.id].endTime };
                } else if (spot.status === 'booked' && !currentActiveBookingsMap[spot.id]) {
                    // This spot was booked but is no longer active (expired or cancelled)
                    return { ...spot, status: 'available', timer: null };
                }
                return spot;
            }));

            // Manage timers: clear old ones, start new ones
            Object.keys(intervalRefs.current).forEach(spotId => {
                if (!newTimersMap[spotId]) { // If a spot no longer has an active booking
                    clearInterval(intervalRefs.current[spotId]);
                    delete intervalRefs.current[spotId];
                }
            });

            Object.keys(newTimersMap).forEach(spotId => {
                if (!intervalRefs.current[spotId]) { // If a new booking is found or an existing one needs a timer
                    intervalRefs.current[spotId] = setInterval(() => {
                        setActiveBookingTimers(prevTimers => {
                            const updatedTimers = { ...prevTimers };
                            const bookingEndTimeMs = new Date(currentActiveBookingsMap[spotId].endTime).getTime();
                            const remainingSeconds = Math.max(0, Math.round((bookingEndTimeMs - Date.now()) / 1000));

                            if (remainingSeconds <= 0) {
                                clearInterval(intervalRefs.current[spotId]);
                                delete intervalRefs.current[spotId];
                                delete updatedTimers[spotId];
                                console.log(`MapPage: Timer for spot ${spotId} finished.`);
                                showModal(`Your booking for ${currentActiveBookingsMap[spotId].spotName} (${spotId}) has ended.`, "info");
                                // Trigger a re-fetch or status update for the spot to become available on map
                                setSpots(prev => prev.map(s => s.id === spotId ? { ...s, status: 'available', timer: null } : s));
                            } else {
                                updatedTimers[spotId] = remainingSeconds;
                            }
                            return updatedTimers;
                        });
                    }, 1000);
                }
            });
            setActiveBookingTimers(newTimersMap); // Update the state with current timers
        }, (error) => {
            console.error("MapPage: Error listening to user bookings:", error);
            showModal(`Failed to load your active bookings. Error: ${error.message}`, "error");
        });

        return () => {
            unsubscribe(); // Clean up Firestore listener
            Object.values(intervalRefs.current).forEach(intervalId => clearInterval(intervalId)); // Clear all timers
            intervalRefs.current = {};
            setActiveBookingTimers({});
            console.log("MapPage: User bookings listener unsubscribed and timers cleared.");
        };
    }, [db, user, appId, isAuthReady, showModal]);

    // --- Effect to add/update markers when spots state changes ---
    useEffect(() => {
        console.log("MapPage: Markers update effect running. Spots count:", spots.length);
        if (!leafletMapRef.current || spots.length === 0) {
            return;
        }

        const updatedMarkerRefs = {};

        spots.forEach(spot => {
            let iconToUse;
            if (spot.status === 'booked') {
                iconToUse = bookedIcon;
            } else if (selectedSpot && selectedSpot.id === spot.id) {
                iconToUse = selectedIcon;
            } else {
                iconToUse = availableIcon;
            }

            let marker = markerRefs.current[spot.id];
            if (marker) {
                // Update existing marker's position and icon
                marker.setLatLng([spot.lat, spot.lng]);
                marker.setIcon(iconToUse);
            } else {
                // Create new marker
                marker = L.marker([spot.lat, spot.lng], { icon: iconToUse })
                    .addTo(leafletMapRef.current);
                marker.on('click', () => handleMarkerClick(spot.id)); // Attach click handler
            }
            marker.bindTooltip(spot.name, { permanent: false, direction: 'top' });
            updatedMarkerRefs[spot.id] = marker;
        });

        // Remove markers that are no longer in the 'spots' state
        Object.keys(markerRefs.current).forEach(markerId => {
            if (!updatedMarkerRefs[markerId]) {
                leafletMapRef.current.removeLayer(markerRefs.current[markerId]);
            }
        });
        markerRefs.current = updatedMarkerRefs;
        console.log("MapPage: Markers updated/drawn.");
    }, [spots, selectedSpot, handleMarkerClick]);


    return (
        <section className="map-page-section">
            <div className="map-header">
                <h1 className="map-page-title">Interactive Parking Map - Zimbabwe</h1>
                <p className="map-page-subtitle">Click on a marker to view details and book a spot.</p>
            </div>

            <div id="map-container" ref={mapRef} className="map-canvas-container">
                {/* Leaflet map will be rendered here */}
            </div>

            {/* Conditional rendering for spot details modal: Only show if selectedSpot is true AND payment modal is NOT showing */}
            {selectedSpot && !showPaymentModal && (
                <div className="booking-modal-overlay">
                    <div className="booking-modal">
                        <button className="close-modal-btn" onClick={() => setSelectedSpot(null)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h2>Spot Details: {selectedSpot.name} ({selectedSpot.id})</h2>
                        {/* Display both USD and ZWL prices */}
                        <p className="spot-price">
                            <FontAwesomeIcon icon={faDollarSign} /> Price: ${selectedSpot.priceUSD.toFixed(2)} USD
                            (ZWL {(selectedSpot.priceUSD * USD_TO_ZWL_RATE).toFixed(2)}) / hour
                        </p>
                        <p className="spot-status">
                            <FontAwesomeIcon icon={selectedSpot.status === 'available' ? faCheckCircle : faTimesCircle}
                                className={selectedSpot.status === 'available' ? 'status-icon-available' : 'status-icon-booked'} />
                            Status: <span className={selectedSpot.status === 'available' ? 'status-available' : 'status-booked'}>{selectedSpot.status.toUpperCase()}</span>
                        </p>

                        {selectedSpot.status === 'available' && (
                            <button
                                className="btn btn-primary ripple-effect"
                                onClick={handleBookSpot} // This now opens the payment modal directly
                                disabled={!isAuthReady || !user}
                            >
                                {isAuthReady && !user ? 'Login to Book' : 'Book This Spot'}
                            </button>
                        )}

                        {selectedSpot.status === 'booked' && (
                            <div className="booked-info">
                                <p className="booking-timer">
                                    <FontAwesomeIcon icon={faClock} /> Time Left:
                                    <span>{formatTime(activeBookingTimers[selectedSpot.id] || 0)}</span>
                                </p>
                                <button className="btn btn-secondary ripple-effect btn-cancel-booking" onClick={handleCancelBooking}>
                                    Cancel Booking
                                </button>
                            </div>
                        )}
                        {!user && isAuthReady && (
                            <p className="login-prompt-message">
                                Please <Link to="/login">login</Link> or <Link to="/signup">sign up</Link> to book a spot.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Payment Modal - Re-integrated into MapPage */}
            {showPaymentModal && selectedSpot && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal">
                        <button className="close-modal-btn" onClick={() => {
                            setShowPaymentModal(false);
                            setSelectedSpot(null); // Close spot details modal too
                        }}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h2>Complete Payment for {selectedSpot.name}</h2>
                        <p className="payment-amount">Amount:
                            <span className="currency-display">{selectedCurrency === 'ZWL' ? 'ZWL' : '$'}</span>
                            {parseFloat(userEnteredAmount).toFixed(2)}
                        </p>

                        <form onSubmit={handlePaymentSubmit} className="payment-form">
                            <div className="form-group">
                                <label>Payment Method:</label>
                                <div className="radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            value="ecocash"
                                            checked={selectedPaymentMethod === 'ecocash'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        /> EcoCash
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="onemoney"
                                            checked={selectedPaymentMethod === 'onemoney'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        /> OneMoney
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="omari"
                                            checked={selectedPaymentMethod === 'omari'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        /> Omari
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="currency">Currency:</label>
                                <select id="currency" value={selectedCurrency} onChange={handleCurrencyChange} className="currency-select">
                                    <option value="ZWL">ZWL</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number:</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="e.g., 0771234567"
                                    required
                                    className="phone-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="amount">Amount (Auto-filled):</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={userEnteredAmount}
                                    onChange={(e) => setUserEnteredAmount(e.target.value)}
                                    step="0.01"
                                    readOnly={false} // Can be true if you strictly don't want manual edits
                                    required
                                    className="amount-input"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary ripple-effect btn-pay"
                                disabled={paymentLoading || !userEnteredAmount || parseFloat(userEnteredAmount) <= 0}
                            >
                                {paymentLoading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faCreditCard} /> Pay Now
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MapPage;