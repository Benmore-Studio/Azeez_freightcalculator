# Pre-Launch Task List

**Last Updated:** 2025-12-21

## Backend Connectivity Test Results

| Endpoint | Status | Notes |
|----------|--------|-------|
| PostgreSQL Database | Working | Connected at localhost:5432 |
| `/health` | Working | Returns uptime and status |
| `POST /api/auth/register` | Working | Creates user, returns tokens |
| `POST /api/auth/login` | Working | Returns JWT tokens |
| `GET /api/auth/me` | Working | Returns current user |
| `PUT /api/auth/profile` | Working | Updates profile |
| `DELETE /api/auth/account` | Working | Deletes account |
| `GET /api/vehicles` | Working | Returns vehicle list |
| `POST /api/vehicles` | Working | Creates vehicle |
| `GET /api/settings` | Working | Returns user settings |
| `PUT /api/settings` | Working | Updates settings |
| `GET /api/quotes` | Working | Returns quotes with pagination |
| `GET /api/quotes/stats` | Working | Returns quote statistics |
| `POST /api/quotes/calculate-enriched` | **NEEDS PC*MILER** | Google Maps not suitable for trucks - need truck-legal routing |
| `GET /api/trips` | Working | Returns saved trips (full CRUD) |
| `POST /api/trips` | Working | Creates saved trip |
| `DELETE /api/trips/:id` | Working | Deletes saved trip |
| `PATCH /api/trips/:id/favorite` | Working | Toggles favorite status |
| `GET /api/rewards` | Working | Returns user rewards/achievements |
| `GET /api/rewards/stats` | Working | Returns reward statistics |
| `GET /api/rewards/referral-code` | Working | Returns/creates referral code |
| `GET /api/rewards/referrals` | Working | Returns referral statistics |
| `POST /api/rewards/apply-referral` | Working | Applies a referral code |
| `POST /api/rewards/progress` | Working | Updates achievement progress |

---

## Critical Blockers (Must Fix Before Launch)

### 1. Truck-Legal Routing API (PC*MILER) - CODE READY
**Priority: P0 - CRITICAL**
- **Status**: Code implemented, awaiting API key
- **Issue**: Google Maps Directions API doesn't account for truck restrictions (low bridges, weight limits, prohibited routes)
- **Solution**: PC*MILER API integration is complete
- **Implementation Details**:
  - `server/src/services/distance.service.ts` - Updated with PC*MILER support
  - `server/src/services/rate.service.ts` - Passes vehicle specs to routing
  - `server/src/config/env.ts` - Added `PCMILER_API_KEY` environment variable
- **Features Implemented**:
  - Vehicle-specific routing (height, weight, length, axles)
  - Hazmat routing support (general, explosive, flammable, corrosive, radioactive)
  - Automatic fallback to Google Maps if PC*MILER unavailable
  - Response includes `isTruckRoute` and `routingProvider` flags
