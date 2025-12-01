# PostgreSQL Database Schema Documentation

## Overview

This document describes the PostgreSQL database schema for the Freight Calculator application. The schema supports trucking industry professionals (owner-operators, fleet managers, dispatchers) in calculating freight rates and managing operating costs.

## Database Requirements

- **PostgreSQL**: Version 14+ (for generated columns support)
- **Extensions Required**:
  - `uuid-ossp` - UUID generation
  - `pgcrypto` - SHA-256 hashing for toll cache

## Table Summary

| Table | Description | Primary Key |
|-------|-------------|-------------|
| `users` | User accounts and profiles | UUID |
| `vehicles` | User fleet vehicles | UUID |
| `user_settings` | Operating costs and preferences | UUID |
| `quotes` | Calculated rate quotes | UUID |
| `fuel_price_cache` | Cached fuel prices by state | UUID |
| `toll_cache` | Cached toll calculations | UUID |
| `saved_trips` | User-saved frequent routes | UUID |
| `booking_records` | Booked load records | UUID |
| `user_rewards` | Achievement tracking | UUID |
| `referrals` | Referral program tracking | UUID |
| `api_usage` | Rate limiting tracking | UUID |

---

## Core Tables

### 1. `users`

Primary table for all user accounts.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(255),
    user_type user_type NOT NULL DEFAULT 'owner_operator',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_step INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE
);
```

**Enum: `user_type`**
| Value | Description |
|-------|-------------|
| `owner_operator` | Independent truck owner/driver |
| `fleet_manager` | Manages multiple trucks/drivers |
| `dispatcher` | Coordinates loads and routes |

**Indexes**:
- `idx_users_email` - Fast email lookup for authentication
- `idx_users_user_type` - Filter users by role
- `idx_users_created_at` - Sort by registration date
- `idx_users_is_active` - Partial index for active users only

---

### 2. `vehicles`

User-owned vehicles/trucks used for rate calculations.

```sql
CREATE TABLE vehicles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    vin VARCHAR(17),
    year INTEGER,
    make VARCHAR(100),
    model VARCHAR(100),
    vehicle_type vehicle_type NOT NULL,
    equipment_type equipment_type DEFAULT 'dry_van',
    fuel_type fuel_type DEFAULT 'diesel',
    mpg DECIMAL(4,2),
    axle_count INTEGER DEFAULT 5,
    has_sleeper BOOLEAN DEFAULT false,
    payload_capacity INTEGER,
    gross_vehicle_weight INTEGER,
    is_active BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

**Enum: `vehicle_type`**
| Value | Description | Typical MPG |
|-------|-------------|-------------|
| `semi` | Class 8 semi-truck | 6-8 |
| `box_truck` | Medium-duty box truck | 8-12 |
| `cargo_van` | Cargo van | 15-20 |
| `sprinter` | Sprinter/panel van | 18-24 |
| `reefer` | Refrigerated truck | 5-7 |

**Enum: `equipment_type`**
| Value | Description |
|-------|-------------|
| `dry_van` | Standard enclosed trailer |
| `refrigerated` | Temperature-controlled |
| `flatbed` | Open flatbed trailer |
| `step_deck` | Lower deck height |
| `lowboy` | Extra-low deck |
| `tanker` | Liquid transport |
| `conestoga` | Rolling tarp system |
| `specialized` | Custom equipment |

**Enum: `fuel_type`**
| Value | Description |
|-------|-------------|
| `diesel` | Standard diesel |
| `gasoline` | Gasoline engine |
| `cng` | Compressed natural gas |
| `lng` | Liquefied natural gas |
| `electric` | Electric vehicle |
| `hybrid` | Hybrid system |

**Constraints**:
- VIN must be exactly 17 characters when provided
- MPG must be between 0 and 50
- Axle count must be between 2 and 18
- Year must be between 1900 and next year

---

### 3. `user_settings`

Operating costs and rate calculation preferences.

