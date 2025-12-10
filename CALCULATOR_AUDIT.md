# Freight Calculator Deep-Dive Audit Report

**Audit Date:** December 9, 2025
**Auditor:** Claude Code
**Reference Document:** Freight Calculator Formuler.pdf (52-page comprehensive pricing model)

---

## Executive Summary

This audit comprehensively examines the freight rate calculator implementation against the detailed "Freight Calculator Formuler.pdf" document. The assessment covers:

1. **User Experience / Journey** - Navigation flow, efficiency, and usability
2. **User Interface** - Design quality, professionalism, and consistency
3. **Calculations** - Accuracy, completeness, and alignment with the master formula

**Overall Assessment:** The calculator has a solid 4-stage architecture with approximately 40 input fields and sophisticated backend calculation logic. However, significant gaps exist between the current implementation and the comprehensive formula document, particularly in:
- 15 cost calculations that are not implemented
- No external API integrations (despite infrastructure being configured)
- User settings schema has 30+ fields but UI only exposes ~6

---

## Part 1: User Experience / Journey Audit

### 1.1 Current Application Flow

```
Landing Page → Auth (SignIn/SignUp) → Dashboard → Rate Calculator
                                              ↓
                                          Vehicles
                                              ↓
                                          Quotes
                                              ↓
                                          Profile/Settings
```

### 1.2 Calculator Flow (4 Stages)

**Stage 1: Location (25% progress)**
- Vehicle selection from saved vehicles
- Trip selection from saved trips
- Origin/Destination entry (city, state, or ZIP)
- Airport pickup/delivery checkboxes
- TSA clearance requirement
- Deadhead miles input
- Load type toggle (Full Load / LTL)
- Equipment type selection (dry-van, refrigerated, flatbed)

**Stage 2: Load Details (50% progress)**
- Weight (lbs)
- Freight type (Dry Van, Refrigerated, Flatbed, Oversized, Hazmat, Tanker)
- Refrigerated sub-options (temperature, control mode, storage)
- Commodity description
- Oversized dimensions
- Endorsement requirement checkbox
- Military/Restricted access checkbox
- Distribution Center checkbox
- Paperwork requirement checkbox

**Stage 3: Service Requirements (75% progress)**
- Delivery date
- Delivery time window (Morning/Afternoon/Evening)
- Delivery urgency (Standard/Express/Rush/Same Day)
- Driver type (Solo/Team)
- Service level (Driver Assist/White Glove/Inside Delivery/Curbside)
- Tracking requirements (Standard/Real-time GPS/Enhanced/None)
- Special equipment checkboxes (8 options)

**Stage 4: Conditions & Environment (100% progress)**
- Weather conditions dropdown
- Season dropdown
- Fuel price input
- Destination market dropdown (Hot/Neutral/Slow)

### 1.3 UX Strengths

| Strength | Description |
|----------|-------------|
| Clear progression | Visual progress bar (25/50/75/100%) guides users through stages |
| Vehicle pre-selection | Dropdown populates from saved vehicles, auto-fills equipment type |
| Trip pre-selection | Auto-fills origin/destination from saved routes |
| Conditional rendering | Reefer options only appear when refrigerated freight selected |
| Context state management | Data persists across stages using React Context |
| Responsive design | Mobile-friendly layouts with collapsible sections |

### 1.4 UX Issues & Gaps

| Issue | Impact | Severity |
|-------|--------|----------|
| **No Quick Quote option** | Users must complete all 4 stages even for rough estimates | High |
| **No stage skipping** | Cannot jump to specific stage if only one value changed | Medium |
| **No saved defaults** | Users re-enter same vehicle/costs each time | Medium |
| **Distance not auto-calculated** | Users must know total miles (no mapping API) | Critical |
| **No route history/favorites** | Must re-type same origin/destination repeatedly | Medium |
| **Weather is manual** | Users guess weather conditions (no forecast API) | High |
| **Market data is manual** | Users select "hot/neutral/slow" (no market API) | High |
| **No live cost preview** | Users don't see impact of choices until end | Medium |
| **No stage navigation** | Cannot click completed stage to return directly | Low |

