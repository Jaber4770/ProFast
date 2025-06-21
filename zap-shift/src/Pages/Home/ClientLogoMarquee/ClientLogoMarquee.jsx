import React from 'react';
import Marquee from 'react-fast-marquee';

import amazon from '../../../assets/brands/amazon.png';
import amazonVector from '../../../assets/brands/amazon_vector.png';
import casio from '../../../assets/brands/casio.png';
import moonstar from '../../../assets/brands/moonstar.png';
import randstad from '../../../assets/brands/randstad.png';
import start from '../../../assets/brands/start.png';
import startPeople from '../../../assets/brands/start-people 1.png';

const clientLogos = [
    amazon,
    amazonVector,
    casio,
    moonstar,
    randstad,
    start,
    startPeople
];


const ClientLogoMarquee = () => {
    return (
        <section className="py-16 bg-base-100">
            <h2 className="text-3xl font-bold text-center mb-10">We've  helped thousands of sales teams</h2>

            <Marquee
                direction="left"
                pauseOnHover
                speed={40}
                gradient={false}
                className="flex gap-10"
            >
                {clientLogos.map((logo, index) => (
                    // console.log(logo),
                    <div
                        key={index}
                        className="flex items-center justify-center mx-6 min-w-[120px] h-20 md:min-w-[160px] md:h-24"
                    >
                        <img
                            src={logo}
                            alt={`client-logo-${index}`}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                ))}
            </Marquee>
        </section>
    );
};

export default ClientLogoMarquee;