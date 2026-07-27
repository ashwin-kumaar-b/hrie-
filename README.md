# Hydro-Resilient Index Engine (HRIE) 🛰️💧

> Multi-Sensor Satellite Telemetry & Deterministic Physical Inversion Engine for Automated Agricultural Micro-Insurance Underwriting.

---

## 🌟 Overview
The **Hydro-Resilient Index Engine (HRIE)** accelerates micro-insurance claims processing by up to **80%**, replacing manual Crop Cutting Experiments (CCEs) and flat Gram Panchayat pricing with plot-level satellite radar and optical telemetry.

Ingesting **Sentinel-1 SAR**, **Sentinel-2 MSI**, **NASA GPM IMERG**, and **ECMWF ERA5**, HRIE isolates canopy attenuation using the **Water Cloud Model (WCM)**, neutralizes surface roughness via the **Modified Dubois Model (MDM)**, and computes true **Volumetric Soil Moisture (VSM %)** with **Topp's Equation**.

---

## 🚀 Key Features

1. **🛰️ Multi-Sensor Spaceborne Ingestion**:
   - **Sentinel-1 SAR C-band ($\lambda = 5.546\text{ cm}$)**: VV/VH backscatter decibel conversion & incidence angle derivation.
   - **Sentinel-2 L2A MSI**: Optical NDVI (Crop Health) & NBR (Burn Ratio) indices + real-time RGB satellite observation thumbnails.
   - **NASA GPM IMERG V06 & ECMWF ERA5**: Real-time precipitation and max wind speed vector telemetry.

2. **🌊 Physical Physics Inversion Pipeline**:
   - **Water Cloud Model (WCM)**: Eliminates vegetative canopy attenuation ($A=0.0012, B=0.0910$).
   - **Modified Dubois Model (MDM)**: Computes soil Dielectric Constant ($\epsilon$).
   - **Topp's Equation VSM Conversion**: Calculates true Volumetric Soil Moisture percentage.
   - **Soil Moisture Deficit Index (SMDI)**: Rolling 14-day temporal deficit against decadal baselines.

3. **🛡️ Multi-Hazard Safety Protocols & Anti-Fraud Locks**:
   - **🚫 Pre-Existing Harvest Lock**: Detects bare soil / post-harvest onboarding ($\text{NDVI} < 0.18$) and automatically rejects claims ($0 Payout).
   - **🌊 Flash Flood vs Paddy Irrigation Lock**: Requires GPM rain $> 100\text{mm}$ to prevent false triggers during routine paddy field flooding.
   - **🌪️ Cyclone Lodging vs Harvest Lock**: Requires ERA5 wind speed $\ge 17.2\text{ m/s}$ for $\Delta\text{NDVI} \le -0.40$ to block normal crop harvest false triggers.
   - **🛡️ 5km Spatial Peer Group Anti-Fraud Guard**: Flags target plot VSM Z-scores ($Z < -2.5$) relative to 5km peer farms to prevent moral hazard.

4. **🎨 React 18 + Framer Motion 4-Step Underwriting Journey**:
   - **Step 1: Spatial Onboarding**: Leaflet satellite map, polygon draw tool, SRTM 30m elevation, and phenology status.
   - **Step 2: Canopy & Hydrology Deep-Dive**: Live Sentinel-2 satellite RGB image + NDVI heatmap overlay, VSM %, SMDI, and dual interactive Chart.js line graphs.
   - **Step 3: Hazard & Risk Locks**: Disaster Verification Matrix + 5km Peer Group Z-score card.
   - **Step 4: Actuarial Payout**: Parametric Settlement Certificate ($P = SI \cdot \frac{I - T}{E - T}$).

---

## 💻 Tech Stack
- **Backend**: Python 3.10+, FastAPI, Google Earth Engine (`ee`), NumPy
- **Frontend**: HTML5, React 18, Framer Motion, Tailwind CSS, Leaflet.js, Chart.js

---

## ⚡ Setup & Installation

1. **Clone Repository**:
   ```bash
   git clone https://github.com/ashwin-kumaar-b/hrie-.git
   cd hrie-
   ```

2. **Install Dependencies**:
   ```bash
   pip install fastapi uvicorn earthengine-api numpy requests pydantic
   ```

3. **Run Backend Server**:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

4. **Launch Frontend**:
   Open `front.html` directly in your web browser!
