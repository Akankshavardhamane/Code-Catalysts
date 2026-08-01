'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SyncState = 'idle' | 'running' | 'completed';

export default function ApproveSyncButton({ syncState, onApprove }: { syncState: SyncState; onApprove: () => void }) {
    return (
        <section className="flex flex-col items-center justify-center gap-6 pt-4 pb-12">
            <AnimatePresence mode="wait">
                {syncState !== 'completed' ? (
                    <motion.button
                        key="button"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={onApprove}
                        disabled={syncState === 'running'}
                        whileHover={syncState !== 'running' ? { scale: 1.04, y: -3 } : {}}
                        whileTap={syncState !== 'running' ? { scale: 0.96 } : {}}
                        className={`relative flex items-center gap-3 px-10 py-4 rounded-[24px] font-bold text-lg overflow-hidden transition-all duration-300
              ${syncState === 'running'
                                ? 'bg-[rgba(91,95,239,0.3)] text-[rgba(255,255,255,0.5)] cursor-not-allowed border border-[rgba(91,95,239,0.3)]'
                                : 'bg-gradient-to-r from-[#5B5FEF] to-[#7C3AED] text-white shadow-[0_8px_32px_rgba(91,95,239,0.45)] hover:shadow-[0_12px_40px_rgba(91,95,239,0.65)]'
                            }`}
                    >
                        {/* Animated border glow */}
                        {syncState !== 'running' && (
                            <motion.div
                                className="absolute inset-0 rounded-[24px] bg-white/10"
                                animate={{ opacity: [0, 0.2, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-3">
                            {syncState === 'running' ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Syncing to ERP...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Approve &amp; Sync to ERP
                                </>
                            )}
                        </span>
                    </motion.button>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] px-8 py-5 rounded-[24px] flex items-center gap-5 shadow-[0_8px_32px_rgba(34,197,94,0.15)]"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
                            className="w-12 h-12 rounded-full bg-[rgba(34,197,94,0.2)] border border-[rgba(34,197,94,0.4)] flex items-center justify-center"
                        >
                            <svg className="w-6 h-6 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>
                        <div>
                            <h4 className="font-bold text-lg text-white">Synced to ERP ✓</h4>
                            <p className="text-xs text-[#22C55E] font-medium mt-0.5">
                                Approved on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
