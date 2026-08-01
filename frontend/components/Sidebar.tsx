'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, FileText, Users, BarChart2, Settings, Zap
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/vendors', label: 'Vendors', icon: Users },
    { href: '/reports', label: 'Reports', icon: BarChart2 },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 shrink-0 bg-[#111827] border-r border-[rgba(255,255,255,0.08)] flex flex-col pt-6 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
            {/* Brand */}
            <div className="px-6 mb-10 flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#5B5FEF] to-[#00D4FF] w-10 h-10 rounded-[12px] flex items-center justify-center shadow-[0_4px_16px_rgba(91,95,239,0.4)]">
                    <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                    VendorOps{' '}
                    <span className="bg-gradient-to-r from-[#5B5FEF] to-[#00D4FF] bg-clip-text text-transparent">AI</span>
                </h1>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link key={href} href={href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className={`relative flex items-center gap-3 px-4 py-3 rounded-[16px] font-medium cursor-pointer transition-colors duration-200
                  ${isActive
                                        ? 'bg-[rgba(91,95,239,0.15)] text-[#00D4FF] border border-[rgba(91,95,239,0.3)]'
                                        : 'text-[#94A3B8] hover:bg-white/5 hover:text-white border border-transparent'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 rounded-[16px] bg-[rgba(91,95,239,0.08)]"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon className="w-5 h-5 relative z-10 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                                <span className="relative z-10">{label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            <div className="p-4 border-t border-[rgba(255,255,255,0.08)] mb-4">
                <div className="flex items-center gap-3 p-3 rounded-[16px] bg-[#1E293B] border border-[rgba(255,255,255,0.06)] cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#5B5FEF] flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-white">AS</span>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">Abhay Sharma</p>
                        <p className="text-xs text-[#94A3B8] truncate">Procurement</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
