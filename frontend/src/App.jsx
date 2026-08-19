import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import StepIndicator from './components/StepIndicator';
import BlueprintModal from './components/BlueprintModal';
import Step1SpatialOnboarding from './components/Step1SpatialOnboarding';
import Step2PhysicsInversion from './components/Step2PhysicsInversion';
import Step3VulnerabilityScoring from './components/Step3VulnerabilityScoring';
import Step4ActuarialPayout from './components/Step4ActuarialPayout';
import PlotAnalysisSkeleton from './components/PlotAnalysisSkeleton';

const API_BASE = 'http://127.0.0.1:8001';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [declaredCrop, setDeclaredCrop] = useState('rice');
  const [sumInsured, setSumInsured] = useState(10000);

  const [polygonCoords, setPolygonCoords] = useState([
    [80.2707, 13.0827],
    [80.2750, 13.0827],
    [80.2750, 13.0870],
    [80.2707, 13.0870],
    [80.2707, 13.0827]
  ]);

  const [plotData, setPlotData] = useState(null);
  const [boundaryData, setBoundaryData] = useState(null);
  const [payoutData, setPayoutData] = useState(null);

  const handlePolygonDrawn = (coords) => {
    setPolygonCoords(coords);
  };

  const handleClearPlot = () => {
    setPolygonCoords([]);
    setPlotData(null);
    setBoundaryData(null);
    setPayoutData(null);
    setError(null);
  };

  const handleReset = () => {
    setCurrentStep(1);
    handleClearPlot();
  };

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Analyze plot telemetry (FastAPI / GEE WCM + MDM physical inversion)
      const resPlot = await fetch(`${API_BASE}/api/hrie/analyze-plot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinates: polygonCoords })
      });
      if (!resPlot.ok) {
        throw new Error(`Satellite Ingestion API returned HTTP status ${resPlot.status}`);
      }
      const dataPlot = await resPlot.json();
      setPlotData(dataPlot);

      // 2. Verify cultivated boundary (Ghost-Acreage Shield)
      const resBoundary = await fetch(`${API_BASE}/api/underwrite/verify-boundary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinates: polygonCoords, declared_crop: declaredCrop })
      });
      if (!resBoundary.ok) {
        throw new Error(`Boundary Verification API returned HTTP status ${resBoundary.status}`);
      }
      const dataBoundary = await resBoundary.json();
      setBoundaryData(dataBoundary);

      // 3. Verify payout & salvage advisory
      await fetchPayout(polygonCoords, sumInsured, declaredCrop);

      setCurrentStep(2);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Satellite telemetry ingestion timed out or failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayout = async (coords, sumVal, cropVal) => {
    try {
      const res = await fetch(`${API_BASE}/api/hrie/verify-payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          coordinates: coords, 
          sum_insured: parseFloat(sumVal) || 10000,
          declared_crop: cropVal
        })
      });
      if (!res.ok) {
        throw new Error(`Payout Verification API returned HTTP status ${res.status}`);
      }
      const data = await res.json();
      setPayoutData(data);
    } catch (err) {
      console.error('Payout fetch error:', err);
    }
  };

  const handleSumInsuredChange = (val) => {
    setSumInsured(val);
    if (polygonCoords.length >= 3) {
      fetchPayout(polygonCoords, val, declaredCrop);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar 
        onReset={handleReset} 
        onOpenBlueprint={() => setIsBlueprintOpen(true)} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        <StepIndicator 
          currentStep={currentStep} 
          onSelectStep={(step) => setCurrentStep(step)} 
        />

        {/* ERROR ALERT BANNER WITH RETRY */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 text-xs text-rose-300 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">⚠️</span>
                <div>
                  <strong className="font-bold text-white block">Satellite Telemetry Error</strong>
                  <span>{error}</span>
                </div>
              </div>
              <button
                onClick={runAnalysis}
                className="px-4 py-2 rounded-xl font-bold bg-rose-500 text-white hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/20 shrink-0"
              >
                🔄 Retry Analysis
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP CONTENT / SKELETON FADE SWAP */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <PlotAnalysisSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {currentStep === 1 && (
                <Step1SpatialOnboarding 
                  polygonCoords={polygonCoords}
                  onPolygonDrawn={handlePolygonDrawn}
                  onClearPlot={handleClearPlot}
                  declaredCrop={declaredCrop}
                  onCropChange={setDeclaredCrop}
                  plotData={plotData}
                  boundaryData={boundaryData}
                  isLoading={isLoading}
                  onRunAnalysis={runAnalysis}
                />
              )}

              {currentStep === 2 && (
                <Step2PhysicsInversion plotData={plotData} />
              )}

              {currentStep === 3 && (
                <Step3VulnerabilityScoring plotData={plotData} />
              )}

              {currentStep === 4 && (
                <Step4ActuarialPayout 
                  sumInsured={sumInsured}
                  onSumInsuredChange={handleSumInsuredChange}
                  payoutData={payoutData}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP NAVIGATION CONTROLS */}
        {!isLoading && (
          <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-8">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                currentStep === 1 
                  ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-gray-500' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              ← Previous Step
            </button>

            <div className="text-xs text-gray-400 font-semibold">
              Step {currentStep} of 4
            </div>

            <button
              onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
              disabled={currentStep === 4}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                currentStep === 4 
                  ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-gray-500' 
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-500 border-emerald-400 text-black hover:opacity-90 shadow-lg shadow-emerald-500/20'
              }`}
            >
              Next Step →
            </button>
          </div>
        )}
      </main>

      <BlueprintModal 
        isOpen={isBlueprintOpen} 
        onClose={() => setIsBlueprintOpen(false)} 
      />
    </div>
  );
}
