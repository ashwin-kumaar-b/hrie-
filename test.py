import sys

# 1. MONKEY PATCH: Fool Google's version checker so it skips scanning your OneDrive
from google.api_core import _python_version_support
_python_version_support.check_python_version = lambda *args, **kwargs: None

# 2. Now import Earth Engine safely
import ee

try:
    print("Connecting to Google Earth Engine...")
    # 3. Explicitly pass your project ID
    ee.Initialize(project='macro-truck-485506-p7')
    
    # 4. Run a tiny test to verify data transfer
    dem = ee.Image('USGS/SRTMGL1_003')
    lon_lat = ee.Geometry.Point([86.9250, 27.9881]) # Mt. Everest
    pixel_data = dem.reduceRegion(
        reducer=ee.Reducer.first(),
        geometry=lon_lat,
        scale=30
    )
    
    print("\n Success! Local connection verified.")
    print("Fetched Mount Everest Elevation (meters):", pixel_data.getInfo().get('elevation'))

except Exception as e:
    print("\n Connection Failed!")
    print(f"Error details: {e}")
