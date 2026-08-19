import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlueprintModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-8 space-y-6 border-cyan-500/30 text-slate-200"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                📄 HRIE Physics Inversion Blueprint
              </h2>
              <p className="text-xs text-gray-400">Technical Underwriting & Physical Inversion Architecture</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6 text-sm">
            {/* Section 1 */}
            <div className="space-y-2">
              <h3 className="font-bold text-cyan-400 flex items-center gap-2">
                <span>1️⃣</span> Water Cloud Model (WCM) Canopy Stripping
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Sentinel-1 SAR C-band backscatter (VV/VH) is attenuated by dense vegetative crop canopy. HRIE uses Sentinel-2 NDVI to calculate two-way canopy attenuation (τ²) and strips out vegetation contribution (σº_veg) to isolate pure bare soil surface scattering (σº_soil).
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <h3 className="font-bold text-cyan-400 flex items-center gap-2">
                <span>2️⃣</span> Modified Dubois Model (MDM) Dielectric Inversion
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Isolated soil backscatter is passed through the Modified Dubois Model to solve for the Soil Dielectric Constant (ε), dynamically accounting for incident radar angle (θ) and residual canopy dielectric response.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-2">
              <h3 className="font-bold text-cyan-400 flex items-center gap-2">
                <span>3️⃣</span> Topp’s Polynomial Volumetric Soil Moisture (VSM %)
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Dielectric constant ε is converted to Volumetric Soil Moisture (VSM %) using Topp’s empirical third-order polynomial, accurately measuring soil water content down to 5cm root-zone depth independent of cloud cover.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <h3 className="font-bold text-cyan-400 flex items-center gap-2">
                <span>4️⃣</span> Four Safety-Lock Fraud Prevention Protocols
              </h3>
              <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-5">
                <li><strong className="text-white">Pre-Existing Condition Lock:</strong> Rejects policies drawn on fields already in bare-soil / post-harvest states ($\text{NDVI} &lt; 0.18$).</li>
                <li><strong className="text-white">Seasonal Harvest Lock:</strong> Differentiates cyclone canopy damage from standard crop harvest using ERA5 wind vector verification ($\ge 17.2\text{ m/s}$).</li>
                <li><strong className="text-white">Paddy Irrigation Lock:</strong> Distinguishes artificial irrigation flooding from true flood disasters using GPM 48h rainfall ($\ge 100\text{mm}$).</li>
                <li><strong className="text-white">5km Peer Group Z-Score Guard:</strong> Benchmarks plot soil moisture against surrounding 5km peer farms to flag localized artificial manipulation ($Z &lt; -2.5$).</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              Close Architecture Blueprint
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