```sql
CREATE TABLE user_settings (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES users(id),

    -- Fixed costs
    annual_insurance DECIMAL(10,2) DEFAULT 12000.00,
    monthly_vehicle_payment DECIMAL(10,2) DEFAULT 1500.00,
    annual_miles INTEGER DEFAULT 100000,
    annual_licensing DECIMAL(10,2) DEFAULT 2500.00,
    monthly_overhead DECIMAL(10,2) DEFAULT 500.00,

    -- Variable costs (per mile)
    maintenance_cpm DECIMAL(6,4) DEFAULT 0.15,
    fuel_cpm DECIMAL(6,4),
    tire_cpm DECIMAL(6,4) DEFAULT 0.05,

    -- Financial rates
    factoring_rate DECIMAL(5,4) DEFAULT 0.03,
    profit_margin DECIMAL(5,4) DEFAULT 0.15,

    -- Service multipliers
    expedite_multiplier DECIMAL(4,2) DEFAULT 1.30,
    team_multiplier DECIMAL(4,2) DEFAULT 1.50,
    rush_multiplier DECIMAL(4,2) DEFAULT 1.50,
    same_day_multiplier DECIMAL(4,2) DEFAULT 2.00,

    -- Additional service fees
    detention_rate_per_hour DECIMAL(8,2) DEFAULT 75.00,
    driver_assist_fee DECIMAL(8,2) DEFAULT 100.00,
    white_glove_fee DECIMAL(8,2) DEFAULT 250.00,
    tracking_fee DECIMAL(8,2) DEFAULT 25.00,
    special_equipment_fee DECIMAL(8,2) DEFAULT 150.00,
    liftgate_fee DECIMAL(8,2) DEFAULT 75.00,
    pallet_jack_fee DECIMAL(8,2) DEFAULT 50.00,

    -- Reefer-specific
    def_price_per_gallon DECIMAL(6,2) DEFAULT 3.50,
    reefer_maintenance_per_hour DECIMAL(8,2) DEFAULT 25.00,
    reefer_fuel_per_hour DECIMAL(6,2) DEFAULT 1.50,

    -- Preferences
    use_industry_defaults BOOLEAN DEFAULT true,
    default_deadhead_miles INTEGER DEFAULT 50,

    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

**Cost Calculation Defaults**:

| Setting | Default | Description |
|---------|---------|-------------|
| `annual_insurance` | $12,000 | Annual insurance premium |
| `monthly_vehicle_payment` | $1,500 | Monthly truck payment |
| `annual_miles` | 100,000 | Expected annual mileage |
| `maintenance_cpm` | $0.15 | Maintenance cost per mile |
| `factoring_rate` | 3% | Factoring company fee |
| `profit_margin` | 15% | Target profit margin |

**Service Multipliers** (applied to base rate):

| Service | Default | Effect |
|---------|---------|--------|
| `expedite_multiplier` | 1.30 | +30% for expedited |
| `team_multiplier` | 1.50 | +50% for team drivers |
| `rush_multiplier` | 1.50 | +50% for rush delivery |
| `same_day_multiplier` | 2.00 | +100% for same-day |

**Note**: A trigger automatically creates a `user_settings` row when a new user is created.

---

### 4. `quotes`

Calculated freight rate quotes.

```sql
CREATE TABLE quotes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    vehicle_id UUID REFERENCES vehicles(id),

    -- Origin
    origin_address VARCHAR(500) NOT NULL,
    origin_city VARCHAR(100),
    origin_state VARCHAR(2),
    origin_zip VARCHAR(10),
    origin_lat DECIMAL(10,7),
    origin_lng DECIMAL(10,7),

    -- Destination
    destination_address VARCHAR(500) NOT NULL,
    destination_city VARCHAR(100),
    destination_state VARCHAR(2),
    destination_zip VARCHAR(10),
    destination_lat DECIMAL(10,7),
    destination_lng DECIMAL(10,7),

    -- Distance
    total_miles INTEGER NOT NULL,
    deadhead_miles INTEGER DEFAULT 0,
    loaded_miles INTEGER GENERATED ALWAYS AS (total_miles - deadhead_miles) STORED,

    -- Route info
    states_crossed JSONB DEFAULT '[]',
    estimated_drive_time_hours DECIMAL(6,2),

    -- Load details
    load_weight INTEGER,
    load_type load_type DEFAULT 'full_truckload',
    freight_class freight_class DEFAULT 'dry_van',
    commodity_type VARCHAR(100),
    hazmat_class VARCHAR(20),

    -- Service options
    is_expedite BOOLEAN DEFAULT false,
    is_team BOOLEAN DEFAULT false,
    is_reefer BOOLEAN DEFAULT false,
    is_rush BOOLEAN DEFAULT false,
    is_same_day BOOLEAN DEFAULT false,
    requires_liftgate BOOLEAN DEFAULT false,
    requires_pallet_jack BOOLEAN DEFAULT false,
    requires_driver_assist BOOLEAN DEFAULT false,
    requires_white_glove BOOLEAN DEFAULT false,
    requires_tracking BOOLEAN DEFAULT false,

    -- Reefer
    reefer_mode VARCHAR(20),
    reefer_temp_min DECIMAL(5,2),
    reefer_temp_max DECIMAL(5,2),

    -- Schedule
    pickup_date DATE,
    pickup_time_window VARCHAR(50),
    delivery_date DATE,
    delivery_time_window VARCHAR(50),

    -- Conditions
    weather_condition weather_condition DEFAULT 'normal',
    season VARCHAR(20),

    -- JSON data
    service_fees JSONB DEFAULT '{}',
    cost_breakdown JSONB DEFAULT '{}',
    market_data JSONB DEFAULT '{}',
    weather_data JSONB DEFAULT '{}',

    -- Calculations
    total_rate DECIMAL(10,2) NOT NULL,
    rpm DECIMAL(6,4) GENERATED ALWAYS AS (...) STORED,
    cpm DECIMAL(6,4),
    profit_per_mile DECIMAL(6,4),
    profit_total DECIMAL(10,2),

    -- External costs
    tolls DECIMAL(8,2) DEFAULT 0,
    fuel_cost DECIMAL(8,2),
    fuel_price_used DECIMAL(6,3),

    -- Scoring
    acceptance_score DECIMAL(4,2),
    acceptance_rating VARCHAR(50),

    -- Status
    status quote_status DEFAULT 'calculated',
    expires_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    booked_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);
