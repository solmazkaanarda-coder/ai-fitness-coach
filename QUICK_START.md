# Quick Start - Test the Fix

## The Issue (Fixed ✅)
App was freezing after "Create Plan" button due to theme names mismatch.

## The Root Cause (Explained ✅)
Frontend was using wrong theme identifiers: "dark", "blue", "wellness"  
Should be: "darkFuture", "aquaCore", "sandElite"

## Testing Now

### Step 1: Start Backend
```bash
cd /Users/duke390/ai-fitness-coach/backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Step 2: Start Frontend (New Terminal)
```bash
cd /Users/duke390/ai-fitness-coach
npm start
```

### Step 3: Open Expo Go
- Scan QR code or click link
- App opens on your phone

### Step 4: View Console Logs
- **iOS**: Press `i` in terminal
- **Android**: Press `a` in terminal
- Logs appear in terminal or Expo Go app console

### Step 5: Test Flow
1. Welcome → Get Started
2. Account → Fill name/email or use defaults → Continue
3. Personal → Age/Height/Weight/Gender/Goal → Continue
4. Security → Face ID options → Continue
5. Plan → Select Free or Premium → **Create Plan**

### Step 6: Watch Console
**Frontend console should show**:
```
[CREATE PLAN] Starting plan creation...
[CREATE PLAN] Payload ready: {...}
[CREATE PLAN] Calling POST /create-plan...
[POST START] Endpoint: /create-plan, Retries: 2
[WAKE BACKEND] Pinging http://192.168.1.9:8000/health...
[WAKE BACKEND] Health check successful: {...}
[POST] Backend ready, proceeding with POST to /create-plan
[POST] Attempt 1/3: Sending to /create-plan
[POST] Response received: status=200
[POST] Response body length: xxx chars
[POST] Successfully parsed JSON response
[CREATE PLAN] SUCCESS! Response received: {...}
[CREATE PLAN] Set dashboard state
[CREATE PLAN] Reset water to 0
[CREATE PLAN] Transitioning to theme screen...
[CREATE PLAN] Screen state changed to 'theme'
```

### Step 7: Theme Screen Appears
✅ Theme screen should appear with 3 options:
- Dark Future (selected by default)
- Aqua Core
- Sand Elite

✅ Each theme option shows correctly styled

✅ Select a theme → checkmark appears

✅ Click "Continue" → Dashboard appears

## If It Still Hangs

### Check 1: Backend Running?
```bash
curl http://192.168.1.9:8000/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Backend is awake",
  "time": "2026-05-13T14:23:45..."
}
```

### Check 2: Correct IP Address?
Get your IP:
```bash
ipconfig getifaddr en0
```

Update API_URL in `app/(tabs)/index.tsx` line 18 if needed:
```typescript
const API_URL = "http://192.168.1.9:8000"; // Your IP:port
```

### Check 3: Console Logs?
Make sure you're viewing the right console:
- **Expo Go**: Press `i` or `a` in terminal
- **Or**: Open Expo Go app → More → Device Logs
- **Or**: Browser console if testing on web

### Check 4: Old Code?
Clear cache:
```bash
# Frontend
Ctrl+C
npm start

# Expo Go
Quit app, reload
```

## Expected Time

- Backend health check: ~1s
- Plan creation calculation: ~1-2s
- Total: 2-3 seconds from clicking "Create Plan" to theme screen

## Success Indicators

✅ Logs appear in console with [CREATE PLAN] prefix  
✅ Backend returns 200 status  
✅ Theme screen appears within 3 seconds  
✅ Theme colors are correct (matches selected theme)  
✅ Can select different themes  
✅ Dashboard appears after clicking Continue  

## Debug Info to Collect If Issues

If it still doesn't work, collect:
1. Full frontend console output
2. Full backend console output
3. Your IP address (ipconfig getifaddr en0)
4. Error message from Alert (if appears)
5. Exact step where it stops

---

## File Changes Summary

**Frontend**: `app/(tabs)/index.tsx`
- Line 18: API_URL (verify this matches your IP)
- Lines 346-369: wakeBackend() - added logging
- Lines 376-449: post() - added comprehensive logging
- Lines 544-597: createPlan() - added step-by-step logging
- Lines 839-900: Theme screen - fixed theme names to "darkFuture", "aquaCore", "sandElite"

**Backend**: `backend/main.py`
- Lines 1-9: Added logging module
- Lines 97-134: /create-plan - added logging
- Lines 41-50: /health - added logging
- Lines 160-174: /dashboard - added logging

---

## Next Steps After Testing

If testing works:
1. ✅ Theme system is fixed
2. ✅ Create plan flow works end-to-end
3. ✅ Backend communication verified
4. ✅ Ready to continue with other features

If testing fails:
1. Check logs carefully
2. Verify backend is running
3. Verify IP address
4. Try clearing cache
5. See ROOT_CAUSE_ANALYSIS.md for detailed troubleshooting

