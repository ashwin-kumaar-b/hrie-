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
import InsurerDashboard from './components/InsurerDashboard';
import { AuthUI } from './components/ui/auth-fuse';
import { saveFarmerPlot } from './lib/supabase';

const API_BASE = 'http://127.0.0.1:8001';

export default function App() {
  const [userSession, setUserSession] = useState(null); // null = Auth Screen
  const [activeView, setActiveView] = useState('farmer'); // 'farmer' or 'insurer'

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

  const handleLoginSuccess = (sessionData) => {
    setUserSession(sessionData);
    if (sessionData?.role === 'insurer') {
      setActiveView('insurer');
    } else {
      setActiveView('farmer');
    }
  };

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
      const payoutRes = await fetchPayout(polygonCoords, sumInsured, declaredCrop);

      // 4. Save Plot Record to Supabase
      const newPlotRecord = {
        id: `plot-${Date.now()}`,
        farmer_name: userSession?.name || 'Rajesh Kumar',
        district: 'Anantapur, AP',
        coordinates: polygonCoords,
        declared_crop: declaredCrop,
        area_hectares: dataPlot?.plot_metrics?.area_hectares || 1.5,
        verified_cultivated_ha: dataBoundary?.verified_area_m2 ? (dataBoundary.verified_area_m2 / 10000) : 1.38,
        hvi_score: dataPlot?.vulnerability_dossier?.overall_hvi_score || 42.5,
        risk_tier: dataPlot?.vulnerability_dossier?.risk_tier || 'MODERATE_VULNERABILITY',
        latest_vsm: dataPlot?.plot_metrics?.latest_vsm_percentage || 25.0,
        latest_smdi: dataPlot?.plot_metrics?.latest_smdi || 0.10,
        sum_insured: sumInsured,
        payout_amount: payoutRes?.payout_summary?.calculated_payout || 0,
        claim_status: payoutRes?.payout_summary?.claim_status || 'NO_CLAIM_NORMAL',
        z_score: payoutRes?.moral_hazard_benchmarking?.z_score || 0.1,
        fraud_flag: payoutRes?.moral_hazard_benchmarking?.fraud_suspension_flag || false,
        created_at: new Date().toISOString().split('T')[0]
      };
      await saveFarmerPlot(newPlotRecord);

    } catch (err) {
      setError(err.message || 'Failed to communicate with GEE physics inversion backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayout = async (coords, amount, crop) => {
    try {
      const res = await fetch(`${API_BASE}/api/hrie/verify-payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinates: coords,
          sum_insured: amount,
          declared_crop: crop
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPayoutData(data);
        return data;
      }
    } catch (err) {
      console.warn('Payout calculation API warning:', err);
    }
    return null;
  };

  const handleSumInsuredChange = (amount) => {
    setSumInsured(amount);
    if (polygonCoords && polygonCoords.length >= 3) {
      fetchPayout(polygonCoords, amount, declaredCrop);
    }
  };

  // IF NOT LOGGED IN, RENDER BEAUTIFUL AUTH UI
  if (!userSession) {
    return <AuthUI onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* NAVBAR */}
      <Navbar 
        onOpenBlueprint={() => setIsBlueprintOpen(true)} 
        activeView={activeView}
        onViewChange={setActiveView}
        userSession={userSession}
        onLogout={() => setUserSession(null)}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* VIEW 1: INSURER PORTFOLIO SUITE */}
        {activeView === 'insurer' && (
          <InsurerDashboard userSession={userSession} />
        )}

        {/* VIEW 2: FARMER 4-STEP UNDERWRITING CONSOLE */}
        {activeView === 'farmer' && (
          <div className="space-y-8">
            <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />

            {/* ERROR RETRY BANNER */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-rose-500/20 border border-rose-500/40 rounded-2xl flex flex-wrap justify-between items-center text-xs text-rose-300 gap-3 shadow-lg"
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
                    className="px-4 py-2 rounded-xl font-bold bg-rose-500 text-white hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/20 shrink-0 cursor-pointer"
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
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    currentStep === 4 
                      ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-gray-500' 
                      : 'bg-gradient-to-r from-cyan-500 to-emerald-500 border-emerald-400 text-black hover:opacity-90 shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  Next Step →
                </button>
              </div>
            )}
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
