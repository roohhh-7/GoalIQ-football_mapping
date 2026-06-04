"use client";
import { BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Compare() {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 h-screen flex flex-col">
      <header>
        <h1 className="text-3xl font-black text-text-main tracking-tight mb-2">Compare</h1>
        <p className="text-text-sec font-medium">Head-to-head analysis engine.</p>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 bg-surface border border-border-subtle rounded-2xl p-10 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mb-6 border border-border-subtle shadow-inner">
          <BarChart2 className="w-10 h-10 text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-text-main mb-2">Coming Soon</h2>
        <p className="text-text-sec max-w-md">
          The head-to-head comparison engine is currently in development. Soon you will be able to compare Player vs Player or Team vs Team metrics side-by-side.
        </p>
      </motion.div>
    </div>
  );
}
