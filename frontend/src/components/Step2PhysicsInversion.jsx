import React from 'react';
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
  const dates = plotData?.history?.dates || ["2024-03-01", "2024-04-01", "2024-05-01", "2024-06-01", "2024-07-01", "2024-08-01", "2024-09-01", "2024-10-01", "2024-11-01", "2024-12-01"];
  const vsm = plotData?.history?.vsm || [0.28, 0.32, 0.30, 0.18, 0.14, 0.12, 0.22, 0.35, 0.38, 0.30];
  const smdi = plotData?.history?.smdi || [0.10, 0.05, 0.15, 0.45, 0.68, 0.75, 0.40, 0.12, 0.05, 0.10];
  const ndvi = plotData?.history?.ndvi || [0.25, 0.40, 0.65, 0.72, 0.60, 0.42, 0.25, 0.50, 0.70, 0.55];

  const latestVsm = plotData?.plot_metrics?.latest_vsm_percentage ?? 25.0;
  const latestNdvi = plotData?.plot_metrics?.latest_ndvi ?? 0.45;
  const latestEpsilon = plotData?.plot_metrics?.soil_dielectric_epsilon ?? 12.5;
  const latestSmdi = plotData?.plot_metrics?.latest_smdi ?? 0.10;

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
          <div className="h-[320px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/10 shadow-2xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🛰️</span> Real-Time GEE Satellite Imagery
          </h3>
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border border-white/10 relative shadow-lg">
              <img 
                src={plotData?.recent_satellite_imagery?.rgb_thumbnail_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80"} 
                alt="Sentinel-2 True Color RGB" 
                className="w-full h-36 object-cover"
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white border border-white/20">
                Sentinel-2 RGB
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 relative shadow-lg">
              <img 
                src={plotData?.recent_satellite_imagery?.ndvi_heatmap_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"} 
                alt="NDVI Heatmap" 
                className="w-full h-36 object-cover"
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/30">
                NDVI Heatmap
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
