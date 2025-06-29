import {
    createBrowserRouter
} from "react-router";
import RootLayouts from "../layouts/RootLayouts";
import Home from "../Pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import About from "../Pages/About/About";
import SendPercel from "../Pages/SendParcel/SendPercel";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyPercels from '../Pages/Dashboard/MyPercels/MyPercels'
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import UpdateProfile from "../Pages/Dashboard/UpdateProfile/UpdateProfile";
import BeARider from "../Pages/Dashboard/BeARider/BeARider";
import ApprovedRiders from "../Pages/Dashboard/ApprovedRiders/ApprovedRiders";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import BlockedRiders from "../Pages/Dashboard/BlockedRiders/BlockedRiders";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayouts />,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/coverage',
                Component: Coverage,
                loader: () => fetch('../../public/warehouses.json')
            },
            {
                path: '/about',
                Component: About
            },
            {
                path: '/sendParcel',
                element: <PrivateRoute><SendPercel></SendPercel></PrivateRoute>,
                loader: () => fetch('../../public/warehouses.json')
            },
            {
                path: 'beARider',
                element: <PrivateRoute><BeARider></BeARider></PrivateRoute>,
                loader: () => fetch('../../public/warehouses.json')
            }
        ]
    },
    {
        path: "/",
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
                    <DashboardLayout></DashboardLayout>
                </PrivateRoute>,
        children: [
            {
                path: 'myParcels',
                element: <MyPercels></MyPercels>
            },
            {
                path: 'payment/:parcelId',
                element: <Payment></Payment>
            },
            {
                path: 'paymentHistory',
                element: <PaymentHistory></PaymentHistory>
            },
            {
                path: 'trackParcel',
                element: <TrackParcel></TrackParcel>
            },
            {
                path: 'updateProfile',
                element: <UpdateProfile></UpdateProfile>
            },
            {
                path: 'approvedRiders',
                element: <ApprovedRiders></ApprovedRiders>
            },
            {
                path: 'pendingRiders',
                element: <PendingRiders></PendingRiders>
            },
            {
                path: 'blockedRiders',
                element: <BlockedRiders></BlockedRiders>
            }
        ]
    }
]);