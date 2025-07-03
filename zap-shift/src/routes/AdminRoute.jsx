import React from 'react';
import useAuth from '../hooks/useAuth';
import Loader from '../Pages/shared/Loader/Loader';
import useUserRole from '../hooks/useUserRole';
import { Navigate } from 'react-router';

const AdminRoute = ({ children }) => {

    const { user, loading } = useAuth();
    const { role, loading: authLoading } = useUserRole();

/* 
    console.log('user email:', user?.email);
    console.log('role from backend:', role); */


    if (loading || authLoading) {
        return <Loader></Loader>
    }

    if (!loading && !authLoading && (!user || role !== 'admin')) {
        return <Navigate to="/forbidden" />;
    }

    return (
        children
    );
};

export default AdminRoute;