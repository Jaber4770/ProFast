import React from 'react';
import logo from '../../../assets/logo.png'
import { Link } from 'react-router';

const ProFastLogo = () => {
    return (
        <Link to='/'>
            <div className='flex items-end'>
                <img className='mb-2' src={logo} alt="" />
                <span className='-ml-4 text-3xl font-extrabold'>ProFast</span>
            </div>
        </Link>
    );
};

export default ProFastLogo;