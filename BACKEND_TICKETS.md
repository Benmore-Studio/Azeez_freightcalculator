# Backend Tickets - Freight Calculator MVP

> **Project:** Azeez Freight Calculator
> **Repo:** Benmore-Studio/Azeez_freightcalculator
> **Scope:** Backend API and calculation engine for freight rate calculator
> **Reference:** Freight Calculator Formuler.pdf (52 pages)

---

## Epic 1: Database & Core Infrastructure

### B1: Design PostgreSQL Database Schema

**Priority:** HIGH
**Estimate:** 1 day
**Labels:** `backend`, `database`, `infrastructure`

#### Description
Design and document the PostgreSQL database schema for the freight calculator application. This is the foundation for all backend functionality.

#### Tables Required

**users**
- id, email, password_hash, name, phone, company_name
- user_type (owner_operator, fleet_manager, dispatcher)
- created_at, updated_at

**vehicles**
- id, user_id (FK), name, vin, year, make, model
- vehicle_type (semi, box_truck, cargo_van, sprinter, reefer)
- mpg, axle_count, has_sleeper
- created_at, updated_at

**user_settings**
- id, user_id (FK)
- annual_insurance, monthly_vehicle_payment, annual_miles
- maintenance_cpm, annual_licensing, monthly_overhead
- factoring_rate, profit_margin
- expedite_multiplier, team_multiplier
- detention_rate_per_hour, driver_assist_fee, white_glove_fee
- tracking_fee, special_equipment_fee
- def_price_per_gallon, reefer_maintenance_per_hour
- use_industry_defaults (boolean)
- created_at, updated_at

**quotes**
- id, user_id (FK), vehicle_id (FK)
- origin_address, origin_lat, origin_lng, origin_state
- destination_address, destination_lat, destination_lng, destination_state
- total_miles, deadhead_miles, loaded_miles
- states_crossed (JSON array)
- load_weight, load_type, commodity_type
- is_expedite, is_team, is_reefer, reefer_mode
- weather_condition, pickup_date, delivery_date
- service_fees (JSON), cost_breakdown (JSON)
- total_rate, rpm, cpm, profit_per_mile
- tolls, fuel_cost, created_at

**fuel_price_cache**
- id, state_code, price_per_gallon
- source (eia), fetched_at

**toll_cache**
- id, origin_hash, destination_hash, vehicle_type
- toll_amount, route_data (JSON)
- fetched_at, expires_at

#### Acceptance Criteria
- [ ] ERD diagram created
- [ ] All tables documented with column types and constraints
- [ ] Indexes defined for common queries (user_id, created_at, etc.)
- [ ] Foreign key relationships established
- [ ] JSON column structures documented

---

### B2: Set Up Database Migrations and Seed Data

**Priority:** HIGH
**Estimate:** 0.5 day
**Labels:** `backend`, `database`, `infrastructure`
**Depends on:** B1

#### Description
Create database migration files and seed data for development/testing.

#### Tasks
- Set up migration tool (Prisma)
- Create migration files for all tables from B1
- Create seed data with:
  - Test user accounts
  - Sample vehicles (semi, box truck, cargo van)
  - Industry default settings
  - Sample quotes for testing

#### Acceptance Criteria
- [ ] Migrations run successfully on fresh database
- [ ] Migrations are reversible (down migrations work)
- [ ] Seed data creates realistic test scenarios
- [ ] README updated with migration commands

---

### B3: Express.js API Foundation with JWT Auth

**Priority:** HIGH
**Estimate:** 1 day
**Labels:** `backend`, `infrastructure`, `auth`

#### Description
Set up the Express.js API server with JWT authentication middleware.

#### Tasks
- Initialize Express.js project with TypeScript (optional but recommended)
- Set up folder structure:
  ```
  /src
    /routes
    /controllers
    /services
    /middleware
    /utils
    /config
  ```
- Configure environment variables (DATABASE_URL, JWT_SECRET, API keys)
- Implement JWT authentication middleware
- Set up error handling middleware
- Configure CORS for frontend
- Add request logging (Morgan or similar)
- Health check endpoint

#### Acceptance Criteria
- [ ] Server starts without errors
- [ ] Protected routes reject requests without valid JWT
- [ ] Protected routes accept requests with valid JWT
- [ ] Error responses follow consistent format
- [ ] Environment variables properly loaded
- [ ] Health check returns 200 OK

---

### B4: User Registration and Login Endpoints

**Priority:** HIGH
**Estimate:** 1 day
**Labels:** `backend`, `auth`, `api`
**Depends on:** B2, B3

#### Description
Implement user authentication endpoints.

#### Endpoints

