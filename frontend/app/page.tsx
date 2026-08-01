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

const API_BASE_URL = 'https://code-catalysts.onrender.com';

export default function Dashboard() {
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [syncState, setSyncState] = useState<'idle' | 'running' | 'completed'>('idle');

  const [extractState, setExtractState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [auditState, setAuditState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [negotiationState, setNegotiationState] = useState<'idle' | 'running' | 'completed'>('idle');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleRunAnalysis = async (contractFile: File, invoiceFile: File) => {
    setPipelineState('running');
    setErrorMsg('');
    setExtractState('running');
    setAuditState('running');
    setNegotiationState('running');

    const formData = new FormData();
    formData.append('contract_file', contractFile);
    formData.append('invoice_file', invoiceFile);

    try {
      const response = await fetch(`${API_BASE_URL}/process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      setExtractState('completed');
      setAuditState('completed');
      setNegotiationState('completed');
      setPipelineState('completed');

      if (data.auto_approved) {
        setSyncState('completed');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Pipeline failed:', err);
      setErrorMsg(err.message || 'Something went wrong while processing the documents.');
      setPipelineState('error');
    }
  };

  const handleApproveSync = async () => {
    setSyncState('running');
    try {
      const response = await fetch(`${API_BASE_URL}/approve-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_name: results?.contract_data?.vendor_name || 'Unknown Vendor',
          action: 'audit_findings_approved',
          audit_result: results?.audit_result || {},
          status: 'approved',
        }),
      });
      const data = await response.json();
      console.log('Synced:', data);
      setSyncState('completed');
    } catch (err) {
      console.error('Sync failed:', err);
      setSyncState('idle');
    }
  };

  return (
    <div className="flex h-screen bg-[#0B1020] overflow-hidden text-white">
      <Sidebar />

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

          {pipelineState === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-[24px] border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] p-6 text-[#EF4444]"
            >
              <p className="font-semibold mb-1">Analysis failed</p>
              <p className="text-sm text-[#FCA5A5]">{errorMsg}</p>
              <p className="text-xs text-[#94A3B8] mt-2">Make sure the backend server is reachable.</p>
            </motion.div>
          )}

          <AnimatePresence>
            {pipelineState === 'completed' && results && (
              <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                className="space-y-10"
              >
                <FindingsList
                  mismatches={results.audit_result?.mismatches || []}
                  costImpact={results.audit_result?.estimated_cost_impact}
                />

                {results.auto_approved ? (
                  <div className="rounded-[24px] border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.05)] p-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)] flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">No Issues Found — Auto-Approved</h3>
                      <p className="text-sm text-[#94A3B8]">Documents matched contract terms. Automatically synced to ERP without requiring negotiation.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="border-t border-[rgba(255,255,255,0.08)] pt-10" />
                    <NegotiationEmailCard negotiation={results.negotiation} />
                    <div className="flex justify-end pt-6 mb-12">
                      <ApproveSyncButton syncState={syncState} onApprove={handleApproveSync} />
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}