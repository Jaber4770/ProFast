import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './styles.css';
// import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';


 const testimonials = [
    {
        name: "Rasel Ahamed",
        role: "CTO",
        quote: "A posture connector works by providing support and gentle alignment...",
    },
    {
        name: "Awlad Hossin",
        role: "Senior Product Designer",
        quote: "A posture connector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    },
    {
        name: "Nasir Uddin",
        role: "CEO",
        quote: "A posture connector works by providing support and gentle alignment...",
    },
    {
        name: "Nasir Uddin",
        role: "CEO",
        quote: "A posture connector works by providing support and gentle alignment...",
    },
    {
        name: "Nasir Uddin",
        role: "CEO",
        quote: "A posture connector works by providing support and gentle alignment...",
    },
    {
        name: "Nasir Uddin",
        role: "CEO",
        quote: "A posture connector works by providing support and gentle alignment...",
    },
    {
        name: "Nasir Uddin",
        role: "CEO",
        quote: "A posture connector works by providing support and gentle alignment...",
    }
];



const Review = () => {
    
    return (
        <>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination]}
                className="mySwiper"
            >
                {
                    testimonials.map(test => (
                        <SwiperSlide>
                            <div className='bg-gray-400 p-5 rounded-xl h-full text-white bg-contain bg-[url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/K%C3%B6nigsee_in_Bayern.jpg/800px-K%C3%B6nigsee_in_Bayern.jpg")]'>
                                <h1 className='text-2xl font-bold'>{test.name}</h1>
                                <span className='font-bold'>{test.role}</span>
                                <h1>{test.quote}</h1>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
      </>
    );
};

export default Review;