### 1.5 UX Recommendations

1. **Quick Quote Mode** - Single-page form with 4 fields (origin, destination, weight, date) using defaults
2. **Smart Pre-population** - Auto-fill from user settings, remember last routes
3. **Distance API Integration** - Auto-calculate miles from addresses
4. **Weather API Integration** - Auto-fetch forecast for delivery date
5. **Live Cost Preview** - Sticky sidebar showing running total as fields change
6. **Route Favorites** - Save frequent origin/destination pairs

---

## Part 2: User Interface Audit

### 2.1 Current Design System

The calculator follows the CLAUDE.md design guidelines:

| Element | Implementation | Status |
|---------|---------------|--------|
| Color palette | Blue-600 primary, gray neutrals, green success | Compliant |
| Typography | Geist Sans/Mono fonts, proper hierarchy | Compliant |
| Cards | White background, gray-200 borders, p-4/p-6 padding | Compliant |
| Buttons | Primary (blue-600), Secondary (gray), Outline variants | Compliant |
| Icons | Lucide React and React Icons (no emojis) | Compliant |
| Progress bar | Blue-600 fill, gray-200 background | Compliant |

### 2.2 UI Components Used

**File locations:**
- `components/Calculator/FullCalculator.jsx` - Main wrapper
- `components/Calculator/RatecalclocationEnhanced.jsx` - Stage 1
- `components/RateCalc/Ratecalcloaddetails.jsx` - Stage 2
- `components/RateCalc/Ratecalcservice.jsx` - Stage 3
- `components/RateCalc/RateCalcConditions.jsx` - Stage 4

**Shared UI components:**
- `Button` - Primary/secondary/outline variants with icons
- `Input` - Text/number/date types with helper text
- `Select` - Dropdowns with options
- `Checkbox` - Single and grouped checkboxes
- `Card` - Container with consistent styling
- `Spinner` - Loading indicator
- `ProgressBar` - Stage completion tracking

### 2.3 UI Issues Found

| Component | Issue | Fix Required |
|-----------|-------|--------------|
| Stage headers | All identical, no visual hierarchy | Add stage-specific icons/colors |
| Form density | Too much scrolling on mobile | Collapse optional sections by default |
| Progress indicator | Shows only percentage, no stage names | Add clickable stage indicators |
| Equipment checkboxes | 8 items in flat grid | Group by category (Loading, Securing, Monitoring) |
| Service level dropdown | Options lack pricing context | Add "+$X" hints inline |
| Weather dropdown | Manual, feels disconnected | Add mini forecast widget |
| Destination market | Manual selection only | Add "Auto-detect" option |

### 2.4 UI Recommendations

1. **Stage Progress Redesign**
   ```
   [1 Location ✓] → [2 Load ✓] → [3 Service •] → [4 Conditions]
   ```
   - Clickable completed stages
   - Stage-specific icons (MapPin, Package, Truck, Cloud)

2. **Collapsible Advanced Sections**
   - Hide optional fields by default
   - "Show advanced options" expansion

3. **Inline Cost Impact**
   - Show price changes next to multiplier options
   - Real-time calculation feedback

---

## Part 3: Calculations Audit

### 3.1 Master Formula (from PDF)

```
FreightCharge = (VariableCosts + OperationalCosts + StrategicAdjustments) × (1 + Margin)
```

Where:
- **VariableCosts** = Fuel + DEF + Maintenance + Tires + Tolls + Weight + Straps + Weather + Season + Altitude
- **OperationalCosts** = DC Fees + Reefer + Commodity Premium + Endorsements + Risk + Hotel + Dispatch + Insurance + Factoring + Vehicle Payment
- **StrategicAdjustments** = Deadhead + Location Strength + Market Demand + Seasonal + Risk Assessment + Load Type + Dimensions

### 3.2 Current Implementation Location

**File:** `server/src/services/rate.service.ts`