**POST /api/auth/register**
```json
Request:
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "555-123-4567",
  "company_name": "ABC Trucking",
  "user_type": "owner_operator"
}

Response (201):
{
  "user": { "id": "uuid", "email": "...", "name": "..." },
  "token": "jwt_token"
}
```

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "user": { "id": "uuid", "email": "...", "name": "..." },
  "token": "jwt_token"
}
```

**GET /api/auth/me** (Protected)
- Returns current user profile

**POST /api/auth/logout**
- Invalidates token (if using token blacklist)

#### Acceptance Criteria
- [ ] Passwords hashed with bcrypt (min 10 rounds)
- [ ] Email validation (format and uniqueness)
- [ ] Password requirements enforced (min 8 chars)
- [ ] JWT expires after 7 days
- [ ] Login fails with wrong password (401)
- [ ] Duplicate email returns 409 Conflict

---

### B5: User Settings CRUD Endpoints

**Priority:** HIGH
**Estimate:** 0.5 day
**Labels:** `backend`, `api`
**Depends on:** B4

#### Description
Endpoints for managing user operating cost settings.

#### Endpoints

**GET /api/settings** (Protected)
- Returns user's current settings
- If no settings exist, return industry defaults with `use_industry_defaults: true`

**PUT /api/settings** (Protected)
```json
Request:
{
  "annual_insurance": 14400,
  "monthly_vehicle_payment": 2200,
  "annual_miles": 120000,
  "maintenance_cpm": 0.35,
  "annual_licensing": 1200,
  "monthly_overhead": 500,
  "factoring_rate": 0.03,
  "profit_margin": 0.15,
  "expedite_multiplier": 1.25,
  "team_multiplier": 1.30,
  "detention_rate_per_hour": 40,
  "driver_assist_fee": 75,
  "white_glove_fee": 200,
  "tracking_fee": 5,
  "special_equipment_fee": 50,
  "def_price_per_gallon": 3.50,
  "reefer_maintenance_per_hour": 2,
  "use_industry_defaults": false
}
```

**POST /api/settings/reset-defaults** (Protected)
- Resets all settings to industry defaults

#### Industry Defaults (by vehicle type)
| Setting | Semi | Box Truck | Cargo Van |
|---------|------|-----------|-----------|
| maintenance_cpm | 0.35 | 0.20 | 0.15 |
| annual_miles | 120000 | 50000 | 75000 |

#### Acceptance Criteria
- [ ] Settings persist to database
- [ ] Industry defaults returned if no custom settings
- [ ] Validation on numeric fields (positive numbers, valid ranges)
- [ ] Reset endpoint restores all defaults

---

## Epic 2: Vehicle Management

### B6: NHTSA VIN Decode API Integration

**Priority:** MEDIUM
**Estimate:** 1 day
**Labels:** `backend`, `integration`, `api`

#### Description
Integrate with NHTSA VIN Decoder API to auto-populate vehicle specifications.

#### API Details
- **Endpoint:** `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{VIN}?format=json`
- **Rate Limit:** 5 requests/second (free)
- **No API key required**

#### Data to Extract
- Year
- Make
- Manufacturer
- Model
- Vehicle Type
- GVWR (Gross Vehicle Weight Rating)
- Engine Displacement
- Fuel Type

#### Service Function
```javascript
async function decodeVIN(vin: string): Promise<VehicleSpecs | null> {
  // Call NHTSA API
  // Parse response for relevant fields
  // Map to our vehicle schema
  // Return null if decode fails
}
```

#### MPG Lookup Table
Since NHTSA doesn't provide MPG, use defaults by vehicle type:
| Vehicle Type | Default MPG |
|--------------|-------------|
| Semi (Class 8) | 6.5 |
| Box Truck (Class 6-7) | 8 |
| Cargo Van | 12 |
| Sprinter | 15 |

#### Acceptance Criteria
- [ ] VIN decode returns make/model/year
- [ ] Invalid VINs handled gracefully
- [ ] Rate limiting respected (queue requests if needed)
- [ ] Fallback to manual entry if API fails
- [ ] MPG populated based on vehicle type

---

### B7: Vehicle CRUD Endpoints

**Priority:** HIGH
**Estimate:** 1 day
**Labels:** `backend`, `api`
**Depends on:** B4, B6

#### Description
Endpoints for managing user vehicles.

#### Endpoints

**GET /api/vehicles** (Protected)
- Returns all vehicles for current user

**GET /api/vehicles/:id** (Protected)
- Returns single vehicle (owned by user)

**POST /api/vehicles** (Protected)
```json
Request:
{
  "name": "Main Truck",
  "vin": "1XKAD49X24J123456",  // Optional - triggers VIN decode
  "year": 2020,                // Required if no VIN
  "make": "Freightliner",
  "model": "Cascadia",
  "vehicle_type": "semi",
  "mpg": 6.5,
  "axle_count": 5,
  "has_sleeper": true
}

