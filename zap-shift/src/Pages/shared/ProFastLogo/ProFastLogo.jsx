import React from 'react';
import logo from '../../../assets/logo.png'

const ProFastLogo = () => {
    return (
        <div className='flex items-end'>
            <img className='mb-2' src={logo} alt="" />
            <span className='-ml-4 text-3xl font-extrabold'>ProFast</span>
        </div>
    );
};

export default ProFastLogo;