'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type AgentState = 'idle' | 'running' | 'completed';

const agents = [
    { id: 'extraction', label: 'Extraction', desc: 'Parse documents', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { id: 'audit', label: 'Audit & Compare', desc: 'Find mismatches', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'negotiation', label: 'Negotiation', desc: 'Draft email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'sync', label: 'ERP Sync', desc: 'Awaiting approval', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
];

interface AgentStatusRowProps {
    extractState: AgentState;
    auditState: AgentState;
    negotiationState: AgentState;
    syncState: AgentState;
}

const stateMap: Record<string, AgentState> = {};

export default function AgentStatusRow({ extractState, auditState, negotiationState, syncState }: AgentStatusRowProps) {
    const states: Record<string, AgentState> = {
        extraction: extractState,
        audit: auditState,
        negotiation: negotiationState,
        sync: syncState,
    };

    return (
        <section className="rounded-[24px] p-6 border border-[rgba(255,255,255,0.08)] bg-[#1E293B] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <h3 className="text-sm font-bold text-[#94A3B8] uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5B5FEF] animate-pulse inline-block" />
                AI Agent Pipeline
            </h3>

            <div className="flex flex-wrap gap-4 items-center justify-between">
                {agents.map((agent, index) => {
                    const state = states[agent.id] || 'idle';
                    return (
                        <React.Fragment key={agent.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
                                className="flex items-center gap-3 flex-1 min-w-[180px]"
                            >
                                {/* Status Ring */}
                                <motion.div
                                    animate={state === 'running' ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                                    transition={{ repeat: state === 'running' ? Infinity : 0, duration: 1 }}
                                    className={`relative w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 border transition-all duration-500
                    ${state === 'idle' ? 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] text-[#94A3B8]' :
                                            state === 'running' ? 'bg-[rgba(91,95,239,0.15)] border-[rgba(91,95,239,0.4)] text-[#5B5FEF] shadow-[0_0_16px_rgba(91,95,239,0.3)]' :
                                                'bg-[rgba(34,197,94,0.15)] border-[rgba(34,197,94,0.4)] text-[#22C55E] shadow-[0_0_16px_rgba(34,197,94,0.2)]'
                                        }`}
                                >
                                    {state === 'idle' && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={agent.icon} />
                                        </svg>
                                    )}
                                    {state === 'running' && (
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    )}
                                    {state === 'completed' && (
                                        <motion.svg
                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                            className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </motion.svg>
                                    )}
                                </motion.div>

                                <div>
                                    <p className={`font-semibold text-sm transition-colors duration-300 ${state === 'idle' ? 'text-[#94A3B8]' : 'text-white'}`}>
                                        {agent.label}
                                    </p>
                                    <p className={`text-xs mt-0.5 font-medium transition-colors duration-300
                    ${state === 'idle' ? 'text-[rgba(148,163,184,0.4)]' :
                                            state === 'running' ? 'text-[#5B5FEF] animate-pulse' :
                                                'text-[#22C55E]'
                                        }`}>
                                        {state === 'idle' && 'Waiting'}
                                        {state === 'running' && 'Processing...'}
                                        {state === 'completed' && 'Complete ✓'}
                                    </p>
                                </div>
                            </motion.div>

                            {index < agents.length - 1 && (
                                <motion.div
                                    animate={{ opacity: state === 'completed' ? 1 : 0.3 }}
                                    className="hidden lg:block"
                                >
                                    <svg className="w-5 h-5 text-[rgba(255,255,255,0.2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </section>
    );
}
