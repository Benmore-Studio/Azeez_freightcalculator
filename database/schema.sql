-- ============================================================================
-- FREIGHT CALCULATOR - PostgreSQL Database Schema
-- ============================================================================
-- Version: 1.0.0
-- Created: 2025-12-01
-- Description: Complete database schema for the freight rate calculator
--              application supporting trucking industry professionals.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- User types for different roles in the trucking industry
CREATE TYPE user_type AS ENUM (
    'owner_operator',
    'fleet_manager',
    'dispatcher'
);

-- Vehicle types supported by the calculator
CREATE TYPE vehicle_type AS ENUM (
    'semi',
    'box_truck',
    'cargo_van',
    'sprinter',
    'reefer'
);

-- Equipment types for trailers
CREATE TYPE equipment_type AS ENUM (
    'dry_van',
    'refrigerated',
    'flatbed',
    'step_deck',
    'lowboy',
    'tanker',
    'conestoga',
    'specialized'
);

-- Fuel types
CREATE TYPE fuel_type AS ENUM (
    'diesel',
    'gasoline',
    'cng',
    'lng',
    'electric',
    'hybrid'
);

-- Weather conditions affecting freight
CREATE TYPE weather_condition AS ENUM (
    'normal',
    'light_rain',
    'heavy_rain',
    'snow',
    'ice',
    'extreme_weather',
    'fog'
);

-- Market temperature indicators
CREATE TYPE market_temperature AS ENUM (
    'hot',
    'warm',
    'balanced',
    'cool',
    'cold'
);

-- Rate trend direction
CREATE TYPE rate_trend AS ENUM (
    'rising',
    'stable',
    'falling'
);

-- Load/freight types
CREATE TYPE load_type AS ENUM (
    'full_truckload',
    'partial',
    'ltl'
);

-- Freight class types
CREATE TYPE freight_class AS ENUM (
    'dry_van',
    'refrigerated',
    'flatbed',
    'oversized',
    'hazmat',
    'tanker'
);

-- Quote status
CREATE TYPE quote_status AS ENUM (
    'draft',
    'calculated',
    'booked',
    'completed',
    'cancelled',
    'expired'
);

-- Fuel price data source
CREATE TYPE fuel_source AS ENUM (
    'eia',
    'opus',
    'manual'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- USERS TABLE
-- Primary table for all user accounts
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(255),
    user_type user_type NOT NULL DEFAULT 'owner_operator',

    -- Account status
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,

    -- Onboarding tracking
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    onboarding_step INTEGER DEFAULT 1 CHECK (onboarding_step BETWEEN 1 AND 5),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE users IS 'Primary user accounts table for trucking professionals';
COMMENT ON COLUMN users.user_type IS 'Role: owner_operator, fleet_manager, or dispatcher';
COMMENT ON COLUMN users.onboarding_step IS 'Current step in 5-step onboarding wizard (1-5)';

-- ----------------------------------------------------------------------------
-- VEHICLES TABLE
-- User-owned vehicles/trucks for rate calculations
-- ----------------------------------------------------------------------------
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Basic info
    name VARCHAR(100) NOT NULL,
    vin VARCHAR(17),
    year INTEGER CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    make VARCHAR(100),
    model VARCHAR(100),

    -- Vehicle specifications
    vehicle_type vehicle_type NOT NULL,
    equipment_type equipment_type DEFAULT 'dry_van',
    fuel_type fuel_type DEFAULT 'diesel',
    mpg DECIMAL(4,2) CHECK (mpg > 0 AND mpg <= 50),
    axle_count INTEGER DEFAULT 5 CHECK (axle_count BETWEEN 2 AND 18),
    has_sleeper BOOLEAN DEFAULT false,

    -- Additional specs
    payload_capacity INTEGER CHECK (payload_capacity > 0),
    gross_vehicle_weight INTEGER CHECK (gross_vehicle_weight > 0),

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_primary BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT vin_format CHECK (vin IS NULL OR LENGTH(vin) = 17)
);

COMMENT ON TABLE vehicles IS 'User fleet vehicles used for rate calculations';
COMMENT ON COLUMN vehicles.mpg IS 'Miles per gallon for fuel cost calculations';
COMMENT ON COLUMN vehicles.vin IS 'Vehicle Identification Number (17 characters when provided)';
COMMENT ON COLUMN vehicles.is_primary IS 'Indicates the default vehicle for calculations';

