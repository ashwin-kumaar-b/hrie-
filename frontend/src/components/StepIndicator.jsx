import React from 'react';

export default function StepIndicator({ currentStep, onSelectStep }) {
  const steps = [
    { num: 1, title: 'Spatial Onboarding', subtitle: 'Plot Boundary Drawing', icon: '📍' },
    { num: 2, title: 'Physics Inversion', subtitle: 'WCM + MDM Soil Moisture', icon: '📡' },
    { num: 3, title: 'Vulnerability Score', subtitle: 'Hydro-Vulnerability Index', icon: '🛡️' },
    { num: 4, title: 'Actuarial Settlement', subtitle: 'Parametric Claim Certificate', icon: '💵' }
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-8 shadow-2xl relative overflow-hidden">
      {/* Background Accent Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 opacity-60" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;

          return (
            <button
              key={step.num}
              onClick={() => onSelectStep(step.num)}
              className={`flex items-center gap-3 p-3.5 rounded-xl text-left transition-all relative ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-2 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-[1.02]' 
                  : isCompleted 
                    ? 'bg-emerald-950/30 border border-emerald-500/40 text-gray-200 hover:bg-emerald-900/20' 
                    : 'bg-slate-950/40 border border-white/5 text-gray-400 hover:bg-slate-800/40 hover:text-gray-200'
              }`}
            >
              {/* Step Circle Indicator */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${
                isActive 
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/40 ring-4 ring-cyan-500/20' 
                  : isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-white/5 text-gray-500 border border-white/10'
              }`}>
                {isCompleted ? '✓' : step.icon}
              </div>

              {/* Step Label Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className={`text-[10px] font-extrabold tracking-wider uppercase ${
                    isActive ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-gray-500'
                  }`}>
                    Step {step.num}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
                <div className="text-xs font-bold text-white truncate">{step.title}</div>
                <div className="text-[10px] text-gray-400 truncate">{step.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
