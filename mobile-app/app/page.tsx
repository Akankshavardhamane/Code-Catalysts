'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Bell, CreditCard, ArrowUpRight, Activity, Zap, Sparkles, User, Settings, PieChart } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import PremiumButton from '@/components/ui/PremiumButton';

const AnimatedCounter = ({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(reverseNumber(value));

  function reverseNumber(num: number) {
    return Math.max(0, num - 500);
  }

  useEffect(() => {
    let start = reverseNumber(value);
    const end = value;
    if (start === end) return;

    let timer = setInterval(() => {
      start += Math.ceil((end - start) / 5);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

export default function MobileDashboard() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 50], [1, 0]);
  const y = useTransform(scrollY, [0, 50], [0, -20]);

  return (
    <div className="min-h-full pb-32">
      {/* Sticky Header with Parallax */}
      <motion.header
        style={{ opacity, y }}
        className="sticky top-0 z-40 px-6 pt-12 pb-4 bg-[--color-background]/80 backdrop-blur-2xl border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[--color-text-primary] flex items-center gap-2 font-sans">
            Home <Sparkles className="w-5 h-5 text-[--color-accent]" />
          </h1>
          <p className="text-[--color-text-secondary] text-sm font-medium">Good morning, Alex</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="w-12 h-12 rounded-[24px] bg-[--color-surface] border border-[rgba(255,255,255,0.08)] flex items-center justify-center relative shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-colors hover:bg-[--color-card]"
        >
          <Bell className="w-5 h-5 text-[--color-text-primary]" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[--color-primary] rounded-full border-2 border-[--color-background]" />
        </motion.button>
      </motion.header>

      <main className="px-6 pt-6 space-y-6 form-sans">

        {/* Main Balance Card */}
        <GlassCard delay={0.1} className="bg-gradient-to-br from-[--color-primary]/80 to-[--color-secondary]/80 border border-[rgba(255,255,255,0.15)] p-8 shadow-[0_16px_40px_rgba(91,95,239,0.3)] rounded-[24px]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-[24px] flex items-center justify-center backdrop-blur-md border border-white/10">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white/20 px-3 py-1.5 rounded-[24px] backdrop-blur-md flex items-center gap-1.5 cursor-pointer border border-white/10 hover:bg-white/30 transition-colors">
              <span className="text-xs font-semibold text-white">USD</span>
              <svg className="w-3 h-3 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          <div>
            <p className="text-white/80 font-medium mb-1">Total Balance</p>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              <AnimatedCounter value={12450} prefix="$" />
            </h2>
          </div>
        </GlassCard>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.2 }}>
            <PremiumButton variant="secondary" icon={<ArrowUpRight className="w-5 h-5 text-[--color-accent]" />}>
              Send
            </PremiumButton>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.25 }}>
            <PremiumButton variant="primary" icon={<Activity className="w-5 h-5 text-white" />}>
              Receive
            </PremiumButton>
          </motion.div>
        </div>

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="pt-6 flex items-center justify-between"
        >
          <h3 className="text-lg font-bold text-[--color-text-primary]">Analytics</h3>
          <button className="text-sm font-semibold text-[--color-primary] hover:text-[--color-accent] transition-colors rounded-[24px]">See all</button>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <GlassCard delay={0.35} interactive className="p-5 bg-[--color-surface] border border-[rgba(255,255,255,0.08)] hover:bg-[--color-card]">
            <Zap className="w-6 h-6 text-[--color-warning] mb-3" />
            <p className="text-[--color-text-secondary] text-xs font-medium mb-1">Weekly Spend</p>
            <p className="text-[--color-text-primary] font-bold text-xl"><AnimatedCounter value={1420} prefix="$" /></p>
          </GlassCard>
          <GlassCard delay={0.4} interactive className="p-5 bg-[--color-surface] border border-[rgba(255,255,255,0.08)] hover:bg-[--color-card]">
            <PieChart className="w-6 h-6 text-[--color-success] mb-3" />
            <p className="text-[--color-text-secondary] text-xs font-medium mb-1">Monthly Yield</p>
            <p className="text-[--color-text-primary] font-bold text-xl"><AnimatedCounter value={4.2} suffix="%" /></p>
          </GlassCard>
        </div>

        {/* Recent Transactions List */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="pt-6"
        >
          <h3 className="text-lg font-bold text-[--color-text-primary] mb-4">Activity</h3>
          <div className="space-y-3">
            {[
              { name: "Apple Store", amount: "-$999.00", time: "Today, 10:42 AM", icon: ArrowUpRight, color: "text-[--color-text-primary]", iconCol: "text-[--color-text-secondary]" },
              { name: "Stripe Payout", amount: "+$4,200.00", time: "Yesterday, 2:15 PM", icon: Activity, color: "text-[--color-success]", iconCol: "text-[--color-success]" },
              { name: "AWS Services", amount: "-$124.50", time: "Oct 24, 8:00 AM", icon: Settings, color: "text-[--color-text-primary]", iconCol: "text-[--color-text-secondary]" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <GlassCard key={i} delay={0.5 + (i * 0.1)} interactive className="!p-4 flex items-center gap-4 bg-[--color-surface] border border-[rgba(255,255,255,0.08)] hover:bg-[--color-card]">
                  <div className="w-12 h-12 rounded-[24px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${item.iconCol}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[--color-text-primary] font-semibold flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className={`font-bold ${item.color}`}>{item.amount}</span>
                    </h4>
                    <p className="text-[--color-text-secondary] text-xs mt-0.5 font-medium">{item.time}</p>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
