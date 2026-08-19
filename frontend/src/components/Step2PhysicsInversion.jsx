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

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Volumetric Soil Moisture (VSM %)',
        data: vsm.map(v => v * 100),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Soil Moisture Deficit Index (SMDI)',
        data: smdi.map(s => s * 100),
        borderColor: '#f43f5e',
        borderDash: [5, 5],
        tension: 0.3
      },
      {
        label: 'Sentinel-2 NDVI Canopy Index',
        data: ndvi.map(n => n * 100),
        borderColor: '#10b981',
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#cbd5e1', font: { size: 11 } }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div className="space-y-6">
      {/* Telemetry Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border-cyan-500/20">
          <span className="text-xs text-gray-400 block">Soil Moisture (VSM %)</span>
          <span className="text-2xl font-black text-cyan-400">
            {plotData?.plot_metrics?.latest_vsm_percentage ?? '25.0'}%
          </span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border-emerald-500/20">
          <span className="text-xs text-gray-400 block">NDVI Biomass Index</span>
          <span className="text-2xl font-black text-emerald-400">
            {plotData?.plot_metrics?.latest_ndvi ?? '0.45'}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border-purple-500/20">
          <span className="text-xs text-gray-400 block">Dielectric Constant (ε)</span>
          <span className="text-2xl font-black text-purple-400">
            {plotData?.plot_metrics?.soil_dielectric_epsilon ?? '12.5'}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border-rose-500/20">
          <span className="text-xs text-gray-400 block">SMDI Deficit Index</span>
          <span className="text-2xl font-black text-rose-400">
            {plotData?.plot_metrics?.latest_smdi ?? '0.10'}
          </span>
        </div>
      </div>

      {/* Satellite Thumbnails & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            📊 Sentinel-1 & Sentinel-2 Time-Series Physics Inversion
          </h3>
          <div className="h-[320px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white">🛰️ Real-Time GEE Satellite Imagery</h3>
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-white/10 relative">
              <img 
                src={plotData?.recent_satellite_imagery?.rgb_thumbnail_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80"} 
                alt="Sentinel-2 True Color RGB" 
                className="w-full h-36 object-cover"
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white">
                Sentinel-2 RGB
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 relative">
              <img 
                src={plotData?.recent_satellite_imagery?.ndvi_heatmap_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"} 
                alt="NDVI Heatmap" 
                className="w-full h-36 object-cover"
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-emerald-400">
                NDVI Heatmap
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
