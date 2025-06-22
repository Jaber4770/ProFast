import {
    createBrowserRouter
} from "react-router";
import RootLayouts from "../layouts/RootLayouts";
import Home from "../Pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayouts/>,
        children: [
            {
                index: true,
                Component: Home
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