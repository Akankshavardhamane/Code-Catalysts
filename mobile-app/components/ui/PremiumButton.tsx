'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { cn } from './GlassCard';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary';
    loading?: boolean;
}

export default function PremiumButton({ children, icon, variant = 'primary', loading = false, className, ...props }: PremiumButtonProps) {
    const [isRippling, setIsRippling] = useState(false);

    const handleTapStart = () => {
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 500);
    };

    const baseStyles = "relative w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-[24px] font-semibold text-lg overflow-hidden outline-none tap-highlight-transparent transition-shadow duration-300";

    const variants = {
        primary: "bg-gradient-to-r from-[--color-primary] to-[--color-accent] text-[--color-text-primary] shadow-[0_8px_24px_rgba(91,95,239,0.4)] hover:shadow-[0_12px_32px_rgba(91,95,239,0.6)]",
        secondary: "bg-white/5 text-[--color-text-primary] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:bg-white/10",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onTapStart={handleTapStart}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={cn(baseStyles, variants[variant], className)}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            {...props}
        >
            {/* Animated borders glow for primary */}
            {variant === 'primary' && (
                <motion.div
                    className="absolute inset-0 bg-white/20 blur-xl rounded-[24px] pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ opacity: 1, scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Ripple effect layer */}
            {isRippling && (
                <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-white/30 rounded-full pointer-events-none"
                />
            )}

            <span className="relative z-10 flex items-center space-x-2">
                {loading ? (
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : icon && (<span className="w-5 h-5 flex-shrink-0">{icon}</span>)}
                <span>{loading ? 'Processing...' : children}</span>
            </span>
        </motion.button>
    );
}