**Key Functions:**
- `calculateRate()` - Main calculation function
- `calculateServiceFees()` - Service fee breakdown
- `calculateServiceMultiplier()` - Urgency multipliers
- `getFuelPrice()` - Cached fuel price lookup

### 3.3 Variable Costs Comparison

| Cost Component | PDF Formula | Current Implementation | Gap Analysis |
|---------------|-------------|----------------------|--------------|
| **Fuel** | `(Distance / MPG) × FuelPrice` | `(fuelPrice / mpg) * totalMiles` | **Implemented** |
| **DEF** | `(Distance / 400) × DEFPrice` | Not implemented | **MISSING** - Add calculation |
| **Maintenance** | Vehicle-type CPM | `maintenanceCpm * totalMiles` | **Implemented** |
| **Tires** | Vehicle-type CPM | `tireCpm * totalMiles` | **Implemented** |
| **Tolls** | TollGuru API | Schema only, no API call | **MISSING** - Implement TollGuru |
| **Weight Adjustment** | `1.0 + (Weight - 10000) × 0.00002` | Not implemented | **MISSING** - Add multiplier |
| **Load Type** | FTL: 1.0, LTL: 0.75-0.85 | Fixed `ltl: 0.75` | **Partial** - Add variable rates |
| **Straps/Securement** | $25-100 based on load | In special equipment fees | **Implemented** |
| **Expedite** | 1.3x multiplier | `expediteMultiplier: 1.30` | **Implemented** |
| **Team Drivers** | 1.5x multiplier | `teamMultiplier: 1.50` | **Implemented** |
| **White Glove** | Flat $250 fee | `whiteGloveFee: $250` | **Implemented** |
| **Driver Assist** | Flat $100 fee | `driverAssistFee: $100` | **Implemented** |
| **Tracking** | $25-75 based on level | Fixed `trackingFee: $25` | **Partial** - Add tiers |
| **Special Equipment** | $50-200 per item | Partial item list | **Partial** - Add per-item pricing |
| **Weather** | 1.0-1.5x multiplier | `WEATHER_MULTIPLIERS` object | **Implemented** |
| **Season** | 1.0-1.2x multiplier | Not implemented | **MISSING** - Add seasonal |
| **Altitude** | `1.0 + (MaxAltitude / 50000)` | Not implemented | **MISSING** - Add altitude factor |

### 3.4 Operational Costs Comparison

| Cost Component | PDF Formula | Current Implementation | Gap Analysis |
|---------------|-------------|----------------------|--------------|
| **DC Pickup/Delivery** | $50-150 per DC | Field collected, not priced | **MISSING** - Add DC fee calculation |
| **Reefer Costs** | Fuel + maintenance/hour | `reeferFuelPerHour + reeferMaintenancePerHour` | **Implemented** |
| **Commodity Premium** | 17 categories, 1.0-1.5x | Not implemented | **MISSING** - Add commodity multipliers |
| **Endorsements** | HAZMAT +50%, TWIC +10% | Only HAZMAT (via freightClass) | **Partial** - Add TWIC, Tanker |
| **Risk Multiplier** | Military +15%, restricted +10% | Field collected, not priced | **MISSING** - Add risk calculation |
| **Hotel Costs** | `Floor(DriveHours / 11) × $150` | Not implemented | **MISSING** - Add hotel estimation |
| **Dispatch Overhead** | 5-10% of base rate | Not implemented | **MISSING** - Add dispatch fee |
| **Insurance Allocation** | Annual ÷ annual miles | `annualInsurance / annualMiles` | **Implemented** |
| **Factoring Fee** | 2-5% of invoice | In settings, not applied | **MISSING** - Apply to final rate |
| **Vehicle Payment** | Monthly ÷ monthly miles | `monthlyPayment * 12 / annualMiles` | **Implemented** |

### 3.5 Strategic Pricing Comparison