-- ----------------------------------------------------------------------------
-- USER_SETTINGS TABLE
-- Operating costs and rate calculation preferences
-- ----------------------------------------------------------------------------
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Fixed costs (annual/monthly)
    annual_insurance DECIMAL(10,2) DEFAULT 12000.00 CHECK (annual_insurance >= 0),
    monthly_vehicle_payment DECIMAL(10,2) DEFAULT 1500.00 CHECK (monthly_vehicle_payment >= 0),
    annual_miles INTEGER DEFAULT 100000 CHECK (annual_miles > 0),
    annual_licensing DECIMAL(10,2) DEFAULT 2500.00 CHECK (annual_licensing >= 0),
    monthly_overhead DECIMAL(10,2) DEFAULT 500.00 CHECK (monthly_overhead >= 0),

    -- Variable costs (per mile)
    maintenance_cpm DECIMAL(6,4) DEFAULT 0.15 CHECK (maintenance_cpm >= 0),
    fuel_cpm DECIMAL(6,4) CHECK (fuel_cpm >= 0),
    tire_cpm DECIMAL(6,4) DEFAULT 0.05 CHECK (tire_cpm >= 0),

    -- Financial rates
    factoring_rate DECIMAL(5,4) DEFAULT 0.03 CHECK (factoring_rate >= 0 AND factoring_rate < 1),
    profit_margin DECIMAL(5,4) DEFAULT 0.15 CHECK (profit_margin >= 0 AND profit_margin < 1),

    -- Service multipliers
    expedite_multiplier DECIMAL(4,2) DEFAULT 1.30 CHECK (expedite_multiplier >= 1.00),
    team_multiplier DECIMAL(4,2) DEFAULT 1.50 CHECK (team_multiplier >= 1.00),
    rush_multiplier DECIMAL(4,2) DEFAULT 1.50 CHECK (rush_multiplier >= 1.00),
    same_day_multiplier DECIMAL(4,2) DEFAULT 2.00 CHECK (same_day_multiplier >= 1.00),

    -- Additional service fees
    detention_rate_per_hour DECIMAL(8,2) DEFAULT 75.00 CHECK (detention_rate_per_hour >= 0),
    driver_assist_fee DECIMAL(8,2) DEFAULT 100.00 CHECK (driver_assist_fee >= 0),
    white_glove_fee DECIMAL(8,2) DEFAULT 250.00 CHECK (white_glove_fee >= 0),
    tracking_fee DECIMAL(8,2) DEFAULT 25.00 CHECK (tracking_fee >= 0),
    special_equipment_fee DECIMAL(8,2) DEFAULT 150.00 CHECK (special_equipment_fee >= 0),
    liftgate_fee DECIMAL(8,2) DEFAULT 75.00 CHECK (liftgate_fee >= 0),
    pallet_jack_fee DECIMAL(8,2) DEFAULT 50.00 CHECK (pallet_jack_fee >= 0),

    -- Reefer-specific costs
    def_price_per_gallon DECIMAL(6,2) DEFAULT 3.50 CHECK (def_price_per_gallon >= 0),
    reefer_maintenance_per_hour DECIMAL(8,2) DEFAULT 25.00 CHECK (reefer_maintenance_per_hour >= 0),
    reefer_fuel_per_hour DECIMAL(6,2) DEFAULT 1.50 CHECK (reefer_fuel_per_hour >= 0),

    -- Preferences
    use_industry_defaults BOOLEAN NOT NULL DEFAULT true,
    default_deadhead_miles INTEGER DEFAULT 50 CHECK (default_deadhead_miles >= 0),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_settings IS 'User operating costs and rate calculation settings';
COMMENT ON COLUMN user_settings.maintenance_cpm IS 'Maintenance cost per mile in dollars';
COMMENT ON COLUMN user_settings.factoring_rate IS 'Factoring fee rate (e.g., 0.03 = 3%)';
COMMENT ON COLUMN user_settings.profit_margin IS 'Target profit margin (e.g., 0.15 = 15%)';
COMMENT ON COLUMN user_settings.expedite_multiplier IS 'Rate multiplier for expedited loads (1.30 = 30% increase)';
COMMENT ON COLUMN user_settings.use_industry_defaults IS 'Whether to use industry average costs vs custom values';