Response (201):
{
  "id": "uuid",
  "name": "Main Truck",
  "vin": "1XKAD49X24J123456",
  "year": 2020,
  "make": "Freightliner",
  "model": "Cascadia",
  "vehicle_type": "semi",
  "mpg": 6.5,
  "axle_count": 5,
  "has_sleeper": true,
  "vin_decoded": true
}
```

**PUT /api/vehicles/:id** (Protected)
- Update vehicle details
- Re-decode VIN if VIN field changed

**DELETE /api/vehicles/:id** (Protected)
- Soft delete or hard delete (decide)

#### Acceptance Criteria
- [ ] Users can only access their own vehicles
- [ ] VIN provided triggers auto-decode, populates fields
- [ ] Manual entry works without VIN
- [ ] Vehicle type validated against enum
- [ ] MPG defaults applied if not provided

---

### B8: Vehicle Type Defaults Service

**Priority:** MEDIUM
**Estimate:** 0.5 day
**Labels:** `backend`, `service`

#### Description
Create a service that provides industry-standard defaults based on vehicle type.

#### Default Values

```javascript
const VEHICLE_DEFAULTS = {
  semi: {
    mpg: 6.5,
    maintenance_cpm: 0.35,
    annual_miles: 120000,
    axle_count: 5,
    def_consumption_rate: 0.025
  },
  box_truck: {
    mpg: 8,
    maintenance_cpm: 0.20,
    annual_miles: 50000,
    axle_count: 2,
    def_consumption_rate: 0.025
  },
  cargo_van: {
    mpg: 12,
    maintenance_cpm: 0.15,
    annual_miles: 75000,
    axle_count: 2,
    def_consumption_rate: 0
  },
  sprinter: {
    mpg: 15,
    maintenance_cpm: 0.15,
    annual_miles: 75000,
    axle_count: 2,
    def_consumption_rate: 0
  },
  reefer: {
    mpg: 6.0,
    maintenance_cpm: 0.40,
    annual_miles: 120000,
    axle_count: 5,
    def_consumption_rate: 0.025,
    reefer_gal_per_hour: 1.0
  }
};
```

#### Acceptance Criteria
- [ ] Defaults exported as constants
- [ ] Used in vehicle creation when values not provided
- [ ] Used in settings reset-to-defaults

---

## Epic 3: External API Integrations

### B9: Google Maps Distance Matrix Integration

**Priority:** HIGH
**Estimate:** 1 day
**Labels:** `backend`, `integration`, `maps`

#### Description
Integrate Google Maps Distance Matrix API for calculating route distance and duration.

#### API Details
- **Endpoint:** `https://maps.googleapis.com/maps/api/distancematrix/json`
- **Pricing:** $5 per 1,000 requests (first 40,000/month free)
- **Required params:** origins, destinations, key

#### Service Function
```javascript
async function getDistance(
  origin: string | LatLng,
  destination: string | LatLng
): Promise<{
  distance_miles: number;
  duration_minutes: number;
  duration_text: string;
}>
```

#### Considerations
- Cache results for identical origin/destination pairs
- Handle API errors gracefully
- Convert meters to miles (API returns meters)

#### Acceptance Criteria
- [ ] Returns distance in miles
- [ ] Returns duration in minutes
- [ ] Handles address strings and lat/lng
- [ ] Returns meaningful error if route not found
- [ ] API key stored securely in env vars

---

### B10: Google Maps Directions API (Route Geometry)

**Priority:** HIGH
**Estimate:** 0.5 day
**Labels:** `backend`, `integration`, `maps`

#### Description
Get route polyline to determine which states the route passes through.

#### API Details
- **Endpoint:** `https://maps.googleapis.com/maps/api/directions/json`
- Returns encoded polyline of route

#### Service Function
```javascript
async function getRouteGeometry(
  origin: string,
  destination: string
): Promise<{
  polyline: string;          // Encoded polyline
  waypoints: LatLng[];       // Decoded points along route
  bounds: { ne: LatLng, sw: LatLng };
}>
```

#### Tasks
- Call Directions API
- Decode polyline into lat/lng points
- Sample points every ~50 miles for state detection

#### Acceptance Criteria
- [ ] Returns decoded waypoints along route
- [ ] Polyline decoded correctly
- [ ] Error handling for invalid routes

---

### B11: EIA Fuel Price API Integration

**Priority:** HIGH
**Estimate:** 1 day
**Labels:** `backend`, `integration`, `fuel`

#### Description
Integrate with EIA.gov API to get current diesel fuel prices by state.

#### API Details
- **Endpoint:** `https://api.eia.gov/v2/petroleum/pri/gnd/data`
- **API Key:** Free, required (register at eia.gov)
- **Update frequency:** Weekly
- **Data:** State-level retail diesel prices

#### Service Function
```javascript
async function getFuelPrices(): Promise<Map<string, number>>
// Returns: { "TX": 3.45, "CA": 4.89, ... }

async function getFuelPriceForState(stateCode: string): Promise<number>
```

