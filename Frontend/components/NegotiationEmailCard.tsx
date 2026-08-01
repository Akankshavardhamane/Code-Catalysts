'use client';

import React from 'react';
import { motion } from 'framer-motion';

type Negotiation = {
    subject: string;
    body: string;
    suggested_actions?: string[];
};

export default function NegotiationEmailCard({ negotiation }: { negotiation?: Negotiation }) {
    if (!negotiation) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[14px] bg-[rgba(91,95,239,0.15)] border border-[rgba(91,95,239,0.3)] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#5B5FEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Draft Negotiation Email</h2>
                    <p className="text-sm text-[#94A3B8]">AI-generated for your review</p>
                </div>
            </div>

            <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[#1E293B] overflow-hidden hover:border-[rgba(91,95,239,0.3)] hover:shadow-[0_8px_32px_rgba(91,95,239,0.1)] transition-all duration-300">
                <div className="bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.08)] px-7 py-5 flex items-center justify-between">
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="text-[#94A3B8] w-16 font-medium">To:</span>
                            <span className="font-semibold text-white bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] px-3 py-1 rounded-full">billing@vendor.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[#94A3B8] w-16 font-medium">Subject:</span>
                            <span className="font-bold text-white">{negotiation.subject}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-[#0B1020] text-[#94A3B8] font-mono text-sm leading-relaxed relative whitespace-pre-wrap">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#5B5FEF] to-[#00D4FF] rounded-r-full" />
                    {negotiation.body}
                </div>

                {negotiation.suggested_actions && negotiation.suggested_actions.length > 0 && (
                    <div className="px-8 pb-8 bg-[#0B1020]">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#5B5FEF] mb-3">Suggested Actions</p>
                        <ul className="space-y-2">
                            {negotiation.suggested_actions.map((action, idx) => (
                                <li key={idx} className="text-sm text-[#94A3B8] flex items-start gap-2">
                                    <span className="text-[#5B5FEF] mt-1">•</span>
                                    <span>{action}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </motion.section>
    );
}