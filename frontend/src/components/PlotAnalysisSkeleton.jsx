import React from 'react';
import { motion } from 'framer-motion';

export default function PlotAnalysisSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 animate-pulse"
    >
      {/* Skeleton Header Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4 border border-cyan-500/20 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-slate-800/80 rounded-md" />
            <div className="h-3 w-64 bg-slate-800/50 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-7 w-28 bg-slate-800/80 rounded-full" />
          <div className="h-7 w-36 bg-cyan-500/20 border border-cyan-500/30 rounded-full" />
        </div>
      </div>

      {/* 3 Top Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Volumetric Soil Moisture (VSM %) score & gauge placeholder */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800 bg-slate-900/40 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="h-3 w-32 bg-slate-800 rounded" />
            <div className="h-5 w-16 bg-cyan-500/20 rounded-full" />
          </div>
          <div className="flex items-end justify-between pt-2">
            <div className="h-10 w-28 bg-slate-800 rounded-lg" />
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-500/40 animate-spin" />
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-slate-700 rounded-full" />
          </div>
        </div>

        {/* Card 2: Soil Moisture Deficit Index (SMDI) status badge placeholder */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800 bg-slate-900/40">
          <div className="flex justify-between items-center">
            <div className="h-3 w-36 bg-slate-800 rounded" />
            <div className="h-5 w-20 bg-rose-500/20 rounded-full" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-10 w-24 bg-slate-800 rounded-lg" />
            <div className="h-3 w-40 bg-slate-800/60 rounded" />
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full" />
        </div>

        {/* Card 3: Plot Risk Index (PRI) / Premium calculation placeholder */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800 bg-slate-900/40">
          <div className="flex justify-between items-center">
            <div className="h-3 w-40 bg-slate-800 rounded" />
            <div className="h-5 w-24 bg-emerald-500/20 rounded-full" />
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <div className="h-10 w-32 bg-slate-800 rounded-lg" />
            <div className="h-4 w-12 bg-slate-800 rounded" />
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full" />
        </div>
      </div>

      {/* Main Chart Area Simulation */}
      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-slate-800 bg-slate-900/40">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="space-y-2">
            <div className="h-4 w-64 bg-slate-800 rounded" />
            <div className="h-3 w-80 bg-slate-800/50 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-slate-800 rounded-lg" />
            <div className="h-6 w-16 bg-slate-800 rounded-lg" />
          </div>
        </div>

        {/* Chart Lines Simulation */}
        <div className="h-[280px] relative flex items-end justify-between gap-3 pt-8 px-4 border-b border-l border-slate-800">
          {[45, 65, 30, 85, 90, 55, 40, 75, 95, 60, 70, 80].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div 
                className="w-full bg-gradient-to-t from-slate-800/40 to-slate-700/60 rounded-t-sm transition-all" 
                style={{ height: `${h}%` }}
              />
              <div className="h-2 w-8 bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry Sub-Panel Skeleton */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800 bg-slate-900/40">
        <div className="h-4 w-52 bg-slate-800 rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map((row) => (
            <div key={row} className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/50">
              <div className="h-3 w-40 bg-slate-800 rounded" />
              <div className="h-4 w-24 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
