import React from 'react';
import logo from '../../../assets/logo.png';
import { Link } from 'react-router-dom'; // ✅ CORRECT PACKAGE

const ProFastLogo = () => {
    return (
        <div>
            <Link to='/'>
                <div className='flex items-end'>
                    <img className='mb-2' src={logo} alt="" />
                    <span className='-ml-4 text-3xl font-extrabold'>ProFast</span>
                </div>
            </Link>
        </div>
    );
};

export default ProFastLogo;
