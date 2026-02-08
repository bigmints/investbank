// Force rebuild: 2026-02-08 18:11
import React, { useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const tabs = [
    { name: 'Circles', id: 'circles', icon: `${import.meta.env.BASE_URL}assets/circle-icons.svg` },
    { name: 'Payments', id: 'payments', icon: `${import.meta.env.BASE_URL}assets/card-icon.svg` },
    { name: 'Products', id: 'products', icon: `${import.meta.env.BASE_URL}assets/products-icon.svg` },
    { name: 'Jars', id: 'jars', icon: `${import.meta.env.BASE_URL}assets/jars-icon.svg` },
    { name: 'Help', id: 'help', icon: `${import.meta.env.BASE_URL}assets/help-icon.svg` },
];

export const BottomNav: React.FC = () => {
    const [activeTab, setActiveTab] = useState('circles');

    return (
        <div className="fixed left-4 right-4 z-50" style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
            <nav
                className="relative mx-auto max-w-2xl overflow-hidden"
                style={{
                    borderRadius: '60px',
                    border: '2px solid transparent',
                    background: 'rgba(19, 26, 96, 0.50)',
                    backgroundOrigin: 'padding-box, border-box',
                    backgroundClip: 'padding-box, border-box',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
            >
                <div className="relative flex justify-between items-center px-3 py-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="relative flex flex-col items-center justify-center flex-1 gap-2 py-3 px-4 transition-all duration-300"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabPill"
                                        className="absolute inset-0 bg-white/50 rounded-full"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        style={{
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)'
                                        }}
                                    />
                                )}

                                <div className="relative z-10 flex flex-col items-center gap-1.5">
                                    <img
                                        src={tab.icon}
                                        alt={tab.name}
                                        className={clsx(
                                            "w-6 h-6 transition-all duration-300",
                                            isActive ? "opacity-100 scale-110" : "opacity-60 grayscale brightness-200"
                                        )}
                                        style={{
                                            filter: isActive
                                                ? 'brightness(0) invert(1)'
                                                : 'brightness(0) invert(0.8)'
                                        }}
                                    />
                                    <span className={clsx(
                                        "text-[10px] font-medium leading-none transition-all duration-300",
                                        isActive ? "text-white opacity-100" : "text-white/60"
                                    )}>
                                        {tab.name}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};