```

**Enum: `quote_status`**
| Value | Description |
|-------|-------------|
| `draft` | Quote in progress |
| `calculated` | Rate calculated |
| `booked` | Load booked |
| `completed` | Trip completed |
| `cancelled` | Quote cancelled |
| `expired` | Quote expired |

**Enum: `load_type`**
| Value | Description |
|-------|-------------|
| `full_truckload` | Full TL shipment |
| `partial` | Partial load |
| `ltl` | Less than truckload |

**Enum: `freight_class`**
| Value | Description |
|-------|-------------|
| `dry_van` | Standard dry freight |
| `refrigerated` | Temperature-controlled |
| `flatbed` | Flatbed freight |
| `oversized` | Oversized/overweight |
| `hazmat` | Hazardous materials |
| `tanker` | Liquid bulk |

---

### 5. `fuel_price_cache`

Cached fuel prices by state.

```sql
CREATE TABLE fuel_price_cache (
    id UUID PRIMARY KEY,
    state_code VARCHAR(2) NOT NULL,
    price_per_gallon DECIMAL(6,3) NOT NULL,
    fuel_type fuel_type DEFAULT 'diesel',
    source fuel_source DEFAULT 'eia',
    fetched_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);
```

**Unique constraint**: `(state_code, fuel_type)`

**Enum: `fuel_source`**
| Value | Description |
|-------|-------------|
| `eia` | Energy Information Administration |
| `opus` | Opus (alternative source) |
| `manual` | Manually entered |

**Cache Duration**: 24 hours default

---

### 6. `toll_cache`

Cached toll calculations for routes.

```sql
CREATE TABLE toll_cache (
    id UUID PRIMARY KEY,
    origin_hash VARCHAR(64) NOT NULL,
    destination_hash VARCHAR(64) NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    axle_count INTEGER DEFAULT 5,
    toll_amount DECIMAL(8,2) NOT NULL,
    toll_count INTEGER DEFAULT 0,
    route_data JSONB DEFAULT '{}',
    fetched_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);