#### Caching Strategy
- Cache prices in `fuel_price_cache` table
- Refresh if data older than 24 hours
- Fallback to national average if state not found

#### Acceptance Criteria
- [ ] Fetches current diesel prices by state
- [ ] Caches results in database
- [ ] Returns cached data if fresh (< 24 hours)
- [ ] Fallback to national average for missing states
- [ ] API key stored in env vars

---

### B12: Multi-State Fuel Price Calculation

**Priority:** HIGH
**Estimate:** 1.5 days
**Labels:** `backend`, `calculation`, `fuel`
**Depends on:** B10, B11

#### Description
Calculate weighted average fuel price based on miles traveled in each state along the route.

#### Algorithm
1. Get route geometry (waypoints) from B10
2. For each segment between waypoints:
   - Reverse geocode to get state
   - Calculate segment distance
3. Group miles by state
4. Get fuel price for each state (B11)
5. Calculate weighted average:
   ```
   avg_price = Σ(state_price × state_miles) / total_miles
   ```

#### Service Function
```javascript
async function calculateRouteFuelPrice(
  origin: string,
  destination: string
): Promise<{
  weighted_avg_price: number;
  states_crossed: Array<{
    state: string;
    miles: number;
    price_per_gallon: number;
  }>;
  total_miles: number;
}>
```

#### Edge Cases
- Route stays within single state
- Route zigzags across state borders
- State price not available (use national avg)

#### Acceptance Criteria
- [ ] Correctly identifies all states on route
- [ ] Calculates miles per state accurately (±5%)
- [ ] Weighted average matches manual calculation
- [ ] Handles single-state routes
- [ ] Returns state breakdown for transparency

---

### B13: TollGuru API Integration

**Priority:** HIGH
**Estimate:** 1.5 days
**Labels:** `backend`, `integration`, `tolls`

#### Description
Integrate TollGuru API to calculate toll costs for routes.

#### API Details
- **Docs:** https://tollguru.com/developers/docs
- **Endpoint:** `https://apis.tollguru.com/toll/v2/complete-polyline-from-mapping-service`
- **Pricing:** Pay per request (~$0.02-0.05)

#### Request Format
```json
{
  "source": "google",
  "polyline": "encoded_polyline_from_google",
  "vehicleType": "2AxlesAuto",  // Map our types to TollGuru types
  "departure_time": 1234567890
}
```

#### Vehicle Type Mapping
| Our Type | TollGuru Type |
|----------|---------------|
| cargo_van | 2AxlesAuto |
| sprinter | 2AxlesAuto |
| box_truck | 2AxlesTruck |
| semi (5 axle) | 5AxlesTruck |

#### Service Function
```javascript
async function calculateTolls(
  polyline: string,
  vehicleType: string,
  departureTime?: Date
): Promise<{
  total_tolls: number;
  toll_locations: Array<{
    name: string;
    cost: number;
    lat: number;
    lng: number;
  }>;
  has_ferry: boolean;
  ferry_cost: number | null;  // null = unknown, user must add
}>
```

