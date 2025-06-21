// FeaturesSection.jsx
import React from 'react';
import liveTraking from '../../../assets/live-tracking.png';
import safeDelivery from '../../../assets/safe-delivery.png';
import callCener from '../../../assets/safe-delivery.png';

const features = [
    {
        title: "Live Parcel Tracking",
        description:
            "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
        image: liveTraking,
    },
    {
        title: "100% Safe Delivery",
        description:
            "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
        image: safeDelivery,
    },
    {
        title: "24/7 Call Center Support",
        description:
            "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
        image: callCener,
    },
];

const FeaturesSection = () => {
    return (
        <section className="border-dashed border-t-2 border-b-2 my-10 py-16">
            <div className="container mx-auto px-4 space-y-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm"
                    >
                        {/* Image */}
                        <img
                            src={feature.image}
                            alt={feature.title}
                            className="w-28 md:w-40 object-contain"
                        />

                        {/* Dashed Divider */}
                        <div className="hidden md:block h-24 w-px border-dashed border-l-2 border-gray-300"></div>

                        {/* Text Content */}
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 mt-2 max-w-2xl">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
