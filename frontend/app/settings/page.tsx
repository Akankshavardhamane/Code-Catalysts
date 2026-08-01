'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { RefreshCw, CheckCircle2, Mail, CalendarCheck } from 'lucide-react';

const teamMembers = [
    { name: 'Abhay Sharma', email: 'abhay@vendorops.ai', role: 'Admin', color: 'from-[#5B5FEF] to-[#7C3AED]' },
    { name: 'Priya Kamath', email: 'priya@vendorops.ai', role: 'Auditor', color: 'from-[#7C3AED] to-[#00D4FF]' },
    { name: 'Rahul Mehta', email: 'rahul@vendorops.ai', role: 'Reviewer', color: 'from-[#00D4FF] to-[#22C55E]' },
];

function Toggle({ label, icon: Icon, init = false }: { label: string; icon: React.ElementType; init?: boolean }) {
    const [on, setOn] = useState(init);
    return (
        <div className="flex items-center justify-between py-4 border-b border-[rgba(255,255,255,0.05)] last:border-0">
            <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-sm font-medium text-white">{label}</span>
            </div>
            <motion.button
                onClick={() => setOn(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 outline-none ${on ? 'bg-[#5B5FEF]' : 'bg-[rgba(255,255,255,0.1)]'}`}
                whileTap={{ scale: 0.9 }}
            >
                <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
                    style={{ left: on ? '22px' : '2px' }}
                />
            </motion.button>
        </div>
    );
}

const cardClass = "rounded-[24px] bg-[#1E293B] border border-[rgba(255,255,255,0.08)] p-8";

export default function SettingsPage() {
    const [reconnecting, setReconnecting] = useState(false);

    const handleReconnect = () => {
        setReconnecting(true);
        setTimeout(() => setReconnecting(false), 1800);
    };

    return (
        <div className="flex h-screen bg-[#0B1020] overflow-hidden text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-y-auto p-10 space-y-8 max-w-4xl mx-auto w-full">

                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Settings</h1>
                        <p className="text-[#94A3B8]">Configure your VendorOps environment</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, type: 'spring', stiffness: 280, damping: 24 }}
                        className={cardClass}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">ERP Connection</h2>
                            <div className="flex items-center gap-2 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] px-3 py-1.5 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                                <span className="text-xs font-bold text-[#22C55E]">Connected to Mock ERP</span>
                            </div>
                        </div>

                        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-[16px] p-5 mb-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-1">Endpoint</p>
                                    <p className="text-white font-mono">erp.mock-systems.local</p>
                                </div>
                                <div>
                                    <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-1">Last Sync</p>
                                    <p className="text-white">Today, 2:41 PM</p>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            onClick={handleReconnect}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            disabled={reconnecting}
                            className={`flex items-center gap-2 px-6 py-3 rounded-[16px] font-semibold text-sm transition-all duration-300
                ${reconnecting
                                    ? 'bg-[rgba(255,255,255,0.05)] text-[#94A3B8] cursor-not-allowed border border-[rgba(255,255,255,0.08)]'
                                    : 'bg-[rgba(91,95,239,0.15)] text-[#5B5FEF] border border-[rgba(91,95,239,0.3)] hover:bg-[rgba(91,95,239,0.25)]'
                                }`}
                        >
                            <RefreshCw className={`w-4 h-4 ${reconnecting ? 'animate-spin' : ''}`} />
                            {reconnecting ? 'Reconnecting...' : 'Reconnect'}
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 280, damping: 24 }}
                        className={cardClass}
                    >
                        <h2 className="text-lg font-bold text-white mb-6">Notification Preferences</h2>
                        <div>
                            <Toggle label="Email me on high-risk findings" icon={Mail} init={true} />
                            <Toggle label="Weekly summary report" icon={CalendarCheck} init={false} />
                            <Toggle label="Notify on successful ERP sync" icon={CheckCircle2} init={true} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22, type: 'spring', stiffness: 280, damping: 24 }}
                        className={cardClass}
                    >
                        <h2 className="text-lg font-bold text-white mb-6">Team</h2>
                        <div className="space-y-3">
                            {teamMembers.map((m, idx) => (
                                <motion.div
                                    key={m.email}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 + idx * 0.07, type: 'spring', stiffness: 300, damping: 25 }}
                                    className="flex items-center gap-4 p-4 rounded-[16px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
                                >
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${m.color} flex items-center justify-center shrink-0`}>
                                        <span className="text-xs font-bold text-white">{m.name.split(' ').map(w => w[0]).join('')}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white text-sm">{m.name}</p>
                                        <p className="text-xs text-[#94A3B8] truncate">{m.email}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0
                    ${m.role === 'Admin'
                                            ? 'bg-[rgba(91,95,239,0.1)] text-[#5B5FEF] border border-[rgba(91,95,239,0.3)]'
                                            : m.role === 'Auditor'
                                                ? 'bg-[rgba(0,212,255,0.1)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]'
                                                : 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]'
                                        }`}
                                    >
                                        {m.role}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
