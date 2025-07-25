// src/components/Footer.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
// NEW ICONS for Contact Info
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
// IMPORTANT: Link to your dedicated Footer.css
import '../App.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* Existing: Brand Info */}
                <div className="footer-section footer-brand-info">
                    <img src="/images/logo.png" alt="ParkSmart Logo" className="footer-logo" />
                    <p className="footer-tagline">Your hassle-free parking solution.</p>
                </div>

                {/* NEW SECTION: Quick Links */}
                <div className="footer-section footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about-us">About Us</a></li>
                        <li><a href="/map">Parking Map</a></li>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li> {/* Example link */}
                        <li><a href="/terms">Terms of Service</a></li> {/* Example link */}
                    </ul>
                </div>

                {/* NEW SECTION: Contact Information */}
                <div className="footer-section footer-contact">
                    <h3>Contact Us</h3>
                    <p><FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Smart Park Ave, Harare, Zimbabwe</p>
                    <p><FontAwesomeIcon icon={faPhone} /> +263 77 123 4567</p>
                    <p><FontAwesomeIcon icon={faEnvelope} /> support@parksmart.co.zw</p>
                </div>

                {/* NEW SECTION: Newsletter / Stay Connected */}
                <div className="footer-section footer-newsletter">
                    <h3>Stay Connected</h3>
                    <p>Subscribe to our newsletter for the latest updates and offers.</p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Enter your email" aria-label="Email for newsletter" />
                        <button type="submit">Subscribe</button>
                    </div>
                </div>

                {/* Existing: Social Links (positioned separately in CSS for flexibility) */}
                <div className="footer-section footer-social-links">
                    <h3>Follow Us</h3> {/* Added a heading for social links */}
                    <div className="social-icons-wrapper">
                        <a href="https://facebook.com/parksmart" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="https://twitter.com/parksmart" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="https://instagram.com/parksmart" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://linkedin.com/company/parksmart" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="footer-copyright">&copy; {currentYear} ParkSmart. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;