import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { HomeIcon, LayoutDashboard, LocateFixed, Package, ReceiptText, User } from "lucide-react";
import ProFastLogo from '../Pages/shared/ProFastLogo/ProFastLogo';

const DashboardLayout = () => {
    return (
        <div className='flex gap-4'>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="lg:hiddne drawer-content flex flex-col">
                    {/* Navbar */}
                    <div className="navbar bg-base-300 w-full lg:hidden flex">
                        <div className="flex-none lg:hidden">
                            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-6 w-6 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </label>
                        </div>
                        <div className="mx-2 flex-1 px-2">Dashboard</div>
                    </div>
                    {/* Page content here */}
                    <Outlet></Outlet>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        {/* Sidebar content here */}
                        <ProFastLogo />
                        <li>
                            <Link to='/'>
                                <HomeIcon className="text-3xl"/> Home
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard'>
                                <LayoutDashboard className="text-3xl"/> Dashboard
                            </Link>
                        </li>
                        <li>
                            <NavLink to='/dashboard/myParcels'>
                                <Package className="text-3xl"/> My Parcels
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/trackParcel'>
                                <LocateFixed className="text-3xl"/> Track a Parcel
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/paymentHistory'>
                                <ReceiptText className="text-3xl"/> Payment History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/dashboard/updateProfile'>
                                <User className="text-3xl"/> Update Profile
                            </NavLink>
                        </li>
                    </ul>
                </div>

            </div>

        </div>
    );
};

export default DashboardLayout;