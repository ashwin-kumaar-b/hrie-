import React, { useState, useEffect } from 'react';
import { fetchAllFarmerPlots, updatePlotClaimStatus } from '../lib/supabase';

export default function InsurerDashboard({ userSession }) {
  const [plots, setPlots] = useState([]);
  const [filterTier, setFilterTier] = useState('ALL');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);

  useEffect(() => {
    loadPlots();
  }, []);

  const loadPlots = async () => {
    const data = await fetchAllFarmerPlots();
    setPlots(data);
  };

  const handleStatusChange = async (plotId, newStatus, payoutAmount = 0) => {
    setIsUpdating(true);
    await updatePlotClaimStatus(plotId, newStatus, payoutAmount);
    setPlots(prev => prev.map(p => {
      if (p.id === plotId) {
        return { ...p, claim_status: newStatus, payout_amount: payoutAmount };
      }
      return p;
    }));
    setIsUpdating(false);
  };

  const filteredPlots = plots.filter(p => {
    if (filterTier === 'ALL') return true;
    if (filterTier === 'CRITICAL') return p.risk_tier === 'CRITICAL_HYDRO_HAZARD';
    if (filterTier === 'FRAUD') return p.fraud_flag === true;
    if (filterTier === 'APPROVED') return p.claim_status === 'APPROVED_AUTO_PAYOUT';
    return true;
  });

  const totalSumInsured = plots.reduce((acc, p) => acc + (p.sum_insured || 0), 0);
  const totalPayouts = plots.reduce((acc, p) => acc + (p.payout_amount || 0), 0);
  const totalCultivatedHa = plots.reduce((acc, p) => acc + (p.verified_cultivated_ha || p.area_hectares || 0), 0);
  const fraudCount = plots.filter(p => p.fraud_flag).length;

  return (
    <div className="space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-wrap justify-between items-center p-6 glass-panel rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Insurer Actuarial Underwriting Portfolio Suite
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time Supabase cloud sync & multi-plot GEE satellite physical risk underwriting
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Supabase Live Connected
          </span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-black/60 text-gray-300 border border-white/10">
            {userSession?.name || 'Underwriter Admin'}
          </span>
        </div>
      </div>

      {/* PORTFOLIO METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-slate-900/60 shadow-xl space-y-2">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Portfolio Sum Insured</span>
          <div className="text-3xl font-black text-cyan-400 font-mono tracking-tight">
            ${totalSumInsured.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-400 block">{plots.length} Underwritten Policies</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-slate-900/60 shadow-xl space-y-2">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Approved Parametric Payouts</span>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
            ${totalPayouts.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-300 font-semibold block">Auto-Indemnity Settled</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-slate-900/60 shadow-xl space-y-2">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ghost-Acreage Verified</span>
          <div className="text-3xl font-black text-purple-400 font-mono tracking-tight">
            {totalCultivatedHa.toFixed(2)} ha
          </div>
          <span className="text-[11px] text-purple-300 font-semibold block">Sentinel-2 NDVI Masked</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950/30 to-slate-900/60 shadow-xl space-y-2">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">5km Peer Z-Score Flags</span>
          <div className="text-3xl font-black text-rose-400 font-mono tracking-tight">
            {fraudCount} Flags
          </div>
          <span className="text-[11px] text-rose-300 font-semibold block">Moral Hazard Inspection</span>
        </div>
      </div>

      {/* FILTER & TABLE CONSOLE */}
      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-white/10 shadow-2xl">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📋</span> National Farmer Plot Underwriting Queue
            </h3>
            <p className="text-xs text-gray-400">Stored in Supabase PostgreSQL & verified via Earth Engine</p>
          </div>

          {/* FILTER PILLS */}
          <div className="flex items-center gap-2 bg-black/60 p-1 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setFilterTier('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTier === 'ALL' ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              All Plots ({plots.length})
            </button>
            <button
              onClick={() => setFilterTier('CRITICAL')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTier === 'CRITICAL' ? 'bg-rose-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Critical Risk 🚨
            </button>
            <button
              onClick={() => setFilterTier('FRAUD')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTier === 'FRAUD' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Fraud Z-Flags ⚠️
            </button>
            <button
              onClick={() => setFilterTier('APPROVED')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterTier === 'APPROVED' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Approved Payouts ✓
            </button>
          </div>
        </div>

        {/* UNDERWRITING TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/60 text-gray-400 font-bold uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Farmer & District</th>
                <th className="p-4">Crop</th>
                <th className="p-4">Cultivated Area</th>
                <th className="p-4">HVI Score</th>
                <th className="p-4">Moisture (VSM / SMDI)</th>
                <th className="p-4">Z-Score</th>
                <th className="p-4">Sum Insured / Payout</th>
                <th className="p-4">Claim Status</th>
                <th className="p-4 text-center">Underwriter Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-900/40 font-medium">
              {filteredPlots.map((plot) => (
                <tr key={plot.id} className="hover:bg-cyan-500/5 transition-colors">
                  <td className="p-4">
                    <strong className="text-white font-bold block">{plot.farmer_name}</strong>
                    <span className="text-[11px] text-cyan-400 font-mono">{plot.district}</span>
                  </td>
                  <td className="p-4">
                    <span className="capitalize font-bold text-gray-200">{plot.declared_crop}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-cyan-300 font-mono font-bold">{plot.verified_cultivated_ha || plot.area_hectares} ha</span>
                    <span className="text-[10px] text-gray-400 block">{(plot.verified_cultivated_ha ? (plot.verified_cultivated_ha / plot.area_hectares * 100).toFixed(0) : 100)}% Verified</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black font-mono border ${
                      plot.hvi_score >= 75
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : plot.hvi_score >= 50
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {plot.hvi_score} / 100
                    </span>
                  </td>
                  <td className="p-4 font-mono">
                    <span className="text-cyan-400 block">{plot.latest_vsm}% VSM</span>
                    <span className="text-rose-400 text-[10px]">SMDI: {plot.latest_smdi}</span>
                  </td>
                  <td className="p-4 font-mono">
                    <span className={`font-bold ${plot.fraud_flag ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {plot.z_score}
                    </span>
                    {plot.fraud_flag && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded ml-1">Z-FLAG</span>}
                  </td>
                  <td className="p-4 font-mono">
                    <span className="text-white block font-bold">${plot.sum_insured}</span>
                    <span className="text-emerald-400 text-[11px]">${plot.payout_amount || 0} payout</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      plot.claim_status === 'APPROVED_AUTO_PAYOUT'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : plot.claim_status === 'SUSPENDED'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-white/10 text-gray-300 border-white/20'
                    }`}>
                      {plot.claim_status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(plot.id, 'APPROVED_AUTO_PAYOUT', Math.round((plot.sum_insured || 10000) * 0.8365))}
                        title="Approve Indemnity Payout"
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black border border-emerald-500/40 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        ✓ Approve
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(plot.id, 'REJECTED_PRE_EXISTING_CONDITION', 0)}
                        title="Reject Pre-Existing Condition Claim"
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/40 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
