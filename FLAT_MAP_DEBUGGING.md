# Flat Map Debugging Guide

## Recent Improvements

I've added comprehensive debugging and error handling to `UsHeatmapFlat.tsx`:

### What was added:

1. **Loading Spinner** - Shows while the map initializes
2. **Error Display** - Shows any map initialization or layer errors
3. **Console Logging** - Detailed logs for debugging
4. **Better Error Handling** - Try-catch blocks around critical operations
5. **Map Height Fix** - Added `minHeight: 600px` to ensure proper display

## How to Debug

### 1. Start the dev server:
```bash
npm run dev
```

### 2. Open the browser console (F12 or Cmd+Option+I)

### 3. Navigate to: http://localhost:3000/dashboard

### 4. Click the "Flat Map" button to switch views

### 5. Watch the console for these logs:

**Expected logs:**
```
Initializing MapLibre GL map...
Map loaded successfully!
Updating map layers with data: {dataCount: 60, selectedDisaster: 'all', firstCity: {...}}
Filtered data: {count: 60}
GeoJSON features: 60
Added cities source with 60 features
Added circle layer
```

## Common Issues & Solutions

### Issue 1: "API key not configured"
**Solution:** Make sure `.env.local` exists with:
```
NEXT_PUBLIC_MAPTILER_KEY=U0otIk4zv3z0uTXId8vG
```
Then restart the dev server.

### Issue 2: Blank/white screen
**Possible causes:**
- MapTiler API key is invalid
- Network error loading tiles
- CORS issue

**Check:**
1. Browser console for errors
2. Network tab for failed requests (look for 401/403 errors from api.maptiler.com)
3. Verify your API key at: https://cloud.maptiler.com/

### Issue 3: Map loads but no data points visible
**Check:**
1. Console logs show "Added cities source with X features" where X > 0
2. Try zooming in/out - heatmap fades in/out at different zoom levels
3. Try clicking disaster type buttons to filter data

### Issue 4: Map shows but heatmap is very faint
**This is EXPECTED!** The heatmap is designed to:
- Be more visible at higher zoom levels (zoom IN to see it better)
- Fade out at zoom level 7-9 as circles appear
- Show circles instead of heatmap when zoomed in

**To see the heatmap clearly:**
1. Zoom IN on a city
2. Or switch disaster types (top buttons)
3. Look for the circle markers at high zoom

### Issue 5: "Map error: ..."
**Solution:**
1. Note the error message
2. Check if it's a network/auth error (invalid API key)
3. Try the "Reload Page" button
4. Check MapTiler service status

## Viewing the Layers

The flat map has TWO visualization modes:

### At LOW zoom (3-6):
- **Heatmap layer** is visible (blurred colored areas)
- This shows general disaster density
- Zoom IN to see more detail

### At HIGH zoom (7-10):
- **Circle layer** appears
- Heatmap fades out
- Individual cities become visible
- Hover over circles for tooltips

## Testing Checklist

- [ ] Map loads and shows a basemap
- [ ] Console shows "Map loaded successfully!"
- [ ] Console shows data being added
- [ ] Can see heatmap at low zoom
- [ ] Can see circles at high zoom
- [ ] Disaster type buttons work
- [ ] Hovering shows tooltips
- [ ] Clicking selects a city

## Still Having Issues?

Run this command and share the output:
```bash
npm run dev
```

Then check the browser console and share:
1. Any errors (red text)
2. The complete log output when switching to flat map
3. Network tab showing any failed requests

## Quick Test

Run this to verify your setup:
```bash
cat .env.local | grep MAPTILER
```

Should show: `NEXT_PUBLIC_MAPTILER_KEY=U0otIk4zv3z0uTXId8vG`

If not, create it:
```bash
echo "NEXT_PUBLIC_MAPTILER_KEY=U0otIk4zv3z0uTXId8vG" > .env.local
```

Then restart: `npm run dev`
