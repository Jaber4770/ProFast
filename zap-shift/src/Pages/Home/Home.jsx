import React from 'react';
import Banner from './Banner/Banner';
import Services from './Services/Services';
import ClientLogoMarquee from './ClientLogoMarquee/ClientLogoMarquee';
import FeaturesSection from './FeaturesSection/FeaturesSection';
import BeMarchant from './BeMarchant/BeMarchant';
import HowItWorksSection from './HowItWorks/HowItWorksSection';
import Faq from './FAQ/Faq';
import Review from './Review/Review';

const Home = () => {
    // console.log("this is home")
    return (
        <div>
            <Banner></Banner>
            <HowItWorksSection></HowItWorksSection>
            <Services></Services>
            <ClientLogoMarquee></ClientLogoMarquee>
            <FeaturesSection></FeaturesSection>
            <BeMarchant></BeMarchant>
            <Faq></Faq>
            <Review></Review>
        </div>
    );
};

export default Home;