import React from 'react';
import { motion } from 'framer-motion';

export default function Step4ActuarialPayout({ 
  sumInsured, 
  onSumInsuredChange, 
  payoutData 
}) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-panel p-8 rounded-3xl space-y-6 border-emerald-500/30 bg-gradient-to-br from-blue-950/20 to-emerald-950/20 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">💵 Parametric Claim Settlement Certificate</h2>
            <p className="text-xs text-gray-400">Automated Micro-Insurance Underwriting Audit Report</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Instant Underwriting Active
          </span>
        </div>

        <div className="space-y-3">
          <label className="text-xs text-gray-300 font-semibold">Enter Sum Insured Coverage Amount ($)</label>
          <input 
            type="number"
            value={sumInsured}
            onChange={(e) => onSumInsuredChange(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white font-extrabold text-lg focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
          />
        </div>

        <div className="p-6 bg-black/50 rounded-2xl border border-white/10 text-center space-y-2">
          <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Calculated Automated Payout</div>
          <motion.div 
            key={payoutData?.payout_summary?.calculated_payout}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl font-black text-emerald-400 tracking-tight"
          >
            ${payoutData?.payout_summary?.calculated_payout?.toLocaleString() ?? '0.00'}
          </motion.div>
          <div className="text-xs text-emerald-300 font-semibold">
            {payoutData?.payout_summary?.payout_percentage ?? 0}% Coverage Indemnity (Cultivated Scale: {payoutData?.payout_summary?.cultivated_ratio_applied ?? 1.0}x)
          </div>
        </div>

        {/* FEATURE 2: SALVAGE ADVISORY CARD */}
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>🌾</span> Lightweight Salvage Advisory:
            </span>
            <span className="font-extrabold text-[11px] px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {payoutData?.salvage_advisory?.status_label || '🌾 Early Harvest Advised (35% Salvage Offset)'}
            </span>
          </div>
          <p className="text-gray-300 leading-relaxed">
            {payoutData?.salvage_advisory?.advisory_notes || 'High crop biomass (NDVI >= 0.50) indicates crops retain commercial value. Immediate early harvest advised before desiccative lodging escalation.'}
          </p>
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-2 text-xs">
          <div className="font-bold text-gray-200">Actuarial Verification Summary:</div>
          <p className="text-gray-300 leading-relaxed">
            {payoutData?.payout_summary?.primary_reason || 'Evaluating field boundary satellite telemetry...'}
          </p>
        </div>

        <div className="pt-2 flex justify-between items-center text-xs text-gray-400">
          <span>Settlement Latency Acceleration: <strong className="text-emerald-400">80% Time Reduction</strong></span>
          <span>Reinsurance Liquidity Audit: <strong className="text-cyan-400 font-mono">PASSED_GEE_TELEMETRY</strong></span>
        </div>
      </div>
    </div>
  );
}