-- ----------------------------------------------------------------------------
-- QUOTES TABLE
-- Calculated rate quotes for freight movements
-- ----------------------------------------------------------------------------
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,

    -- Origin location
    origin_address VARCHAR(500) NOT NULL,
    origin_city VARCHAR(100),
    origin_state VARCHAR(2),
    origin_zip VARCHAR(10),
    origin_lat DECIMAL(10,7),
    origin_lng DECIMAL(10,7),

    -- Destination location
    destination_address VARCHAR(500) NOT NULL,
    destination_city VARCHAR(100),
    destination_state VARCHAR(2),
    destination_zip VARCHAR(10),
    destination_lat DECIMAL(10,7),
    destination_lng DECIMAL(10,7),

    -- Distance calculations
    total_miles INTEGER NOT NULL CHECK (total_miles > 0),
    deadhead_miles INTEGER DEFAULT 0 CHECK (deadhead_miles >= 0),
    loaded_miles INTEGER GENERATED ALWAYS AS (total_miles - deadhead_miles) STORED,

    -- Route info
    states_crossed JSONB DEFAULT '[]'::jsonb,
    estimated_drive_time_hours DECIMAL(6,2),

    -- Load details
    load_weight INTEGER CHECK (load_weight > 0),
    load_type load_type DEFAULT 'full_truckload',
    freight_class freight_class DEFAULT 'dry_van',
    commodity_type VARCHAR(100),
    hazmat_class VARCHAR(20),

    -- Service options (boolean flags)
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

    -- Reefer details
    reefer_mode VARCHAR(20),
    reefer_temp_min DECIMAL(5,2),
    reefer_temp_max DECIMAL(5,2),

    -- Schedule
    pickup_date DATE,
    pickup_time_window VARCHAR(50),
    delivery_date DATE,
    delivery_time_window VARCHAR(50),

    -- Environmental factors
    weather_condition weather_condition DEFAULT 'normal',
    season VARCHAR(20),

    -- Service fees breakdown (JSON for flexibility)
    service_fees JSONB DEFAULT '{}'::jsonb,

    -- Cost breakdown (JSON for detailed line items)
    cost_breakdown JSONB DEFAULT '{}'::jsonb,

    -- Final calculations
    total_rate DECIMAL(10,2) NOT NULL CHECK (total_rate > 0),
    rpm DECIMAL(6,4) GENERATED ALWAYS AS (
        CASE WHEN total_miles > 0 THEN total_rate / total_miles ELSE NULL END
    ) STORED,
    cpm DECIMAL(6,4),
    profit_per_mile DECIMAL(6,4),
    profit_total DECIMAL(10,2),

    -- External costs
    tolls DECIMAL(8,2) DEFAULT 0 CHECK (tolls >= 0),
    fuel_cost DECIMAL(8,2) CHECK (fuel_cost >= 0),
    fuel_price_used DECIMAL(6,3),

    -- Market data snapshot
    market_data JSONB DEFAULT '{}'::jsonb,
    weather_data JSONB DEFAULT '{}'::jsonb,

    -- Load acceptance score
    acceptance_score DECIMAL(4,2) CHECK (acceptance_score >= 0 AND acceptance_score <= 10),
    acceptance_rating VARCHAR(50),

    -- Quote status
    status quote_status NOT NULL DEFAULT 'calculated',
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    booked_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE quotes IS 'Calculated freight rate quotes';
COMMENT ON COLUMN quotes.rpm IS 'Rate per mile (auto-calculated)';
COMMENT ON COLUMN quotes.cpm IS 'Cost per mile';
COMMENT ON COLUMN quotes.service_fees IS 'JSON breakdown of additional service fees applied';
COMMENT ON COLUMN quotes.cost_breakdown IS 'JSON detailed cost breakdown by category';
COMMENT ON COLUMN quotes.market_data IS 'Snapshot of market conditions at quote time';
COMMENT ON COLUMN quotes.states_crossed IS 'JSON array of state codes the route crosses';