| Factor | PDF Formula | Current Implementation | Gap Analysis |
|--------|-------------|----------------------|--------------|
| **Deadhead Miles** | Deadhead × 0.5 × RPM | Flat cost calculation | **Partial** - Use 50% rate formula |
| **Location Strength** | Origin/dest market rating | Not implemented | **MISSING** - Add lane analysis |
| **Market Demand** | DAT/SONAR integration | Manual dropdown only | **MISSING** - Add market API |
| **Seasonal Adjustment** | Holiday/peak periods | Not implemented | **MISSING** - Add seasonal calendar |
| **Risk Assessment** | Load value × risk factor | Not implemented | **MISSING** - Add cargo value field |
| **FTL vs LTL** | Pricing model switch | Basic toggle with fixed multiplier | **Partial** - Enhance LTL logic |
| **Oversized/Dimensions** | Per-foot premiums | Field collected, no calc | **MISSING** - Add dimension pricing |

### 3.6 Fixed & Overhead Costs Comparison

| Cost | PDF Formula | Current Implementation | Status |
|------|-------------|----------------------|--------|
| Insurance allocation | Annual ÷ annual miles | `annualInsurance / annualMiles * totalMiles` | **Implemented** |
| Vehicle payment | Monthly × 12 ÷ annual miles | `monthlyPayment * 12 / annualMiles * totalMiles` | **Implemented** |
| Licensing per mile | Annual ÷ annual miles | `annualLicensing / annualMiles * totalMiles` | **Implemented** |
| Overhead per mile | Monthly × 12 ÷ annual miles | `monthlyOverhead * 12 / annualMiles * totalMiles` | **Implemented** |

### 3.7 Vehicle Type Defaults

**Current VEHICLE_DEFAULTS constant:**

| Vehicle Type | Base Rate/mi | MPG | Maintenance CPM | Tire CPM |
|-------------|--------------|-----|-----------------|----------|
| Semi | $2.50 | 6.5 | $0.35 | $0.05 |
| Box Truck | $2.00 | 10.0 | $0.20 | $0.03 |
| Cargo Van | $1.75 | 18.0 | $0.15 | $0.02 |
| Sprinter | $1.60 | 20.0 | $0.12 | $0.02 |
| Reefer | $3.00 | 5.5 | $0.40 | $0.06 |

### 3.8 Weather Multipliers

**Current WEATHER_MULTIPLIERS constant:**

| Condition | Multiplier |
|-----------|------------|
| Normal | 1.00 |
| Light Rain | 1.05 |
| Heavy Rain | 1.15 |
| Snow | 1.25 |
| Ice | 1.40 |
| Extreme Weather | 1.50 |
| Fog | 1.10 |

### 3.9 Calculation Summary

**Fully Implemented (12):**
- Fuel cost
- Maintenance cost
- Tire cost
- Expedite multiplier
- Team driver multiplier
- White glove service
- Driver assist
- Basic tracking
- Weather multipliers
- Insurance allocation
- Vehicle payment allocation
- Licensing allocation

**Partially Implemented (8):**
- Load type (LTL has fixed 0.75, needs variable)
- Tracking (flat $25, needs tiered)
- Special equipment (basic list, needs per-item pricing)
- DC fees (field collected, not calculated)
- Risk/Military (field collected, not applied)
- Deadhead (flat cost, needs 50% rate formula)
- FTL/LTL (basic toggle, needs enhancement)
- HAZMAT endorsement (via freight class, needs TWIC/Tanker)

**Not Implemented (15):**
- DEF (Diesel Exhaust Fluid) cost
- Tolls API integration
- Weight adjustment multiplier
- Seasonal multiplier
- Altitude factor
- Commodity premium multipliers
- TWIC/Tanker endorsements
- Hotel cost estimation
- Dispatch overhead
- Factoring fee application
- Location strength analysis
- Market data API integration
- Seasonal calendar pricing
- Cargo value/risk assessment
- Dimension/oversized pricing

---

## Part 4: User Settings Integration Audit

### 4.1 Database Schema (UserSettings)

**File:** `prisma/schema.prisma`

The UserSettings model contains 30+ fields but the UI only exposes ~6:

