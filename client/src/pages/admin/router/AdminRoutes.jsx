import React from "react";
import { Outlet } from "react-router-dom";

import SidebarAdmin from "../components/Sidebar";

const AdminDashboard = () => {
    return (
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full md:w-1/4">
                    <SidebarAdmin />
                </div>

                {/* Nested Pages Render Here */}
                <div className="w-full md:w-3/4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
