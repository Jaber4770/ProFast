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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayouts/>,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/coverage',
                Component: Coverage,
                loader:()=>fetch('../../public/warehouses.json')
            },
            {
                path: '/about',
                Component: About
            }, {
                path: '/sendPercel',
                element: <PrivateRoute><SendPercel></SendPercel></PrivateRoute>,
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
                Component:Login
            },
            {
                path: 'register',
                Component:Register
            }
        ]
    }
]);