#### Caching Strategy
- Cache toll results by route hash + vehicle type
- Expire after 7 days (toll prices don't change often)

#### Acceptance Criteria
- [ ] Returns total toll cost for route
- [ ] Maps vehicle types correctly
- [ ] Detects if ferry is required (flag for user)
- [ ] Caches results to reduce API costs
- [ ] Handles API errors gracefully

---

### B14: API Rate Limiting and Error Handling

**Priority:** MEDIUM
**Estimate:** 1 day
**Labels:** `backend`, `infrastructure`

#### Description
Implement rate limiting and robust error handling for all external API calls.

#### Rate Limiting
- Google Maps: 50 requests/second (unlikely to hit)
- NHTSA VIN: 5 requests/second (needs queue)
- EIA: Low volume, no limit
- TollGuru: Based on plan

#### Implementation
```javascript
// Use p-queue or similar for rate limiting
import PQueue from 'p-queue';

const nhtsaQueue = new PQueue({
  intervalCap: 5,
  interval: 1000
});

// Wrap NHTSA calls
async function decodeVIN(vin: string) {
  return nhtsaQueue.add(() => callNHTSAApi(vin));
}
```

#### Error Handling
- Retry with exponential backoff (3 attempts)
- Circuit breaker for repeated failures
- Fallback strategies for each API
- Structured error responses

#### Acceptance Criteria
- [ ] NHTSA rate limit respected
- [ ] Failed requests retry up to 3 times
- [ ] Permanent failures return meaningful error
- [ ] API outages don't crash the server
- [ ] Fallback values used when appropriate

---

## Epic 4: Calculation Engine

### B15: Core Freight Rate Calculation Service

**Priority:** HIGH
**Estimate:** 2 days
**Labels:** `backend`, `calculation`, `core`
**Depends on:** B5, B12, B13

#### Description
Main orchestration service that calculates complete freight rate using all inputs.

#### Input Schema
```typescript
interface CalculationInput {
  // Route
  origin: string;
  destination: string;
  deadhead_miles?: number;

  // Vehicle
  vehicle_id: string;

  // Load details
  weight_lbs: number;
  load_type: 'palletized' | 'floor_loaded';
  commodity_type: 'general' | 'electronics' | 'refrigerated' | 'hazmat' | 'military';

  // Service options
  is_expedite: boolean;
  is_team: boolean;           // Only for semi
  is_dc_pickup: boolean;
  is_dc_delivery: boolean;
  is_reefer: boolean;
  reefer_mode?: 'continuous' | 'cycle';

  // Additional services
  driver_assist: boolean;
  white_glove: boolean;
  extra_straps: number;       // Beyond standard 3
  special_equipment: boolean;

  // Conditions
  weather_condition: 'normal' | 'moderate' | 'severe';

  // Dates (for seasonal info)
  pickup_date: Date;
  delivery_date: Date;
}
```

#### Output Schema
```typescript
interface CalculationResult {
  // Totals
  total_rate: number;
  rpm: number;                // Revenue per mile
  cpm: number;                // Cost per mile
  profit_per_mile: number;
  profit_margin_pct: number;

  // Miles breakdown
  total_miles: number;
  loaded_miles: number;
  deadhead_miles: number;
  states_crossed: string[];

  // Cost breakdown
  breakdown: {
    fuel_cost: number;
    def_cost: number;
    toll_cost: number;
    maintenance_cost: number;
    insurance_cost: number;
    vehicle_cost: number;
    licensing_cost: number;
    overhead_cost: number;
    reefer_cost: number;
    service_fees: {
      expedite_premium: number;
      team_premium: number;
      dc_detention: number;
      driver_assist: number;
      white_glove: number;
      extra_straps: number;
      special_equipment: number;
      tracking: number;
    };
    commodity_premium: number;
    weather_adjustment: number;
    factoring_fee: number;
    profit: number;
  };

  // Metadata
  fuel_price_used: number;    // Weighted average
  mpg_used: number;           // After weight adjustment
  has_ferry: boolean;
  warnings: string[];         // e.g., "Ferry required - add cost manually"
}
```

#### Calculation Pipeline
1. Fetch user settings
2. Fetch vehicle details
3. Calculate route (miles, states, tolls)
4. Calculate fuel cost (weighted by state)
5. Calculate variable costs
6. Calculate fixed costs (per mile)
7. Calculate service fees
8. Apply multipliers (expedite, team, commodity, weather)
9. Apply profit margin
10. Generate breakdown

#### Acceptance Criteria
- [ ] Handles all input combinations
- [ ] Returns complete breakdown
- [ ] Warnings for edge cases (ferry, etc.)
- [ ] Matches formula document calculations
- [ ] Performance: < 3 seconds for full calculation

---

### B16: Variable Costs Module

**Priority:** HIGH
**Estimate:** 1 day
**Labels:** `backend`, `calculation`
**Depends on:** B12, B13

#### Description
Calculate all trip-dependent variable costs.

#### Formulas (from formula doc)

**Fuel Cost:**
```
fuel_gallons = total_miles / adjusted_mpg
fuel_cost = fuel_gallons × weighted_avg_fuel_price
```

**DEF Cost:**
```
def_gallons = fuel_gallons × 0.025
def_cost = def_gallons × def_price_per_gallon
```

**Maintenance:**
```
maintenance_cost = total_miles × maintenance_cpm
```

**Tolls:**
```
toll_cost = TollGuru API result
```

**Weather Multiplier:**
```
normal: 1.0
moderate: 1.08
severe: 1.20
```

#### Service Function
```javascript
function calculateVariableCosts(
  miles: number,
  mpg: number,
  fuelPrice: number,
  defPrice: number,
  maintenanceCPM: number,
  tolls: number,
  weatherCondition: string
): VariableCosts
```

#### Acceptance Criteria
- [ ] Fuel calculation matches formula
- [ ] DEF at 2.5% of fuel gallons
- [ ] Weather multiplier applied correctly
- [ ] All costs returned in breakdown

---

### B17: Fixed Costs Module

**Priority:** HIGH
**Estimate:** 0.5 day
**Labels:** `backend`, `calculation`

#### Description
Calculate per-mile allocation of fixed/overhead costs.

#### Formulas

**Insurance CPM:**
```
insurance_cpm = annual_insurance / annual_miles
insurance_per_trip = insurance_cpm × total_miles
```

**Vehicle CPM:**
```
vehicle_cpm = (monthly_vehicle_payment × 12) / annual_miles
vehicle_per_trip = vehicle_cpm × total_miles
```

**Licensing CPM:**
```
licensing_cpm = annual_licensing / annual_miles
licensing_per_trip = licensing_cpm × total_miles
```

**Overhead CPM:**
```
overhead_cpm = (monthly_overhead × 12) / annual_miles
overhead_per_trip = overhead_cpm × total_miles
```

#### Acceptance Criteria
- [ ] All fixed costs converted to CPM correctly
- [ ] Per-trip costs calculated from CPM × miles
- [ ] Uses user settings or industry defaults

---

### B18: Service Fees Module

**Priority:** HIGH
**Estimate:** 0.5 day
**Labels:** `backend`, `calculation`

#### Description
Calculate all optional service fees and premiums.

#### Fees (from user settings)

| Fee | Calculation |
|-----|-------------|
| Expedite | base_cost × expedite_multiplier (default 1.25) |
| Team | base_cost × team_multiplier (default 1.30) |
| DC Detention | 2.5 hrs × detention_rate × (pickup_dc + delivery_dc) |
| Driver Assist | flat fee if enabled |
| White Glove | flat fee if enabled |
| Extra Straps | $10 × count (beyond 3 standard) |
| Special Equipment | flat fee if enabled |
| Tracking | flat fee per trip |
| Floor Loaded | +$75 if load_type = floor_loaded |

#### Special Rules
- For semi trucks: Team = Expedite (don't double-count)
- DC detention applies per stop (pickup and/or delivery)

#### Acceptance Criteria
- [ ] All fees calculated per user settings
- [ ] Expedite/Team not stacked for semi
- [ ] DC detention multiplied by number of DC stops

---

### B19: Weight-Based MPG Adjustment

**Priority:** MEDIUM
**Estimate:** 0.5 day
**Labels:** `backend`, `calculation`

#### Description
Adjust vehicle MPG based on load weight.

#### Formula (from formula doc)
```
For every 1,000 lb added, MPG drops by ~0.5-1%

adjusted_mpg = base_mpg × (1 - (load_weight / 1000) × 0.0005)
```

#### Example
- Base MPG: 8
- Load: 30,000 lb
- Adjustment: 30 × 0.0005 = 0.015 = 1.5%
- Adjusted MPG: 8 × (1 - 0.015) = 7.88

#### Acceptance Criteria
- [ ] MPG decreases as weight increases
- [ ] Minimum MPG floor (don't go below 50% of base)
- [ ] No adjustment for empty/light loads

---

### B20: Weather Multiplier Application

**Priority:** MEDIUM
**Estimate:** 0.5 day
**Labels:** `backend`, `calculation`

#### Description
Apply weather-based cost multiplier.

#### Multipliers (from formula doc)
| Condition | Fuel Impact |
|-----------|-------------|
| Normal | 0% |
| Moderate (rain/light snow) | +8% |
| Severe (storm/heavy snow) | +20% |

#### Application
Apply multiplier to fuel cost only (not entire rate):
```
adjusted_fuel_cost = fuel_cost × weather_multiplier
```

#### Acceptance Criteria
- [ ] Multiplier applied to fuel cost
- [ ] Three weather levels supported
- [ ] Default to "normal" if not specified

---

### B21: Commodity Premium Calculation

**Priority:** MEDIUM
**Estimate:** 0.5 day
**Labels:** `backend`, `calculation`

#### Description
Apply premium based on commodity type.

#### Premiums (from formula doc)
| Commodity | Premium |
|-----------|---------|
| General freight | 0% |
| Electronics / High value | +10% |
| Refrigerated perishables | +10% (plus reefer costs) |
| Hazmat / Chemicals | +20% |
| Military / Sensitive | +20% |

#### Application
```
commodity_premium = base_cost × commodity_factor
```

#### Acceptance Criteria
- [ ] Correct premium for each commodity type
- [ ] Reefer loads get premium PLUS reefer operating costs
- [ ] Applied after variable + fixed costs, before margin

---

### B22: Reefer Cost Calculation

**Priority:** MEDIUM
**Estimate:** 0.5 day
**Labels:** `backend`, `calculation`

#### Description
Calculate refrigeration unit operating costs.

#### Formula (from formula doc)
```
reefer_cost_per_hour = (reefer_gal_per_hour × fuel_price) + reefer_maintenance_per_hour

reefer_hours = total_miles / avg_speed  // Assume 50 mph

base_reefer_cost = reefer_hours × reefer_cost_per_hour

// Mode adjustment
continuous_multiplier = 1.35
cycle_multiplier = 1.0

final_reefer_cost = base_reefer_cost × mode_multiplier
```

#### Defaults
- Reefer fuel: 1.0 gal/hr
- Reefer maintenance: $2/hr
- Average speed: 50 mph

#### Acceptance Criteria
- [ ] Continuous mode costs 35% more than cycle
- [ ] Hours calculated from miles / 50 mph
- [ ] Only calculated if is_reefer = true

---

### B23: Final Rate Assembly

**Priority:** HIGH
**Estimate:** 0.5 day
**Labels:** `backend`, `calculation`
**Depends on:** B16-B22

#### Description
Assemble all cost components and calculate final rate with margin.

#### Formula
```
subtotal = variable_costs + fixed_costs + service_fees + reefer_cost + commodity_premium + weather_adjustment

factoring_fee = subtotal × factoring_rate

total_before_profit = subtotal + factoring_fee

profit = total_before_profit × profit_margin

final_rate = total_before_profit + profit
```

#### KPIs
```
rpm = final_rate / total_miles
cpm = (total_before_profit) / total_miles
profit_per_mile = rpm - cpm
```

#### Acceptance Criteria
- [ ] All components summed correctly
- [ ] Factoring applied to subtotal
- [ ] Profit margin applied last
- [ ] KPIs calculated correctly
- [ ] Breakdown shows each component

---

## Epic 5: Quote Management

### B24: Quote Generation Endpoint

**Priority:** HIGH
**Estimate:** 1 day
**Labels:** `backend`, `api`
**Depends on:** B15

#### Description
Main endpoint that generates a freight rate quote.

#### Endpoint

**POST /api/quotes/calculate** (Protected)
```json
Request:
{
  "origin": "Dallas, TX",
  "destination": "Chicago, IL",
  "deadhead_miles": 50,
  "vehicle_id": "uuid",
  "weight_lbs": 42000,
  "load_type": "palletized",
  "commodity_type": "general",
  "is_expedite": false,
  "is_team": false,
  "is_dc_pickup": true,
  "is_dc_delivery": false,
  "is_reefer": false,
  "driver_assist": false,
  "white_glove": false,
  "extra_straps": 0,
  "special_equipment": false,
  "weather_condition": "normal",
  "pickup_date": "2025-12-15",
  "delivery_date": "2025-12-17"
}

Response (200):
{
  "quote_id": "uuid",
  "total_rate": 3450.00,
  "rpm": 3.45,
  "cpm": 2.90,
  "profit_per_mile": 0.55,
  "total_miles": 1000,
  "states_crossed": ["TX", "OK", "KS", "MO", "IL"],
  "breakdown": { ... },
  "has_ferry": false,
  "warnings": [],
  "created_at": "2025-12-01T12:00:00Z"
}
```

#### Acceptance Criteria
- [ ] Returns complete calculation result
- [ ] Quote saved to database
- [ ] Response time < 3 seconds
- [ ] Handles validation errors with clear messages
- [ ] Returns warnings for edge cases

---

### B25: Quote Storage and Retrieval

**Priority:** HIGH
**Estimate:** 0.5 day
**Labels:** `backend`, `api`
**Depends on:** B24

#### Description
Save quotes and retrieve individual quotes.

#### Endpoints

**GET /api/quotes/:id** (Protected)
- Returns full quote details
- Only returns quotes owned by user

**DELETE /api/quotes/:id** (Protected)
- Soft delete quote

#### Acceptance Criteria
- [ ] Quote details fully retrievable
- [ ] Users can only see their own quotes
- [ ] Deleted quotes excluded from lists

---

### B26: Quote History with Search/Filter

**Priority:** HIGH
**Estimate:** 1 day
**Labels:** `backend`, `api`
**Depends on:** B25

#### Description
List quotes with search and filter capabilities.

#### Endpoint

**GET /api/quotes** (Protected)
```
Query params:
  - page (default 1)
  - limit (default 20, max 100)
  - sort_by (created_at, total_rate, total_miles)
  - sort_order (asc, desc)
  - origin (partial match)
  - destination (partial match)
  - date_from
  - date_to
  - vehicle_id
  - min_rate
  - max_rate
```

#### Response
```json
{
  "quotes": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

#### Acceptance Criteria
- [ ] Pagination works correctly
- [ ] All filters work independently and combined
- [ ] Sort by any specified field
- [ ] Partial text search on origin/destination

---

### B27: Quote PDF Export

**Priority:** MEDIUM
**Estimate:** 1 day
**Labels:** `backend`, `api`, `pdf`
**Depends on:** B25

#### Description
Generate professional PDF quote for sharing with brokers/shippers.

#### Endpoint

**GET /api/quotes/:id/pdf** (Protected)
- Returns PDF file
- Content-Type: application/pdf

#### PDF Contents
- Company logo/name (from user profile)
- Quote date and ID
- Origin → Destination with miles
- Rate breakdown table
- Total rate prominently displayed
- Contact information
- Terms/notes section

#### Implementation Options
- Puppeteer (render HTML template)
- PDFKit
- jsPDF

#### Acceptance Criteria
- [ ] PDF generates without errors
- [ ] Professional, clean design
- [ ] All quote details included
- [ ] Downloadable file with proper filename

---

## Epic 6: User Settings & Configuration

### B28: Operating Costs Settings Endpoints

**Priority:** HIGH
**Estimate:** 0.5 day
**Labels:** `backend`, `api`
**Note:** Covered by B5, but documenting detailed validation

#### Description
Handle operating cost settings with proper validation.

#### Validation Rules
| Field | Type | Range |
|-------|------|-------|
| annual_insurance | number | 1000 - 100000 |
| monthly_vehicle_payment | number | 0 - 10000 |
| annual_miles | number | 10000 - 500000 |
| maintenance_cpm | number | 0.05 - 1.00 |
| annual_licensing | number | 100 - 10000 |
| monthly_overhead | number | 0 - 20000 |

#### Acceptance Criteria
- [ ] All fields validated on save
- [ ] Invalid values return 400 with field-specific errors
- [ ] Partial updates allowed (PATCH semantics)

---

### B29: Multipliers and Fees Settings

**Priority:** HIGH
**Estimate:** 0.5 day
**Labels:** `backend`, `api`

#### Description
Settings for rate multipliers and flat fees.

#### Validation Rules
| Field | Type | Range | Default |
|-------|------|-------|---------|
| factoring_rate | decimal | 0.01 - 0.10 | 0.03 |
| profit_margin | decimal | 0.05 - 0.50 | 0.15 |
| expedite_multiplier | decimal | 1.20 - 1.50 | 1.25 |
| team_multiplier | decimal | 1.25 - 1.35 | 1.30 |
| detention_rate_per_hour | number | 25 - 75 | 40 |
| driver_assist_fee | number | 50 - 100 | 75 |
| white_glove_fee | number | 150 - 300 | 200 |
| tracking_fee | number | 3 - 10 | 5 |
| special_equipment_fee | number | 20 - 70 | 50 |

#### Acceptance Criteria
- [ ] Range validation enforced
- [ ] Defaults applied when using industry standard
- [ ] Clear error messages for out-of-range values

---

### B30: Industry Defaults System

**Priority:** MEDIUM
**Estimate:** 0.5 day
**Labels:** `backend`, `service`

#### Description
System to provide and apply industry-standard defaults.

#### Defaults by Vehicle Type
See B8 for vehicle-specific defaults.

#### Global Defaults
```javascript
const INDUSTRY_DEFAULTS = {
  factoring_rate: 0.03,
  profit_margin: 0.15,
  expedite_multiplier: 1.25,
  team_multiplier: 1.30,
  detention_rate_per_hour: 40,
  driver_assist_fee: 75,
  white_glove_fee: 200,
  tracking_fee: 5,
  special_equipment_fee: 50,
  def_price_per_gallon: 3.50,
  reefer_maintenance_per_hour: 2,
  floor_loaded_fee: 75,
  extra_strap_fee: 10
};
```

#### Endpoint

**GET /api/settings/defaults**
- Returns all industry defaults
- Useful for frontend "Use Industry Standard" feature

#### Acceptance Criteria
- [ ] Defaults available via API
- [ ] Applied when user selects "Use Industry Standard"
- [ ] Can be overridden individually

---

## Summary

| Epic | Tickets | Estimated Days |
|------|---------|----------------|
| 1. Database & Infrastructure | B1-B5 | 4 |
| 2. Vehicle Management | B6-B8 | 2.5 |
| 3. External API Integrations | B9-B14 | 6.5 |
| 4. Calculation Engine | B15-B23 | 6.5 |
| 5. Quote Management | B24-B27 | 3.5 |
| 6. User Settings | B28-B30 | 1.5 |
| **Total** | **30 tickets** | **~24.5 days** |

---

## Dependencies Graph

```
B1 (Schema)
  └── B2 (Migrations)
        └── B3 (API Foundation)
              └── B4 (Auth)
                    ├── B5 (Settings)
                    ├── B7 (Vehicles) ← B6 (VIN API)
                    └── B24 (Quote Generate)
                          ├── B15 (Calc Engine)
                          │     ├── B16 (Variable Costs) ← B12 (Fuel Calc) ← B10, B11
                          │     │                        ← B13 (Tolls)
                          │     ├── B17 (Fixed Costs)
                          │     ├── B18 (Service Fees)
                          │     ├── B19-B22 (Adjustments)
                          │     └── B23 (Final Assembly)
                          ├── B25 (Quote Storage)
                          │     ├── B26 (Quote History)
                          │     └── B27 (PDF Export)
                          └── B9 (Google Distance)
```

---

## Post-MVP Backlog

These are NOT included in MVP but documented for future:

- **Weather API Integration** (OpenWeather) - Replace dropdown with real-time
- **Market Demand API** (DAT/Truckstop) - Load-to-truck ratios
- **Risk Scoring** - Theft data, route safety
- **Lane Profitability** - Historical analysis
- **Altitude Adjustment** - Elevation-based MPG
- **Seasonal Auto-Adjustment** - Date-based rate suggestions
- **Ferry Detection & Pricing** - Route analysis for water crossings
