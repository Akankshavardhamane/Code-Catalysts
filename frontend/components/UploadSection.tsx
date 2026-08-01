'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadSection({
    onRunAnalysis,
    isRunning,
}: {
    onRunAnalysis: (contractFile: File, invoiceFile: File) => void;
    isRunning: boolean;
}) {
    const [contractFile, setContractFile] = useState<File | null>(null);
    const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
    const [ripple, setRipple] = useState<{ id: string; x: number; y: number } | null>(null);

    const contractInputRef = useRef<HTMLInputElement>(null);
    const invoiceInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (type: 'contract' | 'invoice', file: File | undefined) => {
        if (!file) return;
        if (type === 'contract') setContractFile(file);
        if (type === 'invoice') setInvoiceFile(file);
    };

    const canRun = !!contractFile && !!invoiceFile && !isRunning;

    const handleRunClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!canRun || !contractFile || !invoiceFile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setRipple({ id: Date.now().toString(), x: e.clientX - rect.left, y: e.clientY - rect.top });
        setTimeout(() => setRipple(null), 600);
        onRunAnalysis(contractFile, invoiceFile);
    };

    return (
        <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#5B5FEF] to-[#00D4FF] flex items-center justify-center shadow-[0_4px_16px_rgba(91,95,239,0.4)]">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Upload Documents</h2>
                    <p className="text-sm text-[#94A3B8]">Contract &amp; Invoice for analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {/* Contract File */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    onClick={() => contractInputRef.current?.click()}
                    className={`relative rounded-[24px] p-8 flex flex-col items-center justify-center cursor-pointer border overflow-hidden group
            ${contractFile
                            ? 'bg-[rgba(91,95,239,0.1)] border-[rgba(91,95,239,0.4)] shadow-[0_0_24px_rgba(91,95,239,0.15)]'
                            : 'bg-[#1E293B] border-[rgba(255,255,255,0.08)] hover:border-[rgba(91,95,239,0.4)] hover:bg-[rgba(91,95,239,0.05)]'
                        } transition-all duration-300`}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        ref={contractInputRef}
                        className="hidden"
                        onChange={(e) => handleFileSelect('contract', e.target.files?.[0])}
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-[#5B5FEF]/10 via-transparent to-[#00D4FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[24px]" />

                    <motion.div
                        animate={{ scale: contractFile ? 1.1 : 1 }}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border transition-all duration-300
              ${contractFile ? 'bg-[rgba(91,95,239,0.2)] border-[rgba(91,95,239,0.4)]' : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.08)]'}`}
                    >
                        <svg className={`w-7 h-7 ${contractFile ? 'text-[#5B5FEF]' : 'text-[#94A3B8]'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </motion.div>

                    <h3 className="font-semibold text-white mb-1">Contract PDF</h3>
                    <AnimatePresence mode="wait">
                        {contractFile ? (
                            <motion.span
                                key="file"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs font-medium text-[#00D4FF] bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] px-3 py-1 rounded-full mt-1"
                            >
                                ✓ {contractFile.name}
                            </motion.span>
                        ) : (
                            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#94A3B8] mt-1">Click or drop file</motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Invoice File */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    onClick={() => invoiceInputRef.current?.click()}
                    className={`relative rounded-[24px] p-8 flex flex-col items-center justify-center cursor-pointer border overflow-hidden group
            ${invoiceFile
                            ? 'bg-[rgba(91,95,239,0.1)] border-[rgba(91,95,239,0.4)] shadow-[0_0_24px_rgba(91,95,239,0.15)]'
                            : 'bg-[#1E293B] border-[rgba(255,255,255,0.08)] hover:border-[rgba(91,95,239,0.4)] hover:bg-[rgba(91,95,239,0.05)]'
                        } transition-all duration-300`}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        ref={invoiceInputRef}
                        className="hidden"
                        onChange={(e) => handleFileSelect('invoice', e.target.files?.[0])}
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-[#5B5FEF]/10 via-transparent to-[#00D4FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[24px]" />

                    <motion.div
                        animate={{ scale: invoiceFile ? 1.1 : 1 }}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border transition-all duration-300
              ${invoiceFile ? 'bg-[rgba(91,95,239,0.2)] border-[rgba(91,95,239,0.4)]' : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.08)]'}`}
                    >
                        <svg className={`w-7 h-7 ${invoiceFile ? 'text-[#5B5FEF]' : 'text-[#94A3B8]'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </motion.div>

                    <h3 className="font-semibold text-white mb-1">Vendor Invoice</h3>
                    <AnimatePresence mode="wait">
                        {invoiceFile ? (
                            <motion.span
                                key="file"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs font-medium text-[#00D4FF] bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] px-3 py-1 rounded-full mt-1"
                            >
                                ✓ {invoiceFile.name}
                            </motion.span>
                        ) : (
                            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#94A3B8] mt-1">Click or drop file</motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Run Button */}
            <div className="flex justify-center">
                <motion.button
                    onClick={handleRunClick}
                    disabled={!canRun}
                    whileHover={canRun ? { scale: 1.04, y: -2 } : {}}
                    whileTap={canRun ? { scale: 0.96 } : {}}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`relative flex items-center gap-3 px-12 py-4 rounded-[24px] font-bold text-lg overflow-hidden transition-all duration-300
            ${canRun
                            ? 'bg-gradient-to-r from-[#5B5FEF] to-[#00D4FF] text-white shadow-[0_8px_32px_rgba(91,95,239,0.5)] hover:shadow-[0_12px_40px_rgba(91,95,239,0.7)]'
                            : 'bg-[#1E293B] text-[#94A3B8] border border-[rgba(255,255,255,0.08)] cursor-not-allowed'
                        }`}
                >
                    {canRun && (
                        <motion.div
                            className="absolute inset-0 bg-white/10 rounded-[24px]"
                            animate={{ opacity: [0, 0.3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    )}

                    <AnimatePresence>
                        {ripple && (
                            <motion.span
                                key={ripple.id}
                                initial={{ scale: 0, opacity: 0.5 }}
                                animate={{ scale: 8, opacity: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="absolute bg-white/30 rounded-full pointer-events-none"
                                style={{ width: 40, height: 40, left: ripple.x - 20, top: ripple.y - 20 }}
                            />
                        )}
                    </AnimatePresence>

                    <span className="relative z-10 flex items-center gap-3">
                        {isRunning ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Analyzing Documents...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Run AI Analysis
                            </>
                        )}
                    </span>
                </motion.button>
            </div>

            {!contractFile || !invoiceFile ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-[#94A3B8] mt-4">
                    Upload both documents above to enable analysis
                </motion.p>
            ) : null}
        </section>
    );
}