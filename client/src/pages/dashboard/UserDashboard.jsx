import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const UserDashboard = () => {

    return (
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full md:w-1/4">
                    <Sidebar />
                </div>

                {/* Tab Content */}
                <div className="w-full md:w-3/4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
