import React, { useState } from 'react';
import { Circle, CreditCard, ShoppingBag, Coins, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const tabs = [
    { name: 'Circles', id: 'circles', icon: Circle },
    { name: 'Payments', id: 'payments', icon: CreditCard },
    { name: 'Products', id: 'products', icon: ShoppingBag },
    { name: 'Jars', id: 'jars', icon: Coins },
    { name: 'Help', id: 'help', icon: MessageCircle },
];

export const BottomNav: React.FC = () => {
    const [activeTab, setActiveTab] = useState('circles');

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50">
            <nav
                className="relative mx-auto max-w-2xl overflow-hidden"
                style={{
                    borderRadius: '60px',
                    border: '2px solid transparent',
                    backgroundImage: `background: #131A6080;
                                        background-blend-mode: overlay;`,
                    backgroundOrigin: 'padding-box, border-box',
                    backgroundClip: 'padding-box, border-box',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
            >
                <div className="relative flex justify-between items-center px-3 py-3">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="relative flex flex-col items-center justify-center flex-1 gap-2 py-3 px-4 transition-all duration-300"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabPill"
                                        className="absolute inset-0 bg-white/30 rounded-full"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        style={{
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)'
                                        }}
                                    />
                                )}

                                <div className="relative z-10 flex flex-col items-center gap-1.5">
                                    <Icon
                                        size={24}
                                        className={clsx(
                                            "transition-all duration-300",
                                            isActive ? "text-white" : "text-gray-300"
                                        )}
                                        strokeWidth={isActive ? 2 : 1.5}
                                    />
                                    <span className={clsx(
                                        "text-[11px] font-medium leading-none transition-all duration-300",
                                        isActive ? "text-white" : "text-gray-300"
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
