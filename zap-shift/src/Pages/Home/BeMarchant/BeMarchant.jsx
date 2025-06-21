import React from 'react';
// import marchentBg from '../../../assets/be-a-merchant-bg.png'
import marchentImg from '../../../assets/location-merchant.png'

const BeMarchant = () => {
    return (
        <div
            data-aos="zoom-in-up"
            className="hero text-white rounded-4xl my-10 bg-[#03373d]">
            <div className={`hero-content flex-col lg:flex-row-reverse bg-[url(assets/be-a-merchant-bg.png)]  bg-no-repeat`}>
                <img
                    src={marchentImg}
                    className="max-w-sm rounded-lg shadow-2xl"
                />
                <div className='p-20'>
                    <h1 className="text-5xl font-bold">Merchant and Customer Satisfaction is Our First Priority</h1>
                    <p className="py-6">
                        We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                    </p>
                    <div className='flex gap-3'>
                        <button className="btn bg-[#cceb67] rounded-full px-3 py-2 shadow-none">Be a Marchent</button>
                        <button className="btn bg-transparent text-[#cceb67] rounded-full px-3 py-2 shadow-none">Earn with Profast Courier</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeMarchant;