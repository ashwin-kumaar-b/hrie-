import React from 'react';

export default function Navbar({ onReset, onOpenBlueprint }) {
  return (
    <nav className="glass-panel sticky top-0 z-40 px-6 py-4 flex justify-between items-center border-b border-white/10 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-cyan-500/20">
          ⚡
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            HRIE <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">v2.9.0</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium">Hydro-Resilient Index Engine • Micro-Insurance Underwriting</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onReset}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
        >
          🔄 Clear Plot
        </button>

        <button 
          onClick={onOpenBlueprint}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 transition-all shadow-lg shadow-cyan-500/10"
        >
          📄 Technical Architecture
        </button>

        <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          GEE Inversion Core Active
        </div>
      </div>
    </nav>
  );
}
