'use client';

import React from 'react';
import { motion } from 'framer-motion';

type Mismatch = {
    field: string;
    contract: string;
    invoice: string;
    severity: 'high' | 'medium';
};

const findings: Mismatch[] = [
    { field: "Price per license", contract: "₹4,500", invoice: "₹5,000", severity: "high" },
    { field: "SLA clause", contract: "24hr support", invoice: "Not mentioned", severity: "medium" },
    { field: "Price change notice", contract: "30 days required", invoice: "No notice given", severity: "high" },
];

export default function FindingsList() {
    if (findings.length === 0) {
        return (
            <section className="rounded-[24px] border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.05)] p-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)] flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Mismatches Found</h3>
                <p className="text-[#94A3B8]">Documents align perfectly with contract terms.</p>
            </section>
        );
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[14px] bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Audit Findings</h2>
                </div>
                <span className="text-sm font-bold text-[#EF4444] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] px-4 py-1.5 rounded-full">
                    {findings.length} Issues
                </span>
            </div>

            <div className="grid gap-4">
                {findings.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.12, type: 'spring', stiffness: 300, damping: 25 }}
                        whileHover={{ scale: 1.01, y: -2 }}
                        className="rounded-[24px] p-6 border border-[rgba(255,255,255,0.08)] bg-[#1E293B] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full border
                ${item.severity === 'high'
                                    ? 'bg-[rgba(239,68,68,0.1)] text-[#EF4444] border-[rgba(239,68,68,0.3)]'
                                    : 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]'
                                }`}
                            >
                                {item.severity.toUpperCase()}
                            </span>
                            <h3 className="font-semibold text-lg text-white">{item.field}</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-[rgba(34,197,94,0.07)] rounded-[16px] p-4 border border-[rgba(34,197,94,0.15)]">
                                <p className="text-[10px] text-[#22C55E] font-bold uppercase tracking-widest mb-2">Contract Value</p>
                                <p className="font-bold text-white text-lg">{item.contract}</p>
                            </div>
                            <div className="bg-[rgba(239,68,68,0.07)] rounded-[16px] p-4 border border-[rgba(239,68,68,0.15)]">
                                <p className="text-[10px] text-[#EF4444] font-bold uppercase tracking-widest mb-2">Invoice Value</p>
                                <p className="font-bold text-white text-lg">{item.invoice}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
