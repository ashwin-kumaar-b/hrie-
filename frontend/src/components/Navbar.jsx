import React from 'react';

export default function Navbar({ onOpenBlueprint, activeView, onViewChange, userSession, onLogout }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        {/* LOGO & BRAND */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-indigo-600 flex items-center justify-center text-xl font-black shadow-lg shadow-cyan-500/20 text-black">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white font-mono">HRIE</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                v2.9.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Hydro-Resilient Index Engine • Micro-Insurance Underwriting</p>
          </div>
        </div>

        {/* ROLE SWITCHER & ACTIONS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* DASHBOARD MODE TOGGLE */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-2xl border border-white/10 text-xs font-bold shadow-inner">
            <button
              onClick={() => onViewChange('farmer')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'farmer'
                  ? 'bg-cyan-500 text-black font-extrabold shadow-md shadow-cyan-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              👨‍🌾 Farmer Console
            </button>
            <button
              onClick={() => onViewChange('insurer')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'insurer'
                  ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🏢 Insurer Suite
            </button>
          </div>

          <button
            onClick={onOpenBlueprint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-slate-200 border border-white/15 hover:border-cyan-400 hover:text-cyan-300 transition-all shadow-md cursor-pointer"
          >
            <span>📄</span>
            <span>Technical Architecture</span>
          </button>

          {/* USER SESSION BADGE & LOGOUT */}
          {userSession ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <span className="text-xs font-bold text-gray-300 hidden sm:inline">
                {userSession.name || 'User'}
              </span>
              <button
                onClick={onLogout}
                title="Sign Out or Switch Account"
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-cyan-500 text-black hover:bg-cyan-400 transition-all shadow-md cursor-pointer"
            >
              🔐 Auth Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
