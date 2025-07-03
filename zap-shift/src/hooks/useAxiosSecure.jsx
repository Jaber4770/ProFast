// useAxiosSecure.js
import axios from 'axios';
import React, { useEffect } from 'react'; // ✅ FIXED: Added useEffect to control interceptor lifecycle
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

// ✅ FIXED: Use environment variable for baseURL to support deployment environments
const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'Lal Salam Hacker!' }
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ FIXED: Only attach interceptors once using useEffect
        const requestInterceptor = axiosSecure.interceptors.request.use(config => {
            // ✅ FIXED: Added optional chaining to avoid error when user is undefined
            if (user?.accessToken) {
                config.headers.Authorization = `Bearer ${user.accessToken}`;
            }
            return config;
        }, err => Promise.reject(err));

        const responseInterceptor = axiosSecure.interceptors.response.use(
            res => res,
            error => {
                // ✅ FIXED: Properly extract status from error.response to avoid undefined
                const status = error.response?.status;
                console.log("inside res interceptor:", status);

                // ✅ FIXED: Uncommented and handled 403 & 401 errors
                if (status === 403) {
                    navigate('/forbidden');
                } else if (status === 401) {
                    logOut().then(() => navigate('/login')).catch(() => { });
                }

                return Promise.reject(error);
            }
        );

        // ✅ FIXED: Cleanup interceptors when component unmounts or dependencies change
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [user, logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;