```

**Unique constraint**: `(origin_hash, destination_hash, vehicle_type, axle_count)`

**Hash Function**: Use `hash_address(address)` to generate SHA-256 hash of addresses.

**Cache Duration**: 7 days default

---

## JSON Column Structures

### `quotes.states_crossed`

Array of US state codes the route passes through.

```json
["TX", "OK", "KS", "MO", "IL"]
```

### `quotes.service_fees`

Breakdown of additional service fees applied.

```json
{
  "liftgate": 75.00,
  "tracking": 25.00,
  "driver_assist": 100.00,
  "detention": {
    "hours": 2,
    "rate": 75.00,
    "total": 150.00
  },
  "expedite_surcharge": 450.00,
  "weather_surcharge": 125.00,
  "total_fees": 925.00
}
```

### `quotes.cost_breakdown`

Detailed cost breakdown by category.

```json
{
  "fuel": {
    "gallons": 153.85,
    "price_per_gallon": 3.25,
    "total": 500.01
  },
  "tolls": {
    "count": 8,
    "total": 125.50
  },
  "labor": {
    "driver_pay": 450.00,
    "per_mile": 0.45
  },
  "fixed_costs_allocated": {
    "insurance": 12.00,
    "payment": 15.00,
    "licensing": 2.50,
    "overhead": 5.00,
    "total": 34.50
  },
  "variable_costs": {
    "maintenance": 150.00,
    "tires": 50.00,
    "total": 200.00
  },
  "total_cost": 1310.01,
  "cost_per_mile": 1.31
}
```

### `quotes.market_data`

Snapshot of market conditions at quote time.

```json
{
  "origin": {
    "city": "Dallas",
    "market_temperature": "hot",
    "truck_to_load_ratio": 0.7,
    "loads_available": 450,
    "avg_rate_per_mile": 2.85,
    "rate_trend": "rising"
  },
  "destination": {
    "city": "Chicago",
    "market_temperature": "warm",
    "truck_to_load_ratio": 1.2,
    "loads_available": 320,
    "avg_rate_per_mile": 2.45,
    "rate_trend": "stable"
  },
  "return_load_potential": {
    "score": 8,
    "rating": "excellent",
    "message": "Strong return freight market"
  },
  "top_return_lanes": [
    {
      "destination": "Houston",
      "loads": 45,
      "rate_per_mile": 2.65,
      "distance": 1050
    }
  ],
  "recommendation": {
    "action": "accept",
    "message": "Above-market rate with strong return potential"
  }
}
```

### `quotes.weather_data`

Weather conditions and impact on the route.

```json
{
  "origin": {
    "city": "Dallas",
    "temp_f": 75,
    "condition": "sunny",
    "icon": "sun",
    "feels_like": 78
  },
  "destination": {
    "city": "Chicago",
    "temp_f": 45,
    "condition": "cloudy",
    "icon": "cloud",
    "feels_like": 40
  },
  "route_alerts": [
    {
      "location": "I-44 Missouri",
      "alert_type": "Winter Storm Warning",
      "severity": "high",
      "message": "Heavy snow expected",
      "valid_until": "2025-12-02T18:00:00Z",
      "delay_estimate": "2-4 hours"
    }
  ],
  "forecast": [
    {
      "date": "2025-12-01",
      "high": 55,
      "low": 38,
      "condition": "cloudy",
      "icon": "cloud",
      "warning": false
    }
  ],
  "rate_impact": {
    "surcharge_percent": 5,
    "surcharge_amount": 125.00,
    "reason": "Winter weather conditions on route"
  },
  "delay_risk": "medium",
  "has_alerts": true
}
```

### `toll_cache.route_data`

Detailed toll breakdown by location.

```json
{
  "route_summary": {
    "distance_miles": 1000,
    "estimated_time_hours": 15.5
  },
  "tolls": [
    {
      "name": "Oklahoma Turnpike",
      "state": "OK",
      "entry": "Tulsa",
      "exit": "Oklahoma City",
      "amount": 12.50,
      "payment_type": "cash_or_pike_pass"
    },
    {
      "name": "Kansas Turnpike",
      "state": "KS",
      "entry": "Wichita",
      "exit": "Topeka",
      "amount": 18.75,
      "payment_type": "k_tag_or_cash"
    }
  ],
  "total_toll_roads": 4,
  "accepts_ezpass": true
}
```

---

## Indexes Summary

### Users
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_users_email` | `email` | Authentication lookup |
| `idx_users_user_type` | `user_type` | Filter by role |
| `idx_users_created_at` | `created_at DESC` | Recent users |
| `idx_users_is_active` | `is_active` (partial) | Active users only |

### Vehicles
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_vehicles_user_id` | `user_id` | User's vehicles |
| `idx_vehicles_user_active` | `user_id, is_active` | Active vehicles |
| `idx_vehicles_type` | `vehicle_type` | Filter by type |
| `idx_vehicles_primary` | `user_id, is_primary` | Primary vehicle |

### Quotes
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_quotes_user_id` | `user_id` | User's quotes |
| `idx_quotes_vehicle_id` | `vehicle_id` | Vehicle's quotes |
| `idx_quotes_created_at` | `created_at DESC` | Recent quotes |
| `idx_quotes_status` | `status` | Filter by status |
| `idx_quotes_user_status` | `user_id, status` | User quotes by status |
| `idx_quotes_origin_state` | `origin_state` | Route queries |
| `idx_quotes_destination_state` | `destination_state` | Route queries |
| `idx_quotes_pickup_date` | `pickup_date` | Schedule queries |
| `idx_quotes_total_rate` | `total_rate` | Rate sorting |
| `idx_quotes_expires` | `expires_at` (partial) | Pending quotes |

