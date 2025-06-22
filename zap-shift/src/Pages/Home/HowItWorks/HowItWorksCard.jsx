import React from 'react';

const HowItWorksCard = ({ item }) => {
    const { icon:Icon, title, description }= item;
    return (
        <div className="card bg-base-100 shadow-xl p-6 rounded-2xl flex flex-col items-start text-left hover:scale-105 transition duration-300">
            <div className="text-primary mb-4">
                {/* The icon prop will be a React Icon component */}
                {Icon && <Icon className="w-12 h-12" />}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default HowItWorksCard;