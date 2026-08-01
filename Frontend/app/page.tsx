'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UploadSection from '@/components/UploadSection';
import AgentStatusRow from '@/components/AgentStatusRow';
import FindingsList from '@/components/FindingsList';
import NegotiationEmailCard from '@/components/NegotiationEmailCard';
import ApproveSyncButton from '@/components/ApproveSyncButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [syncState, setSyncState] = useState<'idle' | 'running' | 'completed'>('idle');

  const [extractState, setExtractState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [auditState, setAuditState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [negotiationState, setNegotiationState] = useState<'idle' | 'running' | 'completed'>('idle');

  const handleRunAnalysis = () => {
    setPipelineState('running');
    setExtractState('running');
    const sequence = [
      { id: 'extraction', delay: 800 },
      { id: 'audit', delay: 1600 },
      { id: 'negotiation', delay: 2400 },
    ];
    sequence.forEach((step) => {
      setTimeout(() => {
        if (step.id === 'extraction') { setExtractState('completed'); setAuditState('running'); }
        else if (step.id === 'audit') { setAuditState('completed'); setNegotiationState('running'); }
        else if (step.id === 'negotiation') { setNegotiationState('completed'); setPipelineState('completed'); }
      }, step.delay);
    });
  };

  const handleApproveSync = () => {
    setSyncState('running');
    setTimeout(() => setSyncState('completed'), 1500);
  };

  return (
    <div className="flex h-screen bg-[#0B1020] overflow-hidden text-white">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        <Header />

        <div className="p-10 max-w-5xl mx-auto w-full space-y-10 flex-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
            <UploadSection onRunAnalysis={handleRunAnalysis} isRunning={pipelineState === 'running'} />
          </motion.div>

          <AnimatePresence>
            {pipelineState !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <AgentStatusRow
                  extractState={extractState}
                  auditState={auditState}
                  negotiationState={negotiationState}
                  syncState={syncState}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {pipelineState === 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                className="space-y-10"
              >
                <FindingsList />
                <div className="border-t border-[rgba(255,255,255,0.08)] pt-10" />
                <NegotiationEmailCard />
                <div className="flex justify-end pt-6 mb-12">
                  <ApproveSyncButton syncState={syncState} onApprove={handleApproveSync} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
