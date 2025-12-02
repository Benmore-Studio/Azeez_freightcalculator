-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('owner_operator', 'fleet_manager', 'dispatcher');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('semi', 'box_truck', 'cargo_van', 'sprinter', 'reefer');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('dry_van', 'refrigerated', 'flatbed', 'step_deck', 'lowboy', 'tanker', 'conestoga', 'specialized');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('diesel', 'gasoline', 'cng', 'lng', 'electric', 'hybrid');

-- CreateEnum
CREATE TYPE "WeatherCondition" AS ENUM ('normal', 'light_rain', 'heavy_rain', 'snow', 'ice', 'extreme_weather', 'fog');

-- CreateEnum
CREATE TYPE "MarketTemperature" AS ENUM ('hot', 'warm', 'balanced', 'cool', 'cold');

-- CreateEnum
CREATE TYPE "RateTrend" AS ENUM ('rising', 'stable', 'falling');

-- CreateEnum
CREATE TYPE "LoadType" AS ENUM ('full_truckload', 'partial', 'ltl');

-- CreateEnum
CREATE TYPE "FreightClass" AS ENUM ('dry_van', 'refrigerated', 'flatbed', 'oversized', 'hazmat', 'tanker');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('draft', 'calculated', 'booked', 'completed', 'cancelled', 'expired');