### Cache Tables
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_fuel_price_state` | `state_code` | State lookup |
| `idx_fuel_price_expires` | `expires_at` | Cache cleanup |
| `idx_toll_cache_route` | `origin_hash, destination_hash` | Route lookup |
| `idx_toll_cache_expires` | `expires_at` | Cache cleanup |

---

## Foreign Key Relationships

```
users
  │
  ├── vehicles (user_id → users.id, CASCADE DELETE)
  │
  ├── user_settings (user_id → users.id, CASCADE DELETE, 1:1)
  │
  ├── quotes (user_id → users.id, CASCADE DELETE)
  │     │
  │     └── vehicles (vehicle_id → vehicles.id, SET NULL)
  │
  ├── saved_trips (user_id → users.id, CASCADE DELETE)
  │
  ├── booking_records (user_id → users.id, CASCADE DELETE)
  │     │
  │     └── quotes (quote_id → quotes.id, CASCADE DELETE)
  │
  ├── user_rewards (user_id → users.id, CASCADE DELETE)
  │
  ├── referrals (referrer_id → users.id, CASCADE DELETE)
  │     │
  │     └── users (referred_id → users.id, SET NULL)
  │
  └── api_usage (user_id → users.id, CASCADE DELETE)
```

---

## Triggers

### Auto-update `updated_at`
All main tables have triggers to automatically set `updated_at` to current timestamp on UPDATE.

```sql
CREATE TRIGGER update_[table]_updated_at
    BEFORE UPDATE ON [table]
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Auto-create user_settings
When a new user is created, default settings are automatically inserted.

```sql
CREATE TRIGGER create_user_settings_on_signup
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_user_settings();
```

---

## Helper Functions

### `hash_address(address TEXT)`
Creates SHA-256 hash of an address for toll cache lookup.

```sql
SELECT hash_address('123 Main St, Dallas, TX 75201');
-- Returns: 64-character hex string
```

---

## Views

### `user_dashboard_stats`
Aggregated user statistics for dashboard display.

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | UUID | User ID |
| `name` | VARCHAR | User name |
| `user_type` | user_type | User role |
| `vehicle_count` | INTEGER | Active vehicles |
| `total_quotes` | INTEGER | All quotes |
| `booked_quotes` | INTEGER | Booked quotes |
| `total_revenue` | DECIMAL | Completed revenue |
| `avg_rpm` | DECIMAL | Average rate per mile |
| `last_quote_at` | TIMESTAMP | Last quote date |

### `recent_quotes`
Last 30 days of quotes with vehicle information.

---

## Common Queries

### Get user's cost per mile
```sql
SELECT
    u.id,
    us.annual_insurance / us.annual_miles as insurance_cpm,
    (us.monthly_vehicle_payment * 12) / us.annual_miles as payment_cpm,
    us.maintenance_cpm,
    us.tire_cpm,
    us.annual_licensing / us.annual_miles as licensing_cpm,
    (us.monthly_overhead * 12) / us.annual_miles as overhead_cpm
FROM users u
JOIN user_settings us ON us.user_id = u.id
WHERE u.id = $1;
```

### Get quote with full details
```sql
SELECT
    q.*,
    v.name as vehicle_name,
    v.vehicle_type,
    v.mpg,
    u.name as user_name,
    u.company_name
FROM quotes q
LEFT JOIN vehicles v ON q.vehicle_id = v.id
JOIN users u ON q.user_id = u.id
WHERE q.id = $1;
```

### Get cached fuel price
```sql
SELECT price_per_gallon
FROM fuel_price_cache
WHERE state_code = $1
  AND fuel_type = $2
  AND expires_at > CURRENT_TIMESTAMP
ORDER BY fetched_at DESC
LIMIT 1;
```

### Get cached toll
```sql
SELECT toll_amount, route_data
FROM toll_cache
WHERE origin_hash = hash_address($1)
  AND destination_hash = hash_address($2)
  AND vehicle_type = $3
  AND axle_count = $4
  AND expires_at > CURRENT_TIMESTAMP;
```

---

## Migration Notes

1. Run the schema in order - extensions first, then types, then tables
2. Seed fuel prices will be inserted automatically
3. User settings are created automatically via trigger
4. Consider running VACUUM ANALYZE after bulk inserts
5. Monitor index usage and add/remove as needed

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-01 | Initial schema design |
