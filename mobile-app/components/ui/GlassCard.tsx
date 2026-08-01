'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    interactive?: boolean;
}

export default function GlassCard({ children, className, delay = 0, interactive = false }: GlassCardProps) {
    const Component = interactive ? motion.button : motion.div;

    return (
        <Component
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: delay,
            }}
            whileHover={interactive ? { scale: 1.03, y: -4, boxShadow: '0 20px 40px -10px rgba(91,95,239,0.15)' } : undefined}
            whileTap={interactive ? { scale: 0.97 } : undefined}
            className={cn(
                "glass-panel relative overflow-hidden group",
                interactive && "cursor-pointer w-full text-left outline-none",
                className
            )}
        >
            {/* Animated Glow layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* 1px Gradient Border Overlay mimicking lighting */}
            <div className="absolute inset-0 rounded-[24px] border border-white/5 opacity-50 pointer-events-none z-20" style={{ mixBlendMode: 'overlay' }} />

            <div className="relative z-10">
                {children}
            </div>
        </Component>
    );
}
