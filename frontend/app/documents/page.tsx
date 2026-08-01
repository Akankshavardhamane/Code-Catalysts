'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Search, Filter } from 'lucide-react';

const docs = [
    { vendor: 'NovaTech Software Solutions', date: 'Jul 1, 2026', status: 'Matched', issues: 0 },
    { vendor: 'AlphaTech Cloud Services', date: 'Jul 3, 2026', status: 'Discrepancies Found', issues: 3 },
    { vendor: 'GreenLeaf Logistics', date: 'Jul 5, 2026', status: 'Pending Approval', issues: 1 },
    { vendor: 'Orbit Marketing Pvt Ltd', date: 'Jul 8, 2026', status: 'Matched', issues: 0 },
    { vendor: 'AlphaTech Cloud Services', date: 'Jun 20, 2026', status: 'Discrepancies Found', issues: 2 },
    { vendor: 'Zenith Facilities Mgmt', date: 'Jun 15, 2026', status: 'Matched', issues: 0 },
];

const STATUS_STYLES: Record<string, string> = {
    'Matched': 'bg-[rgba(34,197,94,0.1)] text-[#22C55E] border-[rgba(34,197,94,0.3)]',
    'Discrepancies Found': 'bg-[rgba(239,68,68,0.1)] text-[#EF4444] border-[rgba(239,68,68,0.3)]',
    'Pending Approval': 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]',
};

export default function DocumentsPage() {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('All');

    const filtered = useMemo(() =>
        docs.filter(d =>
            d.vendor.toLowerCase().includes(query.toLowerCase()) &&
            (filter === 'All' || d.status === filter)
        ), [query, filter]
    );

    return (
        <div className="flex h-screen bg-[#0B1020] overflow-hidden text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-y-auto p-10">

                    {/* Page Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Documents</h1>
                        <p className="text-[#94A3B8]">Previously processed contract &amp; invoice pairs</p>
                    </motion.div>

                    {/* Search + Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.05 }}
                        className="flex flex-col sm:flex-row gap-4 mb-8"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search vendor name…"
                                className="w-full bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-[16px] pl-10 pr-4 py-3 text-sm text-white placeholder-[#94A3B8] outline-none focus:border-[rgba(91,95,239,0.5)] focus:ring-2 focus:ring-[rgba(91,95,239,0.2)] transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <select
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                                className="appearance-none bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-[16px] pl-10 pr-8 py-3 text-sm text-white outline-none focus:border-[rgba(91,95,239,0.5)] transition-all cursor-pointer"
                            >
                                {['All', 'Matched', 'Discrepancies Found', 'Pending Approval'].map(s => (
                                    <option key={s} value={s} className="bg-[#1E293B]">{s}</option>
                                ))}
                            </select>
                        </div>
                    </motion.div>

                    {/* Table Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.1 }}
                        className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[#1E293B] overflow-hidden"
                    >
                        {/* Table header */}
                        <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                            {['Vendor', 'Upload Date', 'Status', 'Findings'].map(h => (
                                <span key={h} className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">{h}</span>
                            ))}
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                            {filtered.length === 0 ? (
                                <div className="py-16 text-center text-[#94A3B8]">No documents match your filters.</div>
                            ) : (
                                filtered.map((doc, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
                                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
                                        className={`grid grid-cols-4 gap-4 px-6 py-4 items-center transition-colors ${doc.status !== 'Matched' ? 'cursor-pointer' : ''}`}
                                    >
                                        <span className="text-white font-semibold text-sm truncate">{doc.vendor}</span>
                                        <span className="text-[#94A3B8] text-sm">{doc.date}</span>
                                        <span className={`inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLES[doc.status]}`}>
                                            {doc.status}
                                        </span>
                                        <span className={`text-sm font-semibold ${doc.issues > 0 ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`}>
                                            {doc.issues > 0 ? `${doc.issues} issue${doc.issues > 1 ? 's' : ''}` : '—'}
                                        </span>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
