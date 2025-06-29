import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';


const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

const useAxiosSecure = () => {
    const { user } = useAuth();
    axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization=`Bearer ${user.accessToken}`
        return config;
    }, err => {
        return Promise.reject(err);
    })
    return axiosSecure;
};

export default useAxiosSecure;