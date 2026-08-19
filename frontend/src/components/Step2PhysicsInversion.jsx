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
  const [selectedImage, setSelectedImage] = useState(null);

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

  const rgbUrl = plotData?.recent_satellite_imagery?.rgb_thumbnail_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80";
  const ndviUrl = plotData?.recent_satellite_imagery?.ndvi_heatmap_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="space-y-8">
      {/* SECTION HEADER FOR DERIVATIVES */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            📡 Satellite Physical Derivatives & Earth Observation Telemetry
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

      {/* HERO FEATURE: LARGE HIGH-RES SATELLITE IMAGERY SHOWCASE GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>🛰️</span> High-Resolution Earth Observation Telemetry Showcase
            </h3>
            <p className="text-xs text-gray-400">Side-by-side 10m spatial resolution Sentinel-2 spectral analysis. Click image or hover to inspect metadata.</p>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
            Acquired: {acqDate}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LARGE IMAGE 1: Sentinel-2 True Color RGB */}
          <div 
            onClick={() => setSelectedImage({ title: 'Sentinel-2 True Color RGB (B4, B3, B2)', url: rgbUrl, type: 'rgb' })}
            className="group glass-panel rounded-3xl overflow-hidden border border-white/15 hover:border-cyan-400 transition-all duration-300 shadow-2xl relative cursor-pointer"
          >
            <div className="relative h-80 overflow-hidden bg-black">
              <img 
                src={rgbUrl} 
                alt="Sentinel-2 True Color RGB" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-black/80 text-white border border-white/30 backdrop-blur-md shadow-lg">
                  Sentinel-2 RGB
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                  10m Resolution
                </span>
              </div>

              <div className="absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-xl bg-black/80 text-cyan-400 border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                🔍 Click for Fullscreen Inspection
              </div>

              {/* HOVER OVERLAY REVEAL */}
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between text-slate-200">
                <div className="space-y-2">
                  <span className="font-black text-cyan-400 text-sm block">🛰️ Sentinel-2 MSI Level-2A True Color</span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Bottom-Of-Atmosphere (BOA) reflectance composite utilizing visible light bands B4 (Red 665nm), B3 (Green 560nm), and B2 (Blue 490nm). Differentiates natural vegetation, soil moisture, and cloud cover.
                  </p>
                </div>
                <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Spectral Composite:</span>
                    <strong className="text-white font-mono">B4 (Red) + B3 (Green) + B2 (Blue)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ground Sampling:</span>
                    <strong className="text-cyan-300 font-mono">10m x 10m per pixel</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orbit Constellation:</span>
                    <strong className="text-white font-mono">Sentinel-2A / 2B (ESA Copernicus)</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="font-bold text-gray-300">Visible Light Spectrum Analysis</span>
              <span className="text-gray-400 text-[11px]">Hover to view band parameters</span>
            </div>
          </div>

          {/* LARGE IMAGE 2: Sentinel-2 NDVI Heatmap */}
          <div 
            onClick={() => setSelectedImage({ title: 'Sentinel-2 Vegetation Health NDVI (B8, B4)', url: ndviUrl, type: 'ndvi' })}
            className="group glass-panel rounded-3xl overflow-hidden border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 shadow-2xl relative cursor-pointer"
          >
            <div className="relative h-80 overflow-hidden bg-black">
              <img 
                src={ndviUrl} 
                alt="NDVI Heatmap" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-black/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md shadow-lg">
                  NDVI Heatmap
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                  Chlorophyll Proxy
                </span>
              </div>

              <div className="absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-xl bg-black/80 text-emerald-400 border border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                🔍 Click for Fullscreen Inspection
              </div>

              {/* HOVER OVERLAY REVEAL */}
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between text-slate-200">
                <div className="space-y-2">
                  <span className="font-black text-emerald-400 text-sm block">🌿 Normalized Difference Vegetation Index (NDVI)</span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Calculated via Near-Infrared Band 8 (842nm) and Red Band 4 (665nm). Measures photosynthetic canopy activity and live crop biomass density.
                  </p>
                </div>
                <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mathematical Inversion:</span>
                    <strong className="text-emerald-300 font-mono">(B8 - B4) / (B8 + B4)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Score:</span>
                    <strong className="text-white font-mono">{latestNdvi}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Crop Health Assessment:</span>
                    <strong className="text-emerald-400 font-mono">ACTIVE_VEGETATIVE_GROWTH</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* COLOR SCALE LEGEND BAR */}
            <div className="p-4 bg-slate-900/90 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-gray-300">
                <span className="text-red-400">0.0 Bare Soil</span>
                <span className="text-yellow-300">0.2 Threshold</span>
                <span className="text-lime-300">0.5 Emergence</span>
                <span className="text-emerald-400">0.8 Peak Canopy</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-gradient-to-r from-red-600 via-yellow-400 via-lime-400 to-emerald-600 border border-white/10 shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      {/* TIME-SERIES LINE CHART SHOWCASE */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            📊 Sentinel-1 SAR Radar & Sentinel-2 Optical Time-Series Physical Inversion
          </h3>
          <span className="text-xs font-semibold text-gray-400">12-Month Satellite Multi-Pass Records</span>
        </div>
        <div className="h-[340px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* FULLSCREEN IMAGE INSPECTION MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="relative max-w-5xl w-full glass-panel p-6 rounded-3xl space-y-4 border border-cyan-500/40">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                🔍 High-Resolution Satellite Telemetry Inspector — {selectedImage.title}
              </h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-white font-bold w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 h-[500px]">
              <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-full object-contain bg-black" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
