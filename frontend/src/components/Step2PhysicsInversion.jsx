import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Step2PhysicsInversion({ plotData }) {
  const [activeTab, setActiveTab] = useState('imagery'); // 'imagery' or 'guide'

  const dates = plotData?.history?.dates || ["2024-03-01", "2024-04-01", "2024-05-01", "2024-06-01", "2024-07-01", "2024-08-01", "2024-09-01", "2024-10-01", "2024-11-01", "2024-12-01"];
  const vsm = plotData?.history?.vsm || [0.28, 0.32, 0.30, 0.18, 0.14, 0.12, 0.22, 0.35, 0.38, 0.30];
  const smdi = plotData?.history?.smdi || [0.10, 0.05, 0.15, 0.45, 0.68, 0.75, 0.40, 0.12, 0.05, 0.10];
  const ndvi = plotData?.history?.ndvi || [0.25, 0.40, 0.65, 0.72, 0.60, 0.42, 0.25, 0.50, 0.70, 0.55];

  const latestVsm = plotData?.plot_metrics?.latest_vsm_percentage ?? 25.0;
  const latestNdvi = plotData?.plot_metrics?.latest_ndvi ?? 0.45;
  const latestEpsilon = plotData?.plot_metrics?.soil_dielectric_epsilon ?? 12.5;
  const latestSmdi = plotData?.plot_metrics?.latest_smdi ?? 0.10;
  const acqDate = plotData?.recent_satellite_imagery?.acquisition_date ?? "2026-07-15";

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Volumetric Soil Moisture (VSM %)',
        data: vsm.map(v => v * 100),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.12)',
        fill: true,
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 3
      },
      {
        label: 'Soil Moisture Deficit Index (SMDI)',
        data: smdi.map(s => s * 100),
        borderColor: '#f43f5e',
        borderDash: [5, 5],
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3
      },
      {
        label: 'Sentinel-2 NDVI Canopy Index',
        data: ndvi.map(n => n * 100),
        borderColor: '#10b981',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#cbd5e1', font: { size: 11, weight: 'bold' } }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER FOR DERIVATIVES */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            📡 Satellite Physical Derivatives Dashboard
          </h2>
          <p className="text-xs text-gray-400">Sentinel-1 SAR Radar & Sentinel-2 Optical Biophysical Inversion</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          WCM + MDM Model Calibrated
        </span>
      </div>

      {/* 4 DISTINCT DERIVATIVE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: VSM */}
        <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-slate-900/60 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-300">Soil Moisture (VSM %)</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Root-Zone 5cm
            </span>
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono tracking-tight">
            {latestVsm}%
          </div>
          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (latestVsm / 50) * 100)}%` }} />
          </div>
        </div>

        {/* Metric 2: NDVI */}
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-slate-900/60 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-300">NDVI Biomass Index</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Growth
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
            {latestNdvi}
          </div>
          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${Math.min(100, latestNdvi * 100)}%` }} />
          </div>
        </div>

        {/* Metric 3: Dielectric Constant */}
        <div className="glass-panel p-5 rounded-2xl border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-slate-900/60 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-300">Dielectric Constant (ε)</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Dubois Model
            </span>
          </div>
          <div className="text-3xl font-black text-purple-400 font-mono tracking-tight">
            {latestEpsilon}
          </div>
          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (latestEpsilon / 35) * 100)}%` }} />
          </div>
        </div>

        {/* Metric 4: SMDI */}
        <div className="glass-panel p-5 rounded-2xl border-rose-500/30 bg-gradient-to-br from-rose-950/30 to-slate-900/60 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-300">SMDI Deficit Index</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
              latestSmdi >= 0.60 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              {latestSmdi >= 0.60 ? '🚨 Breach Threshold' : 'Normal'}
            </span>
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono tracking-tight">
            {latestSmdi}
          </div>
          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-400 h-full rounded-full transition-all" style={{ width: `${Math.min(100, latestSmdi * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Satellite Thumbnails & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4 border border-white/10 shadow-2xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            📊 Sentinel-1 & Sentinel-2 Time-Series Physics Inversion
          </h3>
          <div className="h-[340px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* SATELLITE IMAGERY PANEL WITH HOVER REVEAL & COLOR LEGENDS */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🛰️</span> GEE Satellite Imagery
            </h3>
            <div className="flex gap-1 bg-black/60 p-1 rounded-lg border border-white/10 text-[10px]">
              <button
                onClick={() => setActiveTab('imagery')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  activeTab === 'imagery' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Imagery
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  activeTab === 'guide' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Legend & Guide
              </button>
            </div>
          </div>

          {activeTab === 'imagery' ? (
            <div className="space-y-4">
              {/* IMAGE 1: Sentinel-2 True Color RGB */}
              <div className="group rounded-2xl overflow-hidden border border-white/10 relative shadow-lg cursor-pointer">
                <img 
                  src={plotData?.recent_satellite_imagery?.rgb_thumbnail_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80"} 
                  alt="Sentinel-2 True Color RGB" 
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge Label */}
                <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white border border-white/20">
                  Sentinel-2 RGB (B4, B3, B2)
                </span>

                {/* HOVER TELEMETRY REVEAL OVERLAY */}
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between text-xs text-slate-200">
                  <div className="space-y-1">
                    <span className="font-extrabold text-cyan-400 text-xs block">🛰️ Sentinel-2 MSI Level-2A</span>
                    <p className="text-[11px] text-gray-300">Natural True Color composite using visible spectrum bands.</p>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between border-t border-white/10 pt-1">
                      <span className="text-gray-400">Ground Resolution:</span>
                      <strong className="text-white font-mono">10m x 10m</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Acquisition Date:</span>
                      <strong className="text-cyan-300 font-mono">{acqDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bands:</span>
                      <strong className="text-white font-mono">B4 (665nm), B3 (560nm), B2 (490nm)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* IMAGE 2: Sentinel-2 NDVI Heatmap */}
              <div className="group rounded-2xl overflow-hidden border border-emerald-500/30 relative shadow-lg cursor-pointer">
                <img 
                  src={plotData?.recent_satellite_imagery?.ndvi_heatmap_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"} 
                  alt="NDVI Heatmap" 
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge Label */}
                <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/40">
                  NDVI Heatmap (B8, B4)
                </span>

                {/* HOVER TELEMETRY REVEAL OVERLAY */}
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between text-xs text-slate-200">
                  <div className="space-y-1">
                    <span className="font-extrabold text-emerald-400 text-xs block">🌿 Vegetation Index (NDVI)</span>
                    <p className="text-[11px] text-gray-300">Biomass density & chlorophyll absorption proxy.</p>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between border-t border-white/10 pt-1">
                      <span className="text-gray-400">Formula:</span>
                      <strong className="text-emerald-300 font-mono">(B8 - B4) / (B8 + B4)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Biomass Score:</span>
                      <strong className="text-white font-mono">{latestNdvi}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phenology Status:</span>
                      <strong className="text-emerald-400 font-mono">ACTIVE_GROWTH</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* NDVI COLOR SCALE BAR LEGEND */}
              <div className="p-3 bg-black/50 border border-white/10 rounded-xl space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-300">
                  <span>0.0 Bare Soil</span>
                  <span>0.4 Emergence</span>
                  <span>0.8 Peak Canopy</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden bg-gradient-to-r from-red-600 via-yellow-400 via-lime-400 to-emerald-600 border border-white/10 shadow-inner" />
                <p className="text-[10px] text-gray-400 text-center">
                  💡 Hover cursor over satellite imagery thumbnails to reveal telemetry details
                </p>
              </div>
            </div>
          ) : (
            /* LEGEND & AUDIT GUIDE TAB */
            <div className="space-y-3 text-xs text-gray-300">
              <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <span>🔴</span> Red Zone (NDVI &lt; 0.20)
                </h4>
                <p className="text-[11px] leading-relaxed text-gray-400">
                  Bare soil, fallow land, paved roads, or post-harvest residue. Sub-pixel masked by Ghost-Acreage Shield.
                </p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                <h4 className="font-bold text-yellow-300 flex items-center gap-1.5 text-xs">
                  <span>🟡</span> Yellow Zone (0.20 – 0.40)
                </h4>
                <p className="text-[11px] leading-relaxed text-gray-400">
                  Early crop emergence or end-of-season crop senescence. Low-to-moderate leaf area index (LAI).
                </p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                  <span>🟢</span> Green Zone (NDVI ≥ 0.50)
                </h4>
                <p className="text-[11px] leading-relaxed text-gray-400">
                  Dense active vegetative canopy with high chlorophyll absorption. Qualifies for Salvage Advisory retention.
                </p>
              </div>

              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-[11px] text-cyan-300 space-y-1">
                <strong className="text-white block font-bold">🛰️ Technical Specs:</strong>
                <span>Sentinel-2 MSI Level-2A • 10m spatial resolution • 5-day revisit frequency • Multi-Spectral Instrument.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