```prisma
model UserSettings {
  id                      String    @id @default(cuid())
  userId                  String    @unique
  user                    User      @relation(fields: [userId], references: [id])

  // Fixed costs (Annual/Monthly)
  annualInsurance         Decimal   @default(12000)
  monthlyVehiclePayment   Decimal   @default(1500)
  annualMiles             Int       @default(100000)
  annualLicensing         Decimal   @default(2500)
  monthlyOverhead         Decimal   @default(500)

  // Variable costs per mile
  maintenanceCpm          Decimal   @default(0.15)
  fuelCpm                 Decimal?
  tireCpm                 Decimal   @default(0.05)

  // Financial rates
  factoringRate           Decimal   @default(0.03)
  profitMargin            Decimal   @default(0.15)

  // Service multipliers
  expediteMultiplier      Decimal   @default(1.30)
  teamMultiplier          Decimal   @default(1.50)
  rushMultiplier          Decimal   @default(1.50)
  sameDayMultiplier       Decimal   @default(2.00)

  // Additional fees
  detentionRatePerHour    Decimal   @default(75)
  driverAssistFee         Decimal   @default(100)
  whiteGloveFee           Decimal   @default(250)
  trackingFee             Decimal   @default(25)
  specialEquipmentFee     Decimal   @default(150)
  liftgateFee             Decimal   @default(75)
  palletJackFee           Decimal   @default(50)

  // Reefer-specific
  defPricePerGallon       Decimal   @default(3.50)
  reeferMaintenancePerHour Decimal  @default(25)
  reeferFuelPerHour       Decimal   @default(1.50)

  // Configuration
  useIndustryDefaults     Boolean   @default(true)
  defaultDeadheadMiles    Int       @default(50)

  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
}
```

### 4.2 Profile/Settings Page Current State

**File:** `app/(dashboard)/profile/page.js`

**Currently displayed fields (6):**
- Truck Payment (monthly)
- Insurance (annual)
- Permits & Licenses (annual)
- Fuel Cost Per Mile
- Maintenance Per Mile
- Tires Per Mile

**Missing from UI (24+):**
- Monthly overhead
- Annual mileage estimate
- All service multipliers (expedite, team, rush, same-day)
- All service fees (detention, driver assist, white glove, tracking, equipment, liftgate, pallet jack)
- All reefer costs (DEF, maintenance, fuel)
- Financial settings (factoring rate, profit margin)
- Industry defaults toggle
- Default deadhead miles

### 4.3 Onboarding Gap Analysis

**File:** `components/Onboarding/Step3CostCalc.jsx`

**What onboarding collects:**
- Cost data source (industry defaults vs custom)
- Vehicle type selection
- Miles driven amount
- Frequency (monthly/annually)

**What's NOT mapped to schema:**
- Annual mileage doesn't map to `annualMiles`
- Fixed cost breakdown missing entirely
- Variable cost details missing
- No reefer specifications
- No service fee inputs
- No factoring rate
- No profit margin preference
- No service multiplier preferences
- No deadhead miles default

**Critical Issue:** Onboarding has `// TODO: Save to backend in T7` comment - data is never persisted!

### 4.4 Calculator-Settings Disconnect

The calculator (`FullCalculator.jsx`) does NOT:
- Fetch user settings on mount
- Pre-populate fields from settings
- Show indicator when using custom vs default settings
- Auto-fill default vehicle
- Auto-fill default fuel price

---

## Part 5: API Integration Audit

### 5.1 Configured but Not Implemented

**File:** `server/src/config/env.ts`

```typescript
apiKeys: {
  weather: parsed.data.WEATHER_API_KEY,   // OpenWeatherMap - NOT USED
  eia: parsed.data.EIA_API_KEY,            // Fuel prices - NOT USED
  toll: parsed.data.TOLL_API_KEY,          // TollGuru - NOT USED
}
```

### 5.2 Database Infrastructure Ready

**FuelPriceCache table:**
- Has `stateCode`, `fuelType`, `pricePerGallon`, `fetchedAt`, `expiresAt`
- `getFuelPrice()` function queries cache but no API populates it
- Falls back to DEFAULT_DIESEL_PRICE ($4.00/gal)

