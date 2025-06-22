import React from 'react';
import HowItWorksCard from './HowItWorksCard'; // Assuming HowItWorksCard is in the same directory or correctly imported
import { MdOutlineLocalShipping, MdAttachMoney, MdOutlineWarehouse, MdBusinessCenter } from 'react-icons/md';

const HowItWorksSection = () => {
    const howItWorksData = [
        {
            icon: MdOutlineLocalShipping, // React Icon component
            title: "Booking Pick & Drop",
            description: "From personal packages to business shipments — we deliver on time, every time.",
        },
        {
            icon: MdAttachMoney, // React Icon component
            title: "Cash On Delivery",
            description: "From personal packages to business shipments — we deliver on time, every time.",
        },
        {
            icon: MdOutlineWarehouse, // React Icon component
            title: "Delivery Hub",
            description: "From personal packages to business shipments — we deliver on time, every time.",
        },
        {
            icon: MdBusinessCenter, // React Icon component
            title: "Booking SME & Corporate",
            description: "From personal packages to business shipments — we deliver on time, every time.",
        },
    ];

    return (
        <section className="py-16 px-4">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-12 text-left">How it Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {howItWorksData.map((item, index) => (
                        <HowItWorksCard
                            key={index}
                            item={item}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;