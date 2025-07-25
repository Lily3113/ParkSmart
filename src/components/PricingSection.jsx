// src/components/PricingSection.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Icons for pricing features
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../App.css'; // Link to its specific CSS

const PricingSection = () => {
    const pricingPlans = [
        {
            name: "Hourly Flex",
            price: "$1.00",
            period: "/ hour",
            features: [
                "Perfect for quick errands",
                "Pay-as-you-go convenience",
                "Real-time spot availability",
                "Secure payment processing"
            ],
            isPopular: false
        },
        {
            name: "Daily Saver",
            price: "$10",
            period: "/ day",
            features: [
                "Ideal for full-day parking",
                "Guaranteed spot for 24 hours",
                "In-app navigation to spot",
                "Email confirmation & reminders"
            ],
            isPopular: true
        },
        {
            name: "Monthly Pro",
            price: "$40",
            period: "/ month",
            features: [
                "Unlimited parking access",
                "Dedicated parking zone options",
                "Priority customer support",
                "Exclusive member discounts"
            ],
            isPopular: false
        }
    ];

    return (
        <section className="pricing-section">
            <div className="pricing-header">
                <h2 className="pricing-title">Our Flexible Pricing</h2>
                <p className="pricing-subtitle">Choose the perfect parking plan that fits your needs.</p>
            </div>
            <div className="pricing-grid">
                {pricingPlans.map((plan, index) => (
                    <div className={`pricing-card card-hover-scale ${plan.isPopular ? 'popular-plan' : ''}`} key={index}>
                        {plan.isPopular && <div className="popular-badge">Most Popular</div>}
                        <h3 className="plan-name">{plan.name}</h3>
                        <div className="plan-price-wrapper">
                            <span className="plan-price">{plan.price}</span>
                            <span className="plan-period">{plan.period}</span>
                        </div>
                        <ul className="plan-features">
                            {plan.features.map((feature, i) => (
                                <li key={i}>
                                    <FontAwesomeIcon icon={faCheckCircle} className="feature-icon" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-primary ripple-effect">Choose Plan</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PricingSection;