'use client';

import { motion } from 'framer-motion';
import { Home, LineChart, Wallet, User } from 'lucide-react';
import React, { useState } from 'react';

const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'stats', icon: LineChart, label: 'Stats' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'profile', icon: User, label: 'Profile' },
];

export default function BottomNavigation() {
    const [active, setActive] = useState('home');

    return (
        <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
            <div className="pointer-events-auto max-w-sm mx-auto bg-[rgba(30,41,59,0.7)] backdrop-blur-[24px] rounded-[24px] px-6 py-4 flex items-center justify-between border border-[rgba(255,255,255,0.08)] relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className="relative p-2 flex flex-col items-center justify-center w-[48px] h-[48px] rounded-[24px] outline-none tap-highlight-transparent"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNavBubble"
                                    className="absolute inset-0 bg-[--color-primary] opacity-20 rounded-[24px]"
                                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                                />
                            )}
                            <motion.div
                                animate={{ scale: isActive ? 1.1 : 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="z-10"
                            >
                                <Icon
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-[--color-primary]' : 'text-[--color-text-secondary] hover:text-[--color-text-primary]'}`}
                                />
                            </motion.div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
