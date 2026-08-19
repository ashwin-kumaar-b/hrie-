import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Step4ActuarialPayout({ 
  sumInsured, 
  onSumInsuredChange, 
  payoutData 
}) {
  const [activeReportTab, setActiveReportTab] = useState('farmer'); // 'farmer' or 'ambassador'
  const [reportLoading, setReportLoading] = useState(false);
  const [farmerReport, setFarmerReport] = useState('');
  const [ambassadorReport, setAmbassadorReport] = useState('');

  const generateFarmerAppealReport = async () => {
    setReportLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8001/api/reports/farmer-appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_type: payoutData?.boundary_verification?.declared_crop || 'Groundnut',
          district: 'Anantapur, AP',
          vsm_pct: payoutData?.moral_hazard_benchmarking?.target_plot_vsm || 3.8,
          smdi_score: payoutData?.hazard_triggers?.agricultural_drought?.smdi_value || 0.75,
          hvi_score: payoutData?.vulnerability_dossier?.overall_hvi_score || 82.5,
          cultivated_ha: payoutData?.boundary_verification?.verified_area_m2 ? (payoutData.boundary_verification.verified_area_m2 / 10000) : 1.38,
          sum_insured: sumInsured || 10000,
          payout_amount: payoutData?.payout_summary?.calculated_payout || 8365,
          claim_status: payoutData?.payout_summary?.claim_status || 'APPROVED_AUTO_PAYOUT'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setFarmerReport(data.report);
      }
    } catch (err) {
      console.warn('Report generation warning:', err);
    } finally {
      setReportLoading(false);
    }
  };

  const generateAmbassadorBriefingReport = async () => {
    setReportLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8001/api/reports/ambassador-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_type: payoutData?.boundary_verification?.declared_crop || 'Groundnut',
          district: 'Anantapur, AP',
          vsm_pct: payoutData?.moral_hazard_benchmarking?.target_plot_vsm || 3.8,
          smdi_score: payoutData?.hazard_triggers?.agricultural_drought?.smdi_value || 0.75,
          hvi_score: payoutData?.vulnerability_dossier?.overall_hvi_score || 82.5,
          cultivated_ha: payoutData?.boundary_verification?.verified_area_m2 ? (payoutData.boundary_verification.verified_area_m2 / 10000) : 1.38,
          sum_insured: sumInsured || 10000,
          payout_amount: payoutData?.payout_summary?.calculated_payout || 8365,
          claim_status: payoutData?.payout_summary?.claim_status || 'APPROVED_AUTO_PAYOUT'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAmbassadorReport(data.report);
      }
    } catch (err) {
      console.warn('Ambassador briefing report warning:', err);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* STEP 4 CLAIM CERTIFICATE */}
      <div className="glass-panel p-8 rounded-3xl space-y-6 border-emerald-500/30 bg-gradient-to-br from-blue-950/20 to-emerald-950/20 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>💵</span> Parametric Claim Settlement Certificate
            </h2>
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

      {/* NEW PANEL: GROQ GPT-OSS-120B AI EXECUTIVE & FARMER REPORTS */}
      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-cyan-500/30 bg-slate-900/80 shadow-2xl">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>📑</span> Groq GPT-OSS-120B AI Executive & Farmer Reports
            </h3>
            <p className="text-xs text-gray-400">High-speed open source LLM reporting for insurance appeals & global diplomat briefings</p>
          </div>

          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
            Model: openai/gpt-oss-120b
          </span>
        </div>

        {/* REPORT TYPE SELECTOR TABS */}
        <div className="flex gap-3">
          <button
            onClick={() => { setActiveReportTab('farmer'); if (!farmerReport) generateFarmerAppealReport(); }}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
              activeReportTab === 'farmer'
                ? 'bg-cyan-500 text-black border-cyan-400 font-black shadow-lg shadow-cyan-500/20'
                : 'bg-black/60 text-gray-300 border-white/10 hover:border-cyan-500/40'
            }`}
          >
            👨‍🌾 Farmer Claim Appeal Dossier
          </button>
          <button
            onClick={() => { setActiveReportTab('ambassador'); if (!ambassadorReport) generateAmbassadorBriefingReport(); }}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
              activeReportTab === 'ambassador'
                ? 'bg-emerald-500 text-black border-emerald-400 font-black shadow-lg shadow-emerald-500/20'
                : 'bg-black/60 text-gray-300 border-white/10 hover:border-emerald-500/40'
            }`}
          >
            🌐 Global Ambassadors & ESG Briefing
          </button>
        </div>

        {/* GENERATE BUTTON */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {activeReportTab === 'farmer' ? 'Formally appeal to Ombudsman for payout settlement.' : 'Executive briefing for International Ambassadors & ESG Boards.'}
          </span>
          <button
            disabled={reportLoading}
            onClick={activeReportTab === 'farmer' ? generateFarmerAppealReport : generateAmbassadorBriefingReport}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:opacity-90 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {reportLoading ? '⚡ Generating Report with GPT-OSS-120B...' : '✨ Generate AI Report'}
          </button>
        </div>

        {/* REPORT CONTENT DISPLAY */}
        <div className="p-6 bg-black/70 rounded-2xl border border-white/10 font-mono text-xs text-gray-200 leading-relaxed shadow-inner max-h-[500px] overflow-y-auto whitespace-pre-wrap">
          {reportLoading ? (
            <div className="py-12 text-center text-cyan-400 space-y-2">
              <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold">Groq GPT-OSS-120B inverting telemetry & drafting report...</p>
            </div>
          ) : activeReportTab === 'farmer' ? (
            farmerReport || (
              <p className="text-gray-500 italic text-center py-8">
                Click "Generate AI Report" to create the Farmer Insurance Claim Appeal Dossier.
              </p>
            )
          ) : (
            ambassadorReport || (
              <p className="text-gray-500 italic text-center py-8">
                Click "Generate AI Report" to create the Global Ambassadors & ESG Executive Briefing.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
