import ee

ee.Initialize(project='macro-truck-485506-p7')

# Define target location and date range
point = ee.Geometry.Point([80.2707, 13.0827])  # [longitude, latitude]
start_date = '2024-01-01'
end_date = '2024-03-30'

# Fetch Sentinel-2 Harmonized Surface Reflectance
s2 = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterBounds(point)
      .filterDate(start_date, end_date)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
      .first())

# Calculate Normalized Difference Vegetation Index (NDVI)
# NDVI = (NIR - RED) / (NIR + RED) -> Bands B8 and B4 in Sentinel-2
ndvi = s2.normalizedDifference(['B8', 'B4']).rename('NDVI')

# Sample NDVI at the point
ndvi_value = ndvi.reduceRegion(
    reducer=ee.Reducer.mean(),
    geometry=point,
    scale=10
).getInfo()

print("Vegetation Index (NDVI):", ndvi_value.get('NDVI'))