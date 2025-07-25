// src/pages/FAQPage.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../App.css'; // Link to its specific CSS

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="faq-item">
            <button className="faq-question-button" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="faq-question">{question}</h3>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="faq-toggle-icon" />
            </button>
            {isOpen && (
                <div className="faq-answer-container">
                    <p className="faq-answer">{answer}</p>
                </div>
            )}
        </div>
    );
};

const FAQPage = ({ navigateTo }) => {
    const faqs = [
        {
            question: "How do I find a parking spot?",
            answer: "You can easily find a parking spot using the search bar on our homepage. Enter your desired location, date, and time, and we'll show you available options near you."
        },
        {
            question: "Is payment secure?",
            answer: "Yes, all payments are processed through a secure and encrypted gateway. We prioritize the security of your financial information."
        },
        {
            question: "Can I cancel or modify my booking?",
            answer: "Booking modifications and cancellations are subject to the specific parking lot's policy. You can check the details in your booking confirmation or contact our support."
        },
        {
            question: "What if I can't find my reserved spot?",
            answer: "In the rare event you can't find your spot, please contact our 24/7 support team immediately using the details provided in your booking confirmation. We're here to help!"
        },
        {
            question: "Do you offer monthly parking options?",
            answer: "Yes, we offer monthly parking plans for frequent users, providing unlimited access and exclusive benefits. Check our 'Pricing' section for more details."
        }
    ];

    return (
        <section className="faq-page-section">
            <div className="faq-header">
                <h1 className="faq-page-title">Frequently Asked Questions</h1>
                <p className="faq-page-subtitle">Find answers to common questions about ParkSmart.</p>
            </div>
            <div className="faq-list-container">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
            <div className="faq-contact-prompt">
                <p>Still have questions? Our support team is here to help!</p>
                <button className="btn btn-primary ripple-effect" onClick={() => navigateTo('contact')}>
                    Contact Support
                </button>
            </div>
        </section>
    );
};

export default FAQPage;