-- ----------------------------------------------------------------------------
-- FUEL_PRICE_CACHE TABLE
-- Cached fuel prices by state from EIA or other sources
-- ----------------------------------------------------------------------------
CREATE TABLE fuel_price_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_code VARCHAR(2) NOT NULL,
    price_per_gallon DECIMAL(6,3) NOT NULL CHECK (price_per_gallon > 0),
    fuel_type fuel_type DEFAULT 'diesel',
    source fuel_source NOT NULL DEFAULT 'eia',

    -- Timestamps
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),

    -- Unique constraint per state/fuel type combination
    CONSTRAINT unique_state_fuel UNIQUE (state_code, fuel_type)
);

COMMENT ON TABLE fuel_price_cache IS 'Cached fuel prices by state for cost calculations';
COMMENT ON COLUMN fuel_price_cache.source IS 'Data source: eia (Energy Information Administration), opus, or manual';

-- ----------------------------------------------------------------------------
-- TOLL_CACHE TABLE
-- Cached toll calculations for routes
-- ----------------------------------------------------------------------------
CREATE TABLE toll_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Route identification (hashed for lookup)
    origin_hash VARCHAR(64) NOT NULL,
    destination_hash VARCHAR(64) NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    axle_count INTEGER DEFAULT 5,

    -- Toll data
    toll_amount DECIMAL(8,2) NOT NULL CHECK (toll_amount >= 0),
    toll_count INTEGER DEFAULT 0 CHECK (toll_count >= 0),
    route_data JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),

    -- Unique constraint for route/vehicle combination
    CONSTRAINT unique_route_vehicle UNIQUE (origin_hash, destination_hash, vehicle_type, axle_count)
);

COMMENT ON TABLE toll_cache IS 'Cached toll calculations for routes';
COMMENT ON COLUMN toll_cache.origin_hash IS 'SHA-256 hash of origin address for efficient lookup';
COMMENT ON COLUMN toll_cache.destination_hash IS 'SHA-256 hash of destination address';
COMMENT ON COLUMN toll_cache.route_data IS 'JSON containing detailed toll breakdown by location';

-- ============================================================================
-- ADDITIONAL SUPPORTING TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SAVED_TRIPS TABLE
-- User-saved frequent routes for quick access
-- ----------------------------------------------------------------------------
CREATE TABLE saved_trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    origin VARCHAR(500) NOT NULL,
    origin_city VARCHAR(100),
    origin_state VARCHAR(2),
    destination VARCHAR(500) NOT NULL,
    destination_city VARCHAR(100),
    destination_state VARCHAR(2),
    distance INTEGER CHECK (distance > 0),

    is_favorite BOOLEAN DEFAULT false,
    use_count INTEGER DEFAULT 0 CHECK (use_count >= 0),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE saved_trips IS 'User-saved frequent routes for quick calculator access';

-- ----------------------------------------------------------------------------
-- BOOKING_RECORDS TABLE
-- Records of booked loads from quotes
-- ----------------------------------------------------------------------------
CREATE TABLE booking_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Pickup contact
    pickup_contact_name VARCHAR(100),
    pickup_contact_phone VARCHAR(20),
    pickup_date DATE NOT NULL,
    pickup_time VARCHAR(20),

    -- Delivery contact
    delivery_contact_name VARCHAR(100),
    delivery_contact_phone VARCHAR(20),
    delivery_date DATE NOT NULL,
    delivery_time VARCHAR(20),

    -- Special instructions
    special_instructions TEXT,

    -- Payment
    payment_method VARCHAR(20) DEFAULT 'standard',
    quickpay_fee_rate DECIMAL(5,4) DEFAULT 0,
    original_rate DECIMAL(10,2) NOT NULL,
    fee_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,

    -- Confirmation
    confirmation_email VARCHAR(255),
    confirmation_sms VARCHAR(20),
    confirmation_sent_at TIMESTAMP WITH TIME ZONE,

    -- Status
    status VARCHAR(20) DEFAULT 'pending',

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE booking_records IS 'Booked load records with pickup/delivery details';

