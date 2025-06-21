import React from 'react';

const faqData = [
    {
        question: "How does this delivery service work?",
        answer: "Our delivery service is simple! You can book a pickup and drop-off, choose 'Cash On Delivery' if applicable, or send packages to our nearest 'Delivery Hub' for collection. For businesses, we offer 'SME & Corporate' accounts for streamlined services. We focus on getting your items delivered on time, every time."
    },
    {
        question: "Is your delivery service suitable for all package sizes and types?",
        answer: "We handle a wide range of package sizes and types, from small personal items to larger business shipments. If you have specific requirements for oversized or unusual items, please contact our support team, and we'll be happy to assist you with a tailored solution."
    },
    {
        question: "How do you ensure timely and safe delivery?",
        answer: "We prioritize timely and safe delivery through several measures: our efficient routing system, a dedicated network of couriers, real-time tracking for your peace of mind, and secure handling protocols for all packages. We're committed to delivering your items intact and on schedule."
    },
    {
        question: "Do you offer real-time tracking or delivery updates?",
        answer: "Yes, absolutely! For most of our services, you'll receive a tracking number that allows you to monitor your package's journey in real-time. We also provide email or SMS updates at key stages of the delivery process, from pickup to final delivery."
    },
    {
        question: "How will I be notified when my delivery is confirmed or completed?",
        answer: "You will receive notifications via email or SMS at various stages. This includes confirmation of your booking, updates when your package is picked up, when it's out for delivery, and a final notification upon successful delivery. You can also check the status anytime using your tracking number on our website."
    }
];

const Faq = () => {
    return (
        <div className='my-16'>
            <div className='text-center'>
                <div className='w-2/3 mx-auto'>
                    <h1 className='text-3xl font-bold'>Frequently Asked Question (FAQ)</h1>
                    <p className=''>Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!</p>
                </div>
            </div>

            <div className='space-y-4 mt-5'>
                {
                    faqData.map((faq, index) => (
                        <div key={index} className="collapse collapse-arrow bg-base-100 border border-base-300">
                            <input type="radio"
                                name="my-accordion-2"
                                defaultChecked={index === 0} />
                            <div className="collapse-title font-semibold">
                                <p className={`pb-1 border-b-1 border-gray-300`}>{faq.question}</p>
                            </div>
                            <div className="collapse-content text-sm">{faq.answer}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Faq;