**TollCache table:**
- Has route hashing capability
- Quote model has `tolls` field (Decimal)
- Zero calculation logic exists

**Quote.weatherData field:**
- JSON field ready for weather snapshots
- Never populated

**Quote.marketData field:**
- JSON field ready for market analysis
- Never populated

### 5.3 API Integration Requirements

| API | Provider | Purpose | Priority |
|-----|----------|---------|----------|
| Distance | Google Maps or HERE | Auto-calculate miles, drive time | Critical |
| Weather | OpenWeatherMap | Auto-fetch weather conditions | High |
| Tolls | TollGuru | Route toll calculation | High |
| Fuel Prices | EIA | Real-time diesel prices by state | Medium |
| Market Data | DAT/SONAR | Load-to-truck ratios, rates | Optional |

---

## Part 6: Data Flow Analysis

### 6.1 Calculator Data Context

**File:** `context/AppContext.js`

```javascript
const [calculatorData, setCalculatorData] = useState({
  // Stage 1 - Location
  origin: "",
  destination: "",
  deadheadMiles: 0,
  loadType: "full_load",
  vehicleId: null,
  vehicleType: "semi_truck",
  equipmentType: "dry_van",

  // Stage 2 - Load Details
  weight: 0,
  freightClass: "general",
  commodity: "",
  requiresEndorsement: false,
  militaryAccess: false,
  distributionCenter: false,
  paperworkRequired: false,

  // Stage 3 - Service
  deliveryDate: "",
  deliveryTime: "",
  deliveryUrgency: "standard",
  driverType: "solo",
  serviceLevel: "driver_assist",
  trackingRequirements: "standard",
  specialEquipment: [],

  // Stage 4 - Conditions
  weatherConditions: "normal",
  season: "fall",
  fuelPrice: 3.5,
  destinationMarket: "neutral",
});
```

### 6.2 API Request Payload

**Endpoint:** `POST /api/quotes/calculate`

```json
{
  "origin": "string",
  "destination": "string",
  "vehicleType": "string",
  "vehicleId": "number | null",
  "loadType": "full_load | ltl",
  "weight": "number",
  "freightClass": "string",
  "weatherConditions": "string",
  "fuelPrice": "number",
  "deadheadMiles": "number",
  "specialServices": ["array of equipment"]
}
```

### 6.3 API Response Structure

```json
{
  "recommendedRate": 2450,
  "minRate": 2082,
  "maxRate": 2940,
  "ratePerMile": 3.77,
  "costPerMile": 2.85,
  "costBreakdown": {
    "fuelCost": 650.00,
    "maintenanceCost": 150.00,
    "tireCost": 50.00,
    "fixedCostAllocation": 1200.00,
    "serviceFees": 100.00,
    "totalCost": 2150.00
  },
  "serviceFees": {
    "liftgateFee": 75,
    "trackingFee": 25,
    "total": 100
  },
  "multipliersApplied": {
    "weather": 1.0,
    "loadType": 1.0,
    "freightClass": 1.0,
    "services": 1.0,
    "total": 1.0
  }
}
```

---

## Part 7: Quote Model Audit

### 7.1 Quote Schema Fields

**File:** `prisma/schema.prisma`