-- ----------------------------------------------------------------------------
-- USER_REWARDS TABLE
-- Achievement and rewards tracking
-- ----------------------------------------------------------------------------
CREATE TABLE user_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Reward details
    reward_type VARCHAR(50) NOT NULL,
    reward_name VARCHAR(100) NOT NULL,
    description TEXT,

    -- Progress
    current_progress INTEGER DEFAULT 0 CHECK (current_progress >= 0),
    target_progress INTEGER NOT NULL CHECK (target_progress > 0),
    is_completed BOOLEAN DEFAULT false,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    earned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_rewards IS 'User achievements, rewards, and progress tracking';

-- ----------------------------------------------------------------------------
-- REFERRALS TABLE
-- User referral tracking
-- ----------------------------------------------------------------------------
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES users(id) ON DELETE SET NULL,

    referral_code VARCHAR(20) NOT NULL UNIQUE,
    referral_email VARCHAR(255),

    status VARCHAR(20) DEFAULT 'pending',
    reward_earned DECIMAL(10,2) DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE referrals IS 'Referral program tracking';

-- ----------------------------------------------------------------------------
-- API_USAGE TABLE
-- Track API usage for rate limiting
-- ----------------------------------------------------------------------------
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    endpoint VARCHAR(100) NOT NULL,
    request_count INTEGER DEFAULT 1,

    -- Time window
    window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT date_trunc('hour', CURRENT_TIMESTAMP),

    -- Rate limit tracking
    daily_count INTEGER DEFAULT 1,
    monthly_count INTEGER DEFAULT 1,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE api_usage IS 'API usage tracking for rate limiting (e.g., quote calculations)';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = true;

