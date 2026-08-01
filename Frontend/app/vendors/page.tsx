'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const vendors = [
    { name: 'NovaTech Software Solutions', contractValue: 'Rs. 2,25,000/month', discrepancies: 0, lastAudit: 'Jul 1, 2026', risk: 'Low risk' },
    { name: 'AlphaTech Cloud Services', contractValue: 'Rs. 1,68,000/month', discrepancies: 5, lastAudit: 'Jul 3, 2026', risk: 'High risk' },
    { name: 'GreenLeaf Logistics', contractValue: 'Rs. 85,000/month', discrepancies: 1, lastAudit: 'Jul 5, 2026', risk: 'Medium risk' },
    { name: 'Orbit Marketing Pvt Ltd', contractValue: 'Rs. 1,10,000/month', discrepancies: 0, lastAudit: 'Jul 8, 2026', risk: 'Low risk' },
];

const RISK_STYLES: Record<string, string> = {
    'Low risk': 'bg-[rgba(34,197,94,0.1)] text-[#22C55E] border-[rgba(34,197,94,0.3)]',
    'Medium risk': 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]',
    'High risk': 'bg-[rgba(239,68,68,0.1)] text-[#EF4444] border-[rgba(239,68,68,0.3)]',
};

const chartData = vendors.map(v => ({ name: v.name.split(' ')[0], discrepancies: v.discrepancies }));

export default function VendorsPage() {
    return (
        <div className="flex h-screen bg-[#0B1020] overflow-hidden text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-y-auto p-10 space-y-10">

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Vendors</h1>
                        <p className="text-[#94A3B8]">Manage and monitor your vendor relationships</p>
                    </motion.div>

                    {/* Vendor Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {vendors.map((v, idx) => (
                            <motion.div
                                key={v.name}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08, type: 'spring', stiffness: 280, damping: 24 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                className="rounded-[24px] bg-[#1E293B] border border-[rgba(255,255,255,0.08)] p-7 hover:border-[rgba(91,95,239,0.3)] hover:shadow-[0_8px_32px_rgba(91,95,239,0.1)] transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <h3 className="font-bold text-white text-lg leading-tight mb-1">{v.name}</h3>
                                        <p className="text-2xl font-extrabold text-white mt-2">{v.contractValue}</p>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border shrink-0 ml-3 ${RISK_STYLES[v.risk]}`}>
                                        {v.risk}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Discrepancies Caught</p>
                                        <p className={`font-bold text-lg ${v.discrepancies > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                                            {v.discrepancies} caught
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Last Audit</p>
                                        <p className="font-semibold text-white">{v.lastAudit}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, type: 'spring', stiffness: 240, damping: 22 }}
                        className="rounded-[24px] bg-[#1E293B] border border-[rgba(255,255,255,0.08)] p-8"
                    >
                        <h2 className="text-lg font-bold text-white mb-6">Discrepancies Caught per Vendor</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={chartData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(91,95,239,0.08)' }}
                                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff' }}
                                />
                                <Bar dataKey="discrepancies" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                                <defs>
                                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#5B5FEF" />
                                        <stop offset="100%" stopColor="#00D4FF" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
