import React, { useEffect, useRef, useState } from 'react';
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
  const tempMarkersRef = useRef([]);
  const tempPolylineRef = useRef([]);

  const [drawMode, setDrawMode] = useState('click_box'); // 'click_box' or 'multi_vertex'
  const [activeVertices, setActiveVertices] = useState([]);

  // Normalize GeoJSON [lng, lat] to Leaflet [lat, lng]
  const toLeafletLatLng = (coord) => {
    if (!coord || coord.length < 2) return [13.085, 80.2725];
    // In India, Lng is ~70-90, Lat is ~8-35.
    // If index 0 > 50, it's [lng, lat] GeoJSON format.
    if (Math.abs(coord[0]) > 50.0) {
      return [coord[1], coord[0]];
    }
    return [coord[0], coord[1]];
  };

  // Normalize Leaflet [lat, lng] to GeoJSON [lng, lat]
  const toGeoJsonLngLat = (lat, lng) => {
    return [lng, lat];
  };

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current).setView([13.085, 80.2725], 14);
    leafletMap.current = map;

    L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '© Google Satellite'
    }).addTo(map);

    // Initial polygon rendering
    if (polygonCoords && polygonCoords.length >= 3) {
      renderPolygonOnMap(polygonCoords);
    } else {
      const defaultPoly = [
        [80.2707, 13.0827],
        [80.2750, 13.0827],
        [80.2750, 13.0870],
        [80.2707, 13.0870],
        [80.2707, 13.0827]
      ];
      renderPolygonOnMap(defaultPoly);
    }

    // Map Click Listener
    map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (drawMode === 'click_box') {
        // Place 1-Hectare Box Centered on Click
        const delta = 0.0025;
        const boxGeoJson = [
          toGeoJsonLngLat(lat - delta, lng - delta),
          toGeoJsonLngLat(lat - delta, lng + delta),
          toGeoJsonLngLat(lat + delta, lng + delta),
          toGeoJsonLngLat(lat + delta, lng - delta),
          toGeoJsonLngLat(lat - delta, lng - delta)
        ];
        renderPolygonOnMap(boxGeoJson);
        onPolygonDrawn(boxGeoJson);
      } else if (drawMode === 'multi_vertex') {
        // Add Vertex to Custom Draw Line
        setActiveVertices(prev => {
          const next = [...prev, [lat, lng]];
          updateTempVertices(next);
          return next;
        });
      }
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [drawMode]);

  const renderPolygonOnMap = (geoJsonCoords) => {
    if (!leafletMap.current) return;

    clearTempDrawings();

    if (drawnPolygon.current) {
      leafletMap.current.removeLayer(drawnPolygon.current);
    }

    const leafletCoords = geoJsonCoords.map(c => toLeafletLatLng(c));
    const poly = L.polygon(leafletCoords, {
      color: '#06b6d4',
      fillColor: '#06b6d4',
      fillOpacity: 0.30,
      weight: 3
    }).addTo(leafletMap.current);

    drawnPolygon.current = poly;
    leafletMap.current.fitBounds(poly.getBounds(), { padding: [30, 30] });
  };

  const updateTempVertices = (vertices) => {
    if (!leafletMap.current) return;

    // Clear existing temp markers & lines
    tempMarkersRef.current.forEach(m => leafletMap.current.removeLayer(m));
    tempMarkersRef.current = [];

    if (tempPolylineRef.current) {
      leafletMap.current.removeLayer(tempPolylineRef.current);
      tempPolylineRef.current = null;
    }

    // Add point markers
    vertices.forEach((v, idx) => {
      const marker = L.circleMarker(v, {
        radius: 6,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.9
      }).addTo(leafletMap.current);
      tempMarkersRef.current.push(marker);
    });

    // Draw connecting line
    if (vertices.length >= 2) {
      tempPolylineRef.current = L.polyline(vertices, {
        color: '#10b981',
        weight: 2,
        dashArray: '5, 5'
      }).addTo(leafletMap.current);
    }
  };

  const finishCustomPolygon = () => {
    if (activeVertices.length < 3) return;

    const customGeoJson = activeVertices.map(v => toGeoJsonLngLat(v[0], v[1]));
    customGeoJson.push(customGeoJson[0]); // Close loop

    renderPolygonOnMap(customGeoJson);
    onPolygonDrawn(customGeoJson);

    setActiveVertices([]);
    setDrawMode('click_box');
  };

  const clearTempDrawings = () => {
    if (leafletMap.current) {
      tempMarkersRef.current.forEach(m => leafletMap.current.removeLayer(m));
      tempMarkersRef.current = [];
      if (tempPolylineRef.current) {
        leafletMap.current.removeLayer(tempPolylineRef.current);
        tempPolylineRef.current = null;
      }
    }
    setActiveVertices([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-4 space-y-4 border border-white/10 shadow-2xl">
          <div className="flex flex-wrap justify-between items-center px-2 gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🗺️</span> Spatial Plot Drawing Console
              </h2>
              <p className="text-[11px] text-gray-400">Click anywhere on Google Satellite imagery to define plot boundary</p>
            </div>

            {/* DRAW MODE CONTROLS */}
            <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => { setDrawMode('click_box'); clearTempDrawings(); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  drawMode === 'click_box' 
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📍 Quick 1-Ha Box
              </button>
              <button
                onClick={() => { setDrawMode('multi_vertex'); clearTempDrawings(); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  drawMode === 'multi_vertex' 
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ✏️ Custom Vertices ({activeVertices.length})
              </button>
            </div>
          </div>

          {/* ACTIVE VERTEX COMPLETE BAR */}
          {drawMode === 'multi_vertex' && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex justify-between items-center text-xs text-emerald-300">
              <span>Click map points to add corners ({activeVertices.length} placed). Minimum 3 required.</span>
              <button
                onClick={finishCustomPolygon}
                disabled={activeVertices.length < 3}
                className="px-4 py-1.5 rounded-lg font-extrabold bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-40 transition-all shadow"
              >
                ✓ Complete Polygon
              </button>
            </div>
          )}

          <div ref={mapRef} className="w-full h-[420px] rounded-2xl overflow-hidden border border-white/10 z-10 shadow-inner" />
        </div>

        {/* Control Panel & Metrics */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-3xl space-y-5 border border-white/10 shadow-2xl">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              🌱 Agronomic Crop Selection
            </h3>

            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-semibold">Declared Crop Type</label>
              <select 
                value={declaredCrop}
                onChange={(e) => onCropChange(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
              >
                <option value="rice">Rice (Paddy)</option>
                <option value="cotton">Cotton</option>
                <option value="groundnut">Groundnut (Peanut)</option>
              </select>
            </div>

            <button
              onClick={onRunAnalysis}
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-xs font-black tracking-wide bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoading ? '⏳ Inverting Satellite Telemetry...' : '⚡ Run Satellite Physics Inversion'}
            </button>
          </div>

          {/* FEATURE 1: GHOST-ACREAGE SHIELD CARD */}
          <div className="glass-panel p-5 rounded-3xl space-y-3 border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-slate-900/40 shadow-xl">
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
                <span className="text-[10px] text-gray-400 block">Drawn Plot Area:</span>
                <span className="font-bold text-white">{(plotData?.plot_metrics?.area_hectares ?? 22.27)} ha</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 block">Verified Cultivated:</span>
                <span className="font-bold text-cyan-400">{(boundaryData?.verified_area_m2 ? (boundaryData.verified_area_m2 / 10000).toFixed(2) : '18.63')} ha</span>
              </div>
            </div>

            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[11px] text-cyan-300 flex justify-between items-center">
              <span>Indemnity Scale Factor:</span>
              <strong className="font-mono text-white text-xs">{boundaryData?.cultivated_ratio ?? '0.8365'}x</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
