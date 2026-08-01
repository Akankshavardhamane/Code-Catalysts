'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart
} from 'recharts';

const stats = [
    { value: 'Rs. 4,82,000', label: 'Total overcharges prevented', sub: 'This quarter', color: '#22C55E' },
    { value: '23', label: 'Discrepancies caught', sub: 'Across all vendors', color: '#5B5FEF' },
    { value: '94%', label: 'Contracts audited on time', sub: 'Last 90 days', color: '#00D4FF' },
    { value: '2.1 hrs', label: 'Avg. time to resolve', sub: 'Per flagged issue', color: '#F59E0B' },
];

const monthly = [
    { month: 'Feb', discrepancies: 2 },
    { month: 'Mar', discrepancies: 4 },
    { month: 'Apr', discrepancies: 3 },
    { month: 'May', discrepancies: 7 },
    { month: 'Jun', discrepancies: 5 },
    { month: 'Jul', discrepancies: 9 },
];

export default function ReportsPage() {
    return (
        <div className="flex h-screen bg-[#0B1020] overflow-hidden text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-y-auto p-10 space-y-10">

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Reports</h1>
                        <p className="text-[#94A3B8]">Procurement audit analytics at a glance</p>
                    </motion.div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                        {stats.map((s, idx) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.07, type: 'spring', stiffness: 280, damping: 24 }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                className="rounded-[24px] bg-[#1E293B] border border-[rgba(255,255,255,0.08)] p-7 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300 group"
                            >
                                {/* Accent top bar */}
                                <div className="w-8 h-1 rounded-full mb-5" style={{ background: s.color }} />
                                <p className="text-4xl font-extrabold text-white tracking-tight mb-2" style={{ color: s.color }}>{s.value}</p>
                                <p className="text-sm font-semibold text-white">{s.label}</p>
                                <p className="text-xs text-[#94A3B8] mt-1">{s.sub}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Monthly Discrepancies Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 240, damping: 22 }}
                        className="rounded-[24px] bg-[#1E293B] border border-[rgba(255,255,255,0.08)] p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-lg font-bold text-white">Discrepancies Caught per Month</h2>
                                <p className="text-sm text-[#94A3B8] mt-1">Trending upward — AI getting more thorough</p>
                            </div>
                            <span className="text-xs font-bold bg-[rgba(91,95,239,0.1)] text-[#5B5FEF] border border-[rgba(91,95,239,0.3)] px-3 py-1.5 rounded-full">
                                Last 6 months
                            </span>
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={monthly}>
                                <defs>
                                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#5B5FEF" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#5B5FEF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ stroke: 'rgba(91,95,239,0.3)', strokeWidth: 1 }}
                                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="discrepancies"
                                    stroke="#5B5FEF"
                                    strokeWidth={3}
                                    fill="url(#areaGrad)"
                                    dot={{ fill: '#5B5FEF', r: 5, strokeWidth: 2, stroke: '#0B1020' }}
                                    activeDot={{ r: 7, fill: '#00D4FF' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
