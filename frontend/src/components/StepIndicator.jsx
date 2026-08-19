import React from 'react';

export default function StepIndicator({ currentStep, onSelectStep }) {
  const steps = [
    { num: 1, label: 'Spatial Onboarding', icon: '📍' },
    { num: 2, label: 'Physics Inversion', icon: '📡' },
    { num: 3, label: 'Vulnerability Score', icon: '🛡️' },
    { num: 4, label: 'Actuarial Settlement', icon: '💵' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {steps.map(step => {
        const isActive = currentStep === step.num;
        const isCompleted = currentStep > step.num;

        return (
          <button
            key={step.num}
            onClick={() => onSelectStep(step.num)}
            className={`glass-panel p-4 rounded-2xl text-left transition-all relative overflow-hidden border ${
              isActive 
                ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/10' 
                : isCompleted 
                  ? 'border-emerald-500/40 bg-emerald-950/20' 
                  : 'border-white/5 opacity-60 hover:opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{step.icon}</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                isActive 
                  ? 'bg-cyan-500 text-black' 
                  : isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-white/10 text-gray-400'
              }`}>
                Step {step.num}
              </span>
            </div>
            <div className="text-xs font-bold text-white truncate">{step.label}</div>
          </button>
        );
      })}
    </div>
  );
}