-- Vehicles indexes
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_vehicles_user_active ON vehicles(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX idx_vehicles_primary ON vehicles(user_id, is_primary) WHERE is_primary = true;

-- User settings indexes
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Quotes indexes
CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_vehicle_id ON quotes(vehicle_id);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_user_status ON quotes(user_id, status);
CREATE INDEX idx_quotes_origin_state ON quotes(origin_state);
CREATE INDEX idx_quotes_destination_state ON quotes(destination_state);
CREATE INDEX idx_quotes_pickup_date ON quotes(pickup_date);
CREATE INDEX idx_quotes_total_rate ON quotes(total_rate);
CREATE INDEX idx_quotes_expires ON quotes(expires_at) WHERE status = 'calculated';

-- Fuel price cache indexes
CREATE INDEX idx_fuel_price_state ON fuel_price_cache(state_code);
CREATE INDEX idx_fuel_price_expires ON fuel_price_cache(expires_at);
CREATE INDEX idx_fuel_price_state_type ON fuel_price_cache(state_code, fuel_type);

-- Toll cache indexes
CREATE INDEX idx_toll_cache_route ON toll_cache(origin_hash, destination_hash);
CREATE INDEX idx_toll_cache_expires ON toll_cache(expires_at);
CREATE INDEX idx_toll_cache_vehicle ON toll_cache(vehicle_type, axle_count);

-- Saved trips indexes
CREATE INDEX idx_saved_trips_user_id ON saved_trips(user_id);
CREATE INDEX idx_saved_trips_favorite ON saved_trips(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_saved_trips_use_count ON saved_trips(user_id, use_count DESC);

-- Booking records indexes
CREATE INDEX idx_booking_records_quote ON booking_records(quote_id);
CREATE INDEX idx_booking_records_user ON booking_records(user_id);
CREATE INDEX idx_booking_records_pickup ON booking_records(pickup_date);
CREATE INDEX idx_booking_records_status ON booking_records(status);

-- User rewards indexes
CREATE INDEX idx_user_rewards_user ON user_rewards(user_id);
CREATE INDEX idx_user_rewards_type ON user_rewards(reward_type);
CREATE INDEX idx_user_rewards_completed ON user_rewards(user_id, is_completed);

-- Referrals indexes
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status);

-- API usage indexes
CREATE INDEX idx_api_usage_user ON api_usage(user_id);
CREATE INDEX idx_api_usage_window ON api_usage(user_id, window_start);
CREATE INDEX idx_api_usage_endpoint ON api_usage(endpoint, window_start);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_trips_updated_at
    BEFORE UPDATE ON saved_trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_records_updated_at
    BEFORE UPDATE ON booking_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to create default settings for new users
CREATE OR REPLACE FUNCTION create_default_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_user_settings_on_signup
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_user_settings();

-- Function to hash addresses for toll cache lookup
CREATE OR REPLACE FUNCTION hash_address(address TEXT)
RETURNS VARCHAR(64) AS $$
BEGIN
    RETURN encode(digest(lower(trim(address)), 'sha256'), 'hex');
END;
$$ language 'plpgsql' IMMUTABLE;

COMMENT ON FUNCTION hash_address IS 'Creates SHA-256 hash of address for toll cache lookup';

-- ============================================================================
-- VIEWS
-- ============================================================================

-- User dashboard stats view
CREATE VIEW user_dashboard_stats AS
SELECT
    u.id as user_id,
    u.name,
    u.user_type,
    COUNT(DISTINCT v.id) as vehicle_count,
    COUNT(DISTINCT q.id) as total_quotes,
    COUNT(DISTINCT q.id) FILTER (WHERE q.status = 'booked') as booked_quotes,
    COALESCE(SUM(q.total_rate) FILTER (WHERE q.status = 'completed'), 0) as total_revenue,
    COALESCE(AVG(q.rpm) FILTER (WHERE q.status IN ('booked', 'completed')), 0) as avg_rpm,
    MAX(q.created_at) as last_quote_at
FROM users u
LEFT JOIN vehicles v ON v.user_id = u.id AND v.is_active = true
LEFT JOIN quotes q ON q.user_id = u.id
GROUP BY u.id, u.name, u.user_type;

COMMENT ON VIEW user_dashboard_stats IS 'Aggregated user statistics for dashboard display';

-- Recent quotes view
CREATE VIEW recent_quotes AS
SELECT
    q.*,
    v.name as vehicle_name,
    v.vehicle_type
FROM quotes q
LEFT JOIN vehicles v ON q.vehicle_id = v.id
WHERE q.created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
ORDER BY q.created_at DESC;

COMMENT ON VIEW recent_quotes IS 'Last 30 days of quotes with vehicle information';

-- ============================================================================
-- SEED DATA FOR DEFAULTS
-- ============================================================================

-- Insert default fuel prices (will be updated by API)
INSERT INTO fuel_price_cache (state_code, price_per_gallon, source) VALUES
('AL', 3.25, 'manual'),
('AK', 4.15, 'manual'),
('AZ', 3.45, 'manual'),
('AR', 3.20, 'manual'),
('CA', 4.85, 'manual'),
('CO', 3.35, 'manual'),
('CT', 3.75, 'manual'),
('DE', 3.45, 'manual'),
('FL', 3.40, 'manual'),
('GA', 3.25, 'manual'),
('HI', 4.95, 'manual'),
('ID', 3.50, 'manual'),
('IL', 3.55, 'manual'),
('IN', 3.35, 'manual'),
('IA', 3.30, 'manual'),
('KS', 3.25, 'manual'),
('KY', 3.30, 'manual'),
('LA', 3.20, 'manual'),
('ME', 3.65, 'manual'),
('MD', 3.50, 'manual'),
('MA', 3.70, 'manual'),
('MI', 3.45, 'manual'),
('MN', 3.40, 'manual'),
('MS', 3.15, 'manual'),
('MO', 3.20, 'manual'),
('MT', 3.45, 'manual'),
('NE', 3.30, 'manual'),
('NV', 3.85, 'manual'),
('NH', 3.55, 'manual'),
('NJ', 3.55, 'manual'),
('NM', 3.40, 'manual'),
('NY', 3.80, 'manual'),
('NC', 3.35, 'manual'),
('ND', 3.40, 'manual'),
('OH', 3.40, 'manual'),
('OK', 3.15, 'manual'),
('OR', 3.95, 'manual'),
('PA', 3.70, 'manual'),
('RI', 3.60, 'manual'),
('SC', 3.25, 'manual'),
('SD', 3.35, 'manual'),
('TN', 3.25, 'manual'),
('TX', 3.10, 'manual'),
('UT', 3.50, 'manual'),
('VT', 3.65, 'manual'),
('VA', 3.40, 'manual'),
('WA', 4.25, 'manual'),
('WV', 3.45, 'manual'),
('WI', 3.40, 'manual'),
('WY', 3.45, 'manual'),
('DC', 3.65, 'manual')
ON CONFLICT (state_code, fuel_type) DO NOTHING;
