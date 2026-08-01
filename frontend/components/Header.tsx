import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-[rgba(11,16,32,0.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] px-10 py-5 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div>
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <p className="text-sm text-[#94A3B8] font-medium">Autonomous Procurement Assistant</p>
      </div>
    </header>
  );
}
