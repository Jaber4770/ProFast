import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

const Forbidden = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200 px-4 my-10 rounded-2xl">
            <div className="max-w-md text-center">
                <ShieldOff className="w-20 h-20 text-error mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-error mb-2">403 - Forbidden</h1>
                <p className="text-gray-600 mb-6">
                    Sorry, you don't have permission to access this page.
                </p>
                <Link
                    to="/"
                    className="btn bg-green-400"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Forbidden;
