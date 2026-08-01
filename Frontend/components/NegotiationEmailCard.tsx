'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function NegotiationEmailCard() {
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
                {/* Email Header */}
                <div className="bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.08)] px-7 py-5 flex items-center justify-between">
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="text-[#94A3B8] w-16 font-medium">To:</span>
                            <span className="font-semibold text-white bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] px-3 py-1 rounded-full">billing@vendor.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[#94A3B8] w-16 font-medium">Subject:</span>
                            <span className="font-bold text-white">Urgent: Discrepancies in Q1 Invoice vs Contract</span>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="hidden sm:flex p-2 text-[#94A3B8] hover:text-[#5B5FEF] hover:bg-[rgba(91,95,239,0.1)] rounded-[12px] transition-colors border border-transparent hover:border-[rgba(91,95,239,0.2)]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </motion.button>
                </div>

                {/* Email Body */}
                <div className="p-8 bg-[#0B1020] text-[#94A3B8] font-mono text-sm leading-relaxed relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#5B5FEF] to-[#00D4FF] rounded-r-full" />

                    <p className="text-white font-bold mb-4">Hi Vendor Team,</p>
                    <p className="mb-4">Our autonomous AI audit has detected several mismatches between your recent Q1 invoice and our active contract terms:</p>

                    <div className="bg-[rgba(255,255,255,0.03)] p-5 rounded-[16px] border border-[rgba(255,255,255,0.05)] mb-4">
                        <ul className="list-disc list-outside ml-4 space-y-3 text-[#5B5FEF]">
                            <li>The invoiced price per license is <span className="font-bold text-[#EF4444]">₹5,000</span>, but the contracted rate is <span className="font-bold text-[#22C55E]">₹4,500</span>.</li>
                            <li>The <span className="font-bold text-white">24hr support</span> SLA clause is missing from the invoice terms.</li>
                            <li>No <span className="font-bold text-white">30-day</span> price change notice was provided prior to this billing cycle.</li>
                        </ul>
                    </div>

                    <p className="mb-6">Could you please review and issue a corrected invoice reflecting the contracted terms?</p>

                    <div>
                        <p className="text-[#94A3B8]">Best regards,</p>
                        <p className="font-bold text-[#5B5FEF] mt-1">VendorOps AI Assistant</p>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
