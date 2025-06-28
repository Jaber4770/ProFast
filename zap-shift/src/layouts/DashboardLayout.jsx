import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { Home, HomeIcon, LayoutDashboard, Package } from "lucide-react";
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
                        <ProFastLogo></ProFastLogo>
                        <li><Link to='/'><HomeIcon className="h-5 w-5 text-gray-700" /> Home</Link></li>
                        <li><Link to='/dashboard'><LayoutDashboard className="w-5 h-5" /> Dashboard</Link></li>
                        <li><NavLink to='/dashboard/myParcels'><Package className="w-5 h-5" />
                        My Parcels</NavLink></li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default DashboardLayout;