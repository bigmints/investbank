import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
    return (
        <div className="flex flex-col h-[100dvh] w-full bg-bg-app text-gray-900">
            {/* Main Content Area - Scrollable */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden pt-[safe-top] no-scrollbar">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