```prisma
model Quote {
  id                    String       @id @default(cuid())
  userId                String
  user                  User         @relation(fields: [userId], references: [id])
  vehicleId             String?
  vehicle               Vehicle?     @relation(fields: [vehicleId], references: [id])

  // Route information
  origin                String
  originCity            String?
  originState           String?
  originZip             String?
  originLat             Decimal?
  originLng             Decimal?
  destination           String
  destinationCity       String?
  destinationState      String?
  destinationZip        String?
  destinationLat        Decimal?
  destinationLng        Decimal?
  totalMiles            Int
  deadheadMiles         Int          @default(0)
  statesCrossed         Json?

  // Load details
  loadWeight            Int?
  loadType              LoadType     @default(full_truckload)
  freightClass          FreightClass @default(dry_van)
  commodityType         String?

  // Rates & costs
  recommendedRate       Decimal
  totalCosts            Decimal
  ratePerMile           Decimal
  costPerMile           Decimal
  profitPerMile         Decimal
  profitTotal           Decimal
  fuelPriceUsed         Decimal
  tolls                 Decimal      @default(0)

  // Service details
  serviceFees           Json?
  costBreakdown         Json?
  specialServices       Json?

  // Conditions
  weatherCondition      WeatherCondition @default(normal)
  weatherData           Json?        // NOT POPULATED
  marketData            Json?        // NOT POPULATED
  acceptanceScore       Decimal?     // NOT CALCULATED

  // Status & lifecycle
  status                QuoteStatus  @default(draft)
  expiresAt             DateTime

  // Timestamps
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
}
```

### 7.2 Quote Status Flow

```
draft → calculated → sent → accepted/rejected → booked → completed/cancelled
```

---

## Part 8: Recommendations Summary

### 8.1 Critical (Must Fix)

1. **Add 6 Missing Core Calculations**
   - DEF cost
   - Weight adjustment
   - Seasonal multiplier
   - DC fees
   - Hotel estimation
   - Factoring fee application

2. **Integrate Distance API**
   - Auto-calculate miles from addresses
   - Estimate drive time for hotel/HOS calculations

3. **Connect Calculator to User Settings**
   - Fetch settings on mount
   - Pre-populate default values

### 8.2 High Priority

4. **Integrate Weather API**
   - Auto-fetch forecast for delivery date
   - Store weather snapshot in quote

5. **Integrate Toll API**
   - Calculate tolls for specific routes
   - Cache results for performance

6. **Add Quick Quote Mode**
   - Single-page fast calculator
   - 4 required fields only

### 8.3 Medium Priority

7. **Expand Settings Page**
   - Expose all 30+ cost settings
   - Collapsible sections by category

8. **Fix Onboarding Integration**
   - Map collected data to UserSettings
   - Actually save to database

9. **Add Fuel Price API**
   - Fetch real-time diesel prices
   - Update cache daily

### 8.4 Lower Priority

10. **Add Commodity Multipliers** (17 categories)
11. **Enhance Tracking Tiers** ($25/$50/$75)
12. **Add Market Data Integration** (DAT/SONAR)
13. **UI Refresh** (stage icons, collapsible sections)
14. **Live Cost Preview** sidebar

---

## Appendix A: File Reference

### Frontend Files
- `app/(dashboard)/rate-calculator/page.js` - Route entry point
- `components/Calculator/FullCalculator.jsx` - Main calculator wrapper
- `components/Calculator/RatecalclocationEnhanced.jsx` - Stage 1
- `components/RateCalc/Ratecalcloaddetails.jsx` - Stage 2
- `components/RateCalc/Ratecalcservice.jsx` - Stage 3
- `components/RateCalc/RateCalcConditions.jsx` - Stage 4
- `components/quote/quote.jsx` - Quote display
- `context/AppContext.js` - Calculator state management
- `lib/api.js` - API client functions

### Backend Files
- `server/src/services/rate.service.ts` - Core calculation logic
- `server/src/routes/quote.routes.ts` - Quote API endpoints
- `server/src/config/env.ts` - Environment configuration
- `prisma/schema.prisma` - Database schema

### Settings Files
- `app/(dashboard)/profile/page.js` - Settings UI
- `components/Onboarding/*.jsx` - Onboarding wizard

---

## Appendix B: Test Users (from seed.js)

| User | Email | Password | Settings Profile |
|------|-------|----------|------------------|
| John Trucker | john@freightcalc.test | testpassword123 | Custom costs (useIndustryDefaults: false) |
| Sarah Fleet | sarah@freightcalc.test | testpassword123 | Industry defaults (high volume) |
| Mike Dispatch | mike@freightcalc.test | testpassword123 | Industry defaults |

---

*End of Audit Report*