-- CreateEnum
CREATE TYPE "FuelSource" AS ENUM ('eia', 'opus', 'manual');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "company_name" TEXT,
    "user_type" "UserType" NOT NULL DEFAULT 'owner_operator',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "onboarding_step" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vin" TEXT,
    "year" INTEGER,
    "make" TEXT,
    "model" TEXT,
    "vehicle_type" "VehicleType" NOT NULL,
    "equipment_type" "EquipmentType" NOT NULL DEFAULT 'dry_van',
    "fuel_type" "FuelType" NOT NULL DEFAULT 'diesel',
    "mpg" DECIMAL(4,2),
    "axle_count" INTEGER NOT NULL DEFAULT 5,
    "has_sleeper" BOOLEAN NOT NULL DEFAULT false,
    "payload_capacity" INTEGER,
    "gross_vehicle_weight" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "annual_insurance" DECIMAL(10,2) NOT NULL DEFAULT 12000.00,
    "monthly_vehicle_payment" DECIMAL(10,2) NOT NULL DEFAULT 1500.00,
    "annual_miles" INTEGER NOT NULL DEFAULT 100000,
    "annual_licensing" DECIMAL(10,2) NOT NULL DEFAULT 2500.00,
    "monthly_overhead" DECIMAL(10,2) NOT NULL DEFAULT 500.00,
    "maintenance_cpm" DECIMAL(6,4) NOT NULL DEFAULT 0.15,
    "fuel_cpm" DECIMAL(6,4),
    "tire_cpm" DECIMAL(6,4) NOT NULL DEFAULT 0.05,
    "factoring_rate" DECIMAL(5,4) NOT NULL DEFAULT 0.03,
    "profit_margin" DECIMAL(5,4) NOT NULL DEFAULT 0.15,
    "expedite_multiplier" DECIMAL(4,2) NOT NULL DEFAULT 1.30,
    "team_multiplier" DECIMAL(4,2) NOT NULL DEFAULT 1.50,
    "rush_multiplier" DECIMAL(4,2) NOT NULL DEFAULT 1.50,
    "same_day_multiplier" DECIMAL(4,2) NOT NULL DEFAULT 2.00,
    "detention_rate_per_hour" DECIMAL(8,2) NOT NULL DEFAULT 75.00,
    "driver_assist_fee" DECIMAL(8,2) NOT NULL DEFAULT 100.00,
    "white_glove_fee" DECIMAL(8,2) NOT NULL DEFAULT 250.00,
    "tracking_fee" DECIMAL(8,2) NOT NULL DEFAULT 25.00,
    "special_equipment_fee" DECIMAL(8,2) NOT NULL DEFAULT 150.00,
    "liftgate_fee" DECIMAL(8,2) NOT NULL DEFAULT 75.00,
    "pallet_jack_fee" DECIMAL(8,2) NOT NULL DEFAULT 50.00,
    "def_price_per_gallon" DECIMAL(6,2) NOT NULL DEFAULT 3.50,
    "reefer_maintenance_per_hour" DECIMAL(8,2) NOT NULL DEFAULT 25.00,
    "reefer_fuel_per_hour" DECIMAL(6,2) NOT NULL DEFAULT 1.50,
    "use_industry_defaults" BOOLEAN NOT NULL DEFAULT true,
    "default_deadhead_miles" INTEGER NOT NULL DEFAULT 50,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vehicle_id" TEXT,
    "origin_address" TEXT NOT NULL,
    "origin_city" TEXT,
    "origin_state" TEXT,
    "origin_zip" TEXT,
    "origin_lat" DECIMAL(10,7),
    "origin_lng" DECIMAL(10,7),
    "destination_address" TEXT NOT NULL,
    "destination_city" TEXT,
    "destination_state" TEXT,
    "destination_zip" TEXT,
    "destination_lat" DECIMAL(10,7),
    "destination_lng" DECIMAL(10,7),
    "total_miles" INTEGER NOT NULL,
    "deadhead_miles" INTEGER NOT NULL DEFAULT 0,
    "states_crossed" JSONB NOT NULL DEFAULT '[]',
    "estimated_drive_time_hours" DECIMAL(6,2),
    "load_weight" INTEGER,
    "load_type" "LoadType" NOT NULL DEFAULT 'full_truckload',
    "freight_class" "FreightClass" NOT NULL DEFAULT 'dry_van',
    "commodity_type" TEXT,
    "hazmat_class" TEXT,
    "is_expedite" BOOLEAN NOT NULL DEFAULT false,
    "is_team" BOOLEAN NOT NULL DEFAULT false,
    "is_reefer" BOOLEAN NOT NULL DEFAULT false,
    "is_rush" BOOLEAN NOT NULL DEFAULT false,
    "is_same_day" BOOLEAN NOT NULL DEFAULT false,
    "requires_liftgate" BOOLEAN NOT NULL DEFAULT false,
    "requires_pallet_jack" BOOLEAN NOT NULL DEFAULT false,
    "requires_driver_assist" BOOLEAN NOT NULL DEFAULT false,
    "requires_white_glove" BOOLEAN NOT NULL DEFAULT false,
    "requires_tracking" BOOLEAN NOT NULL DEFAULT false,
    "reefer_mode" TEXT,
    "reefer_temp_min" DECIMAL(5,2),
    "reefer_temp_max" DECIMAL(5,2),
    "pickup_date" DATE,
    "pickup_time_window" TEXT,
    "delivery_date" DATE,
    "delivery_time_window" TEXT,
    "weather_condition" "WeatherCondition" NOT NULL DEFAULT 'normal',
    "season" TEXT,
    "service_fees" JSONB NOT NULL DEFAULT '{}',
    "cost_breakdown" JSONB NOT NULL DEFAULT '{}',
    "total_rate" DECIMAL(10,2) NOT NULL,
    "rpm" DECIMAL(6,4),
    "cpm" DECIMAL(6,4),
    "profit_per_mile" DECIMAL(6,4),
    "profit_total" DECIMAL(10,2),
    "tolls" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "fuel_cost" DECIMAL(8,2),
    "fuel_price_used" DECIMAL(6,3),
    "market_data" JSONB NOT NULL DEFAULT '{}',
    "weather_data" JSONB NOT NULL DEFAULT '{}',
    "acceptance_score" DECIMAL(4,2),
    "acceptance_rating" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'calculated',
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "booked_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fuel_price_cache" (
    "id" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,
    "price_per_gallon" DECIMAL(6,3) NOT NULL,
    "fuel_type" "FuelType" NOT NULL DEFAULT 'diesel',
    "source" "FuelSource" NOT NULL DEFAULT 'eia',
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fuel_price_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toll_cache" (
    "id" TEXT NOT NULL,
    "origin_hash" TEXT NOT NULL,
    "destination_hash" TEXT NOT NULL,
    "vehicle_type" "VehicleType" NOT NULL,
    "axle_count" INTEGER NOT NULL DEFAULT 5,
    "toll_amount" DECIMAL(8,2) NOT NULL,
    "toll_count" INTEGER NOT NULL DEFAULT 0,
    "route_data" JSONB NOT NULL DEFAULT '{}',
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toll_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_trips" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "origin_city" TEXT,
    "origin_state" TEXT,
    "destination" TEXT NOT NULL,
    "destination_city" TEXT,
    "destination_state" TEXT,
    "distance" INTEGER,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "use_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3),

    CONSTRAINT "saved_trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_records" (
    "id" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "pickup_contact_name" TEXT,
    "pickup_contact_phone" TEXT,
    "pickup_date" DATE NOT NULL,
    "pickup_time" TEXT,
    "delivery_contact_name" TEXT,
    "delivery_contact_phone" TEXT,
    "delivery_date" DATE NOT NULL,
    "delivery_time" TEXT,
    "special_instructions" TEXT,
    "payment_method" TEXT NOT NULL DEFAULT 'standard',
    "quickpay_fee_rate" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "original_rate" DECIMAL(10,2) NOT NULL,
    "fee_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "final_amount" DECIMAL(10,2) NOT NULL,
    "confirmation_email" TEXT,
    "confirmation_sms" TEXT,
    "confirmation_sent_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_rewards" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reward_type" TEXT NOT NULL,
    "reward_name" TEXT NOT NULL,
    "description" TEXT,
    "current_progress" INTEGER NOT NULL DEFAULT 0,
    "target_progress" INTEGER NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "earned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "referrer_id" TEXT NOT NULL,
    "referred_id" TEXT,
    "referral_code" TEXT NOT NULL,
    "referral_email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reward_earned" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_usage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "request_count" INTEGER NOT NULL DEFAULT 1,
    "window_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daily_count" INTEGER NOT NULL DEFAULT 1,
    "monthly_count" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "vehicles_user_id_idx" ON "vehicles"("user_id");

-- CreateIndex
CREATE INDEX "vehicles_user_id_is_active_idx" ON "vehicles"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "vehicles_vehicle_type_idx" ON "vehicles"("vehicle_type");

-- CreateIndex
CREATE INDEX "vehicles_user_id_is_primary_idx" ON "vehicles"("user_id", "is_primary");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "quotes_user_id_idx" ON "quotes"("user_id");

-- CreateIndex
CREATE INDEX "quotes_vehicle_id_idx" ON "quotes"("vehicle_id");

-- CreateIndex
CREATE INDEX "quotes_created_at_idx" ON "quotes"("created_at" DESC);

-- CreateIndex
CREATE INDEX "quotes_status_idx" ON "quotes"("status");

-- CreateIndex
CREATE INDEX "quotes_user_id_status_idx" ON "quotes"("user_id", "status");

-- CreateIndex
CREATE INDEX "quotes_origin_state_idx" ON "quotes"("origin_state");

-- CreateIndex
CREATE INDEX "quotes_destination_state_idx" ON "quotes"("destination_state");

-- CreateIndex
CREATE INDEX "quotes_pickup_date_idx" ON "quotes"("pickup_date");

-- CreateIndex
CREATE INDEX "quotes_total_rate_idx" ON "quotes"("total_rate");

-- CreateIndex
CREATE INDEX "fuel_price_cache_state_code_idx" ON "fuel_price_cache"("state_code");

-- CreateIndex
CREATE INDEX "fuel_price_cache_expires_at_idx" ON "fuel_price_cache"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "fuel_price_cache_state_code_fuel_type_key" ON "fuel_price_cache"("state_code", "fuel_type");

-- CreateIndex
CREATE INDEX "toll_cache_origin_hash_destination_hash_idx" ON "toll_cache"("origin_hash", "destination_hash");

-- CreateIndex
CREATE INDEX "toll_cache_expires_at_idx" ON "toll_cache"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "toll_cache_origin_hash_destination_hash_vehicle_type_axle_c_key" ON "toll_cache"("origin_hash", "destination_hash", "vehicle_type", "axle_count");

-- CreateIndex
CREATE INDEX "saved_trips_user_id_idx" ON "saved_trips"("user_id");

-- CreateIndex
CREATE INDEX "saved_trips_user_id_is_favorite_idx" ON "saved_trips"("user_id", "is_favorite");

-- CreateIndex
CREATE INDEX "saved_trips_user_id_use_count_idx" ON "saved_trips"("user_id", "use_count" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "booking_records_quote_id_key" ON "booking_records"("quote_id");

-- CreateIndex
CREATE INDEX "booking_records_quote_id_idx" ON "booking_records"("quote_id");

-- CreateIndex
CREATE INDEX "booking_records_user_id_idx" ON "booking_records"("user_id");

-- CreateIndex
CREATE INDEX "booking_records_pickup_date_idx" ON "booking_records"("pickup_date");

-- CreateIndex
CREATE INDEX "booking_records_status_idx" ON "booking_records"("status");

-- CreateIndex
CREATE INDEX "user_rewards_user_id_idx" ON "user_rewards"("user_id");

-- CreateIndex
CREATE INDEX "user_rewards_reward_type_idx" ON "user_rewards"("reward_type");

-- CreateIndex
CREATE INDEX "user_rewards_user_id_is_completed_idx" ON "user_rewards"("user_id", "is_completed");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_referred_id_key" ON "referrals"("referred_id");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_referral_code_key" ON "referrals"("referral_code");

-- CreateIndex
CREATE INDEX "referrals_referrer_id_idx" ON "referrals"("referrer_id");

-- CreateIndex
CREATE INDEX "referrals_referral_code_idx" ON "referrals"("referral_code");

-- CreateIndex
CREATE INDEX "referrals_status_idx" ON "referrals"("status");

-- CreateIndex
CREATE INDEX "api_usage_user_id_idx" ON "api_usage"("user_id");

-- CreateIndex
CREATE INDEX "api_usage_user_id_window_start_idx" ON "api_usage"("user_id", "window_start");

-- CreateIndex
CREATE INDEX "api_usage_endpoint_window_start_idx" ON "api_usage"("endpoint", "window_start");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_trips" ADD CONSTRAINT "saved_trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_records" ADD CONSTRAINT "booking_records_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_records" ADD CONSTRAINT "booking_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_usage" ADD CONSTRAINT "api_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

