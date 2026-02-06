import React from 'react';
import { motion } from 'framer-motion';

interface TopBarProps {
    title?: string;
    leftAction?: React.ReactNode;
    rightAction?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ title = 'InvestBank', leftAction, rightAction }) => {
    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-gray-100 pt-[safe-top]"
        >
            <div className="flex items-center justify-between px-4 h-14">
                <div className="w-10">
                    {leftAction}
                </div>

                <h1 className="text-lg font-semibold tracking-tight text-gray-900">
                    {title}
                </h1>

                <div className="w-10 flex justify-end">
                    {rightAction}
                </div>
            </div>
        </motion.header>
    );
};