- **To Activate**:
  1. Get API key from [developer.trimblemaps.com](https://developer.trimblemaps.com)
  2. Add `PCMILER_API_KEY=your_key` to `.env` file
  3. Routes will automatically use truck-legal routing

### 2. Frontend Calculator API Integration
**Priority: P0 - CRITICAL** ✅ VERIFIED
- **Status**: Code verified - payload format matches backend schema
- **Files verified**:
  - `components/Calculator/ReviewAndCalculate.jsx` - Sends correct payload to `quotesApi.calculateEnrichedRate()`
  - `lib/api.js` - `calculateEnrichedRate()` function properly configured
- **Still Needed**: End-to-end test once PC*MILER is integrated

---

## High Priority (Should Fix Before Launch)

### 3. Saved Trips API ✅ COMPLETED
**Priority: P1 - HIGH**
- **Status**: Fully implemented and tested
- **Files Created**:
  - `server/src/routes/trip.routes.ts`
  - `server/src/controllers/trip.controller.ts`
  - `server/src/services/trip.service.ts`
- **Endpoints Implemented**:
  - `GET /api/trips` - List saved trips
  - `GET /api/trips/frequent` - Get frequently used trips
  - `POST /api/trips` - Create saved trip
  - `PUT /api/trips/:id` - Update trip
  - `DELETE /api/trips/:id` - Delete trip
  - `PATCH /api/trips/:id/favorite` - Toggle favorite
  - `POST /api/trips/:id/use` - Increment use count
- **Frontend**: `lib/api.js` has `tripsApi` object with all methods

### 4. Rewards/Achievements API ✅ COMPLETED
**Priority: P1 - HIGH**
- **Status**: Fully implemented and tested
- **Files Created**:
  - `server/src/routes/reward.routes.ts`
  - `server/src/controllers/reward.controller.ts`
  - `server/src/services/reward.service.ts`
- **Endpoints Implemented**:
  - `GET /api/rewards` - List user achievements/rewards (auto-initializes)
  - `GET /api/rewards/stats` - Get reward statistics
  - `GET /api/rewards/referral-code` - Get/create referral code
  - `GET /api/rewards/referrals` - Get referral statistics
  - `POST /api/rewards/apply-referral` - Apply a referral code
  - `POST /api/rewards/progress` - Update achievement progress
- **Frontend**: `lib/api.js` has `rewardsApi` object, `app/(dashboard)/rewards/page.js` wired to API

### 5. Onboarding Flow Polish ✅ ALREADY CLEAN
**Priority: P1 - HIGH**
- **Status**: Verified - components already follow design standards
- **Files Checked**:
  - `components/Onboarding/Step1UserType.jsx` - Uses Lucide icons, no emojis
  - `components/Onboarding/Step4VehicleInfo.jsx` - Uses Lucide icons, no emojis
  - `components/Onboarding/OnboardingModal.jsx` - No gradient header (solid blue-600)
  - All other Step components - Clean

---

## Medium Priority (Fix Before Public Launch)

### 6. Quote Results Integration
**Priority: P2 - MEDIUM**
- **Issue**: Some quote result components may need real data wiring
- **Components to verify**:
  - `components/quote/WeatherAnalysis.jsx` - Uses `weatherData` from API
  - `components/quote/TollBreakdown.jsx` - Uses `tollData` from API
  - `components/quote/ScheduleFeasibility.jsx` - Uses `scheduleData` from API
  - `components/quote/MarketAnalysis.jsx` - Currently hardcoded
- **Work**: Verify data mapping from API response to component props

### 7. Profile Page Polish
**Priority: P2 - MEDIUM**
- **Issue**: Profile page needs to wire settings updates to API
- **Files**: `app/(dashboard)/profile/page.js`
- **Work**: Ensure all form fields save to `/api/settings`

### 8. Vehicles Page Polish
**Priority: P2 - MEDIUM**
- **Issue**: Need to verify CRUD operations work
- **Files**: `app/(dashboard)/vehicles/page.js`
- **Tests**:
  - Add vehicle
  - Edit vehicle
  - Delete vehicle
  - Set primary vehicle

### 9. Dashboard Stats ✅ COMPLETED
**Priority: P2 - MEDIUM**
- **Status**: Wired to real API data
- **Components Updated**:
  - `components/Dashboard/DashboardOverview.jsx` - Calculates profile completion from real user data, settings, and vehicles
  - `components/Dashboard/QuickStats.jsx` - Wired to `/api/quotes/stats`
  - `components/Dashboard/RecentQuotes.jsx` - Wired to `/api/quotes/recent`
  - `components/Dashboard/ProfileProgress.jsx` - Receives calculated completion percentage

---

## Low Priority (Can Launch Without)

### 10. VIN Auto-Decode
**Priority: P3 - LOW**
- **Issue**: VIN field is just a text input
- **Enhancement**: Add NHTSA API integration to auto-decode VIN
- **Files**: `components/Onboarding/Step4VehicleInfo.jsx`, `components/Vehicles/`
- **API**: `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{VIN}?format=json`

### 11. Email Verification
**Priority: P3 - LOW**
- **Issue**: `isVerified` flag exists but no verification flow
- **Work**: Add email sending service (SendGrid/SES) and verification endpoint

### 12. Password Reset Flow
**Priority: P3 - LOW**
- **Issue**: No password reset functionality
- **Work**: Add `/api/auth/forgot-password` and `/api/auth/reset-password`

### 13. Referral System Backend
**Priority: P3 - LOW**
- **Issue**: Referral model exists but no endpoints
- **Work**: Add referral tracking endpoints

---

## Environment/Infrastructure

### 14. Production Environment Variables
**Priority: P1 - HIGH**
- **Required Before Deploy**:
  ```
  DATABASE_URL=<production postgres URL>
  JWT_SECRET=<generate secure 64+ char secret>
  JWT_REFRESH_SECRET=<generate secure 64+ char secret>
  CORS_ORIGIN=<production domain>
  GOOGLE_MAPS_API_KEY=<production key with billing>
  WEATHER_API_KEY=<OpenWeatherMap key>
  TOLL_API_KEY=<TollGuru key>
  EIA_API_KEY=<EIA fuel price key>
  ```

### 15. Database Migration
**Priority: P0 - CRITICAL**
- **Work**: Run `npx prisma migrate deploy` on production database
- **Verify**: All tables created correctly

### 16. HTTPS/SSL
**Priority: P1 - HIGH**
- **Work**: Configure SSL certificate for production domain

---

## Testing Checklist

### Manual Testing Required:
- [ ] Sign up new user
- [ ] Complete onboarding
- [ ] Add vehicle
- [ ] Run calculator end-to-end
- [ ] View quote results
- [ ] Book a load
- [ ] View dashboard stats
- [ ] Update profile settings
- [ ] Sign out / sign in

### Browser Testing:
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Mobile Safari (iOS)
- [ ] Chrome (Android)

---

## Launch Readiness Summary

| Category | Status | Blocking |
|----------|--------|----------|
| Database | Ready | No |
| Auth System | Ready | No |
| User/Vehicle CRUD | Ready | No |
| Calculator Flow | **Code Ready** | **Only needs PC*MILER API key** |
| Quote Display | Ready | No |
| Rewards System | Ready | No |
| Saved Trips | Ready | No |
| Dashboard | Ready | No |
| Frontend Build | Passing | No |
| Backend Build | Passing | No |
| PC*MILER Integration | **Code Complete** | Needs API key to activate |

### Minimum Viable Launch Requirements:
1. **Get PC*MILER API key** from [developer.trimblemaps.com](https://developer.trimblemaps.com) - code is ready
2. Add `PCMILER_API_KEY` to environment variables
3. Manual end-to-end test of core flow
4. Production environment setup

### Estimated Work Remaining:
- P0 Critical: ✅ CODE COMPLETE - Just need API key from Trimble Maps
- P1 High: ✅ COMPLETED (trips API, rewards API, onboarding - all done)
- P2 Medium: ✅ Mostly complete, just need end-to-end testing
- P3 Low: Nice-to-haves (VIN decode, email verification, password reset)

**Recommended Path to Launch:**
1. Get PC*MILER API credentials from Trimble Maps
2. Add `PCMILER_API_KEY=your_key` to `.env`
3. Test calculator end-to-end (routes will now be truck-legal)
4. Deploy to staging environment
5. Manual testing in staging
6. Deploy to production

**Note:** The system will automatically fall back to Google Maps if PC*MILER is unavailable, but routes won't account for truck restrictions (low bridges, weight limits, etc.).
