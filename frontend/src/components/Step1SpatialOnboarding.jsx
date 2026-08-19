import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function Step1SpatialOnboarding({ 
  polygonCoords, 
  onPolygonDrawn, 
  declaredCrop, 
  onCropChange, 
  plotData, 
  boundaryData, 
  isLoading, 
  onRunAnalysis 
}) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const drawnPolygon = useRef(null);

  const defaultCoords = [
    [13.0827, 80.2707],
    [13.0827, 80.2750],
    [13.0870, 80.2750],
    [13.0870, 80.2707]
  ];

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current).setView([13.085, 80.2725], 14);
    leafletMap.current = map;

    L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '© Google Satellite'
    }).addTo(map);

    const initialPolygon = polygonCoords.length > 0 ? polygonCoords : defaultCoords;
    drawPolygonOnMap(initialPolygon);

    map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      const newPoly = [
        [lat - 0.002, lng - 0.002],
        [lat - 0.002, lng + 0.002],
        [lat + 0.002, lng + 0.002],
        [lat + 0.002, lng - 0.002]
      ];
      
      drawPolygonOnMap(newPoly);
      
      const geoJsonCoords = newPoly.map(c => [c[1], c[0]]);
      geoJsonCoords.push(geoJsonCoords[0]);
      onPolygonDrawn(geoJsonCoords);
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  const drawPolygonOnMap = (coords) => {
    if (!leafletMap.current) return;
    if (drawnPolygon.current) {
      leafletMap.current.removeLayer(drawnPolygon.current);
    }

    const leafletCoords = coords.map(c => [c[1], c[0]]);
    const poly = L.polygon(leafletCoords, {
      color: '#06b6d4',
      fillColor: '#06b6d4',
      fillOpacity: 0.25,
      weight: 2
    }).addTo(leafletMap.current);

    drawnPolygon.current = poly;
    leafletMap.current.fitBounds(poly.getBounds());
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-4 space-y-3">
          <div className="flex justify-between items-center px-2">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🗺️</span> Draw Field Boundary
              </h2>
              <p className="text-[11px] text-gray-400">Click anywhere on satellite map to place 10m Sentinel plot boundary</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Sentinel-2 10m Resolution
            </span>
          </div>

          <div ref={mapRef} className="w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 z-10" />
        </div>

        {/* Control Panel & Metrics */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-3xl space-y-5">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3">
              🌱 Underwriting Crop Selection
            </h3>

            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-semibold">Declared Agronomic Crop</label>
              <select 
                value={declaredCrop}
                onChange={(e) => onCropChange(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="rice">Rice (Paddy)</option>
                <option value="cotton">Cotton</option>
                <option value="groundnut">Groundnut (Peanut)</option>
              </select>
            </div>

            <button
              onClick={onRunAnalysis}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoading ? '⏳ Inverting Telemetry...' : '⚡ Run Satellite Physics Inversion'}
            </button>
          </div>

          {/* FEATURE 1: GHOST-ACREAGE SHIELD CARD */}
          <div className="glass-panel p-5 rounded-3xl space-y-3 border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-slate-900/40">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>🛡️</span> Ghost-Acreage Shield
              </h4>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Confidence: {boundaryData?.boundary_confidence_pct ?? '83.7'}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 block">Drawn Area:</span>
                <span className="font-bold text-white">{(plotData?.plot_metrics?.area_hectares ?? 22.27)} ha</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 block">Verified Cultivated:</span>
                <span className="font-bold text-cyan-400">{(boundaryData?.verified_area_m2 ? (boundaryData.verified_area_m2 / 10000).toFixed(2) : '18.63')} ha</span>
              </div>
            </div>

            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[11px] text-cyan-300 flex justify-between items-center">
              <span>Indemnity Scale Factor:</span>
              <strong className="font-mono text-white">{boundaryData?.cultivated_ratio ?? '0.8365'}x</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
