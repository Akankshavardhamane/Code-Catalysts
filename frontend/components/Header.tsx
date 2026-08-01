'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const pageInfo: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Autonomous Procurement Assistant' },
  '/dashboard': { title: 'Dashboard', subtitle: 'Autonomous Procurement Assistant' },
  '/documents': { title: 'Documents', subtitle: 'All processed contract and invoice pairs' },
  '/vendors': { title: 'Vendors', subtitle: 'Vendor relationships and risk overview' },
  '/reports': { title: 'Reports', subtitle: 'Procurement audit analytics at a glance' },
  '/settings': { title: 'Settings', subtitle: 'Configure your VendorOps environment' },
};

export default function Header() {
  const pathname = usePathname();
  const { title, subtitle } = pageInfo[pathname] || pageInfo['/'];

  return (
    <header className="sticky top-0 z-30 bg-[rgba(11,16,32,0.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] px-10 py-5 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-sm text-[#94A3B8] font-medium">{subtitle}</p>
      </div>
    </header>
  );
}
