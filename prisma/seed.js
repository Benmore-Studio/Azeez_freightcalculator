// ============================================================================
// FREIGHT CALCULATOR - Database Seed Script
// ============================================================================
// Run with: npx prisma db seed
// ============================================================================

import { PrismaClient } from '../lib/generated/prisma/index.js'
import { createHash } from 'crypto'

const prisma = new PrismaClient({
  errorFormat: 'pretty',
})

// Helper to hash passwords (in production, use bcrypt)
function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex')
}

// Helper to hash addresses for toll cache
function hashAddress(address) {
  return createHash('sha256').update(address.toLowerCase().trim()).digest('hex')
}

// Helper for dates
function daysFromNow(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

function hoursFromNow(hours) {
  const date = new Date()
  date.setHours(date.getHours() + hours)
  return date
}

async function main() {
  console.log('🌱 Starting database seed...\n')

  // =========================================================================
  // 1. SEED USERS
  // =========================================================================
  console.log('👤 Creating test users...')

  const users = await Promise.all([
    // Owner Operator - Primary test user
    prisma.user.upsert({
      where: { email: 'john.trucker@example.com' },
      update: {},
      create: {
        email: 'john.trucker@example.com',
        passwordHash: hashPassword('password123'),
        name: 'John Trucker',
        phone: '555-123-4567',
        companyName: 'JT Trucking LLC',
        userType: 'owner_operator',
        isActive: true,
        isVerified: true,
        emailVerifiedAt: new Date(),
        onboardingCompleted: true,
        onboardingStep: 5,
      },
    }),

    // Fleet Manager
    prisma.user.upsert({
      where: { email: 'sarah.fleet@example.com' },
      update: {},
      create: {
        email: 'sarah.fleet@example.com',
        passwordHash: hashPassword('password123'),
        name: 'Sarah Fleet',
        phone: '555-234-5678',
        companyName: 'Swift Fleet Solutions',
        userType: 'fleet_manager',
        isActive: true,
        isVerified: true,
        emailVerifiedAt: new Date(),
        onboardingCompleted: true,
        onboardingStep: 5,
      },
    }),

    // Dispatcher
    prisma.user.upsert({
      where: { email: 'mike.dispatch@example.com' },
      update: {},
      create: {
        email: 'mike.dispatch@example.com',
        passwordHash: hashPassword('password123'),
        name: 'Mike Dispatcher',
        phone: '555-345-6789',
        companyName: 'Central Dispatch Co',
        userType: 'dispatcher',
        isActive: true,
        isVerified: true,
        emailVerifiedAt: new Date(),
        onboardingCompleted: true,
        onboardingStep: 5,
      },
    }),

    // New user (mid-onboarding)
    prisma.user.upsert({
      where: { email: 'new.user@example.com' },
      update: {},
      create: {
        email: 'new.user@example.com',
        passwordHash: hashPassword('password123'),
        name: 'New User',
        phone: '555-456-7890',
        userType: 'owner_operator',
        isActive: true,
        isVerified: false,
        onboardingCompleted: false,
        onboardingStep: 2,
      },
    }),
  ])

  console.log(`   ✅ Created ${users.length} users`)

  const [johnTrucker, sarahFleet, mikeDispatch] = users

  // =========================================================================
  // 2. SEED USER SETTINGS
  // =========================================================================
  console.log('⚙️  Creating user settings...')

  const settings = await Promise.all([
    // John - Custom settings (experienced owner-operator)
    prisma.userSettings.upsert({
      where: { userId: johnTrucker.id },
      update: {},
      create: {
        userId: johnTrucker.id,
        annualInsurance: 14500.00,
        monthlyVehiclePayment: 1850.00,
        annualMiles: 120000,
        annualLicensing: 3200.00,
        monthlyOverhead: 650.00,
        maintenanceCpm: 0.18,
        tireCpm: 0.06,
        factoringRate: 0.025,
        profitMargin: 0.20,
        expediteMultiplier: 1.35,
        teamMultiplier: 1.55,
        rushMultiplier: 1.45,
        sameDayMultiplier: 2.10,
        detentionRatePerHour: 85.00,
        driverAssistFee: 125.00,
        whiteGloveFee: 300.00,
        trackingFee: 30.00,
        useIndustryDefaults: false,
        defaultDeadheadMiles: 75,
      },
    }),

    // Sarah - Industry defaults (fleet uses standard rates)
    prisma.userSettings.upsert({
      where: { userId: sarahFleet.id },
      update: {},
      create: {
        userId: sarahFleet.id,
        useIndustryDefaults: true,
        annualMiles: 500000, // Fleet runs more miles
        profitMargin: 0.12, // Lower margin, higher volume
      },
    }),

    // Mike - Industry defaults
    prisma.userSettings.upsert({
      where: { userId: mikeDispatch.id },
      update: {},
      create: {
        userId: mikeDispatch.id,
        useIndustryDefaults: true,
      },
    }),
  ])

  console.log(`   ✅ Created ${settings.length} user settings`)

  // =========================================================================
  // 3. SEED VEHICLES
  // =========================================================================
  console.log('🚛 Creating vehicles...')

  const vehicles = await Promise.all([
    // John's Semi Truck (Primary)
    prisma.vehicle.create({
      data: {
        userId: johnTrucker.id,
        name: 'Big Blue',
        vin: '1FUJGLDR5CLBP8834',
        year: 2021,
        make: 'Freightliner',
        model: 'Cascadia',
        vehicleType: 'semi',
        equipmentType: 'dry_van',
        fuelType: 'diesel',
        mpg: 7.2,
        axleCount: 5,
        hasSleeper: true,
        payloadCapacity: 45000,
        grossVehicleWeight: 80000,
        isActive: true,
        isPrimary: true,
      },
    }),

    // John's backup rig
    prisma.vehicle.create({
      data: {
        userId: johnTrucker.id,
        name: 'Old Faithful',
        vin: '3AKJGLDR7HSLA4421',
        year: 2018,
        make: 'Kenworth',
        model: 'T680',
        vehicleType: 'semi',
        equipmentType: 'flatbed',
        fuelType: 'diesel',
        mpg: 6.8,
        axleCount: 5,
        hasSleeper: true,
        payloadCapacity: 48000,
        grossVehicleWeight: 80000,
        isActive: true,
        isPrimary: false,
      },
    }),

    // Sarah's Fleet - Semi 1
    prisma.vehicle.create({
      data: {
        userId: sarahFleet.id,
        name: 'Fleet Unit 101',
        vin: '1XKYD49X4EJ394821',
        year: 2022,
        make: 'Peterbilt',
        model: '579',
        vehicleType: 'semi',
        equipmentType: 'dry_van',
        fuelType: 'diesel',
        mpg: 7.5,
        axleCount: 5,
        hasSleeper: true,
        payloadCapacity: 44000,
        grossVehicleWeight: 80000,
        isActive: true,
        isPrimary: true,
      },
    }),

    // Sarah's Fleet - Semi 2
    prisma.vehicle.create({
      data: {
        userId: sarahFleet.id,
        name: 'Fleet Unit 102',
        vin: '1XKYD49X5EJ394822',
        year: 2022,
        make: 'Peterbilt',
        model: '579',
        vehicleType: 'semi',
        equipmentType: 'refrigerated',
        fuelType: 'diesel',
        mpg: 6.5,
        axleCount: 5,
        hasSleeper: true,
        payloadCapacity: 42000,
        grossVehicleWeight: 80000,
        isActive: true,
        isPrimary: false,
      },
    }),

    // Sarah's Fleet - Box Truck
    prisma.vehicle.create({
      data: {
        userId: sarahFleet.id,
        name: 'Fleet Unit 201',
        vin: '1FVACWDT0HHJS9823',
        year: 2023,
        make: 'Freightliner',
        model: 'M2 106',
        vehicleType: 'box_truck',
        equipmentType: 'dry_van',
        fuelType: 'diesel',
        mpg: 10.5,
        axleCount: 2,
        hasSleeper: false,
        payloadCapacity: 12000,
        grossVehicleWeight: 26000,
        isActive: true,
        isPrimary: false,
      },
    }),

    // Sarah's Fleet - Sprinter
    prisma.vehicle.create({
      data: {
        userId: sarahFleet.id,
        name: 'Fleet Unit 301',
        vin: 'WDAPF4CC8G9A12345',
        year: 2023,
        make: 'Mercedes-Benz',
        model: 'Sprinter 3500',
        vehicleType: 'sprinter',
        equipmentType: 'dry_van',
        fuelType: 'diesel',
        mpg: 18.0,
        axleCount: 2,
        hasSleeper: false,
        payloadCapacity: 5000,
        grossVehicleWeight: 11500,
        isActive: true,
        isPrimary: false,
      },
    }),

    // Sarah's Fleet - Cargo Van
    prisma.vehicle.create({
      data: {
        userId: sarahFleet.id,
        name: 'Fleet Unit 401',
        vin: '1FTYR2XM8KKA98765',
        year: 2022,
        make: 'Ford',
        model: 'Transit 350',
        vehicleType: 'cargo_van',
        equipmentType: 'dry_van',
        fuelType: 'gasoline',
        mpg: 15.0,
        axleCount: 2,
        hasSleeper: false,
        payloadCapacity: 4000,
        grossVehicleWeight: 10360,
        isActive: true,
        isPrimary: false,
      },
    }),

    // Sarah's Fleet - Reefer
    prisma.vehicle.create({
      data: {
        userId: sarahFleet.id,
        name: 'Fleet Unit 501',
        vin: '1FUJGLDR8DLCE1234',
        year: 2021,
        make: 'Freightliner',
        model: 'Cascadia',
        vehicleType: 'reefer',
        equipmentType: 'refrigerated',
        fuelType: 'diesel',
        mpg: 6.2,
        axleCount: 5,
        hasSleeper: true,
        payloadCapacity: 40000,
        grossVehicleWeight: 80000,
        isActive: true,
        isPrimary: false,
      },
    }),
  ])

  console.log(`   ✅ Created ${vehicles.length} vehicles`)

  const johnSemi = vehicles[0]
  const johnFlatbed = vehicles[1]
  const sarahSemi = vehicles[2]
  const sarahReefer = vehicles[3]

  // =========================================================================
  // 4. SEED SAVED TRIPS
  // =========================================================================
  console.log('🗺️  Creating saved trips...')

  const savedTrips = await Promise.all([
    prisma.savedTrip.create({
      data: {
        userId: johnTrucker.id,
        name: 'Dallas → Chicago',
        origin: '1000 Main St, Dallas, TX 75201',
        originCity: 'Dallas',
        originState: 'TX',
        destination: '233 S Wacker Dr, Chicago, IL 60606',
        destinationCity: 'Chicago',
        destinationState: 'IL',
        distance: 920,
        isFavorite: true,
        useCount: 15,
      },
    }),
    prisma.savedTrip.create({
      data: {
        userId: johnTrucker.id,
        name: 'Houston → Atlanta',
        origin: '1600 Smith St, Houston, TX 77002',
        originCity: 'Houston',
        originState: 'TX',
        destination: '200 Peachtree St NE, Atlanta, GA 30303',
        destinationCity: 'Atlanta',
        destinationState: 'GA',
        distance: 790,
        isFavorite: true,
        useCount: 8,
      },
    }),
    prisma.savedTrip.create({
      data: {
        userId: johnTrucker.id,
        name: 'LA → Phoenix',
        origin: '350 S Grand Ave, Los Angeles, CA 90071',
        originCity: 'Los Angeles',
        originState: 'CA',
        destination: '201 E Washington St, Phoenix, AZ 85004',
        destinationCity: 'Phoenix',
        destinationState: 'AZ',
        distance: 370,
        isFavorite: false,
        useCount: 3,
      },
    }),
    prisma.savedTrip.create({
      data: {
        userId: sarahFleet.id,
        name: 'Miami → Jacksonville',
        origin: '100 Biscayne Blvd, Miami, FL 33132',
        originCity: 'Miami',
        originState: 'FL',
        destination: '501 W Adams St, Jacksonville, FL 32202',
        destinationCity: 'Jacksonville',
        destinationState: 'FL',
        distance: 345,
        isFavorite: true,
        useCount: 22,
      },
    }),
  ])

  console.log(`   ✅ Created ${savedTrips.length} saved trips`)

  // =========================================================================
  // 5. SEED QUOTES
  // =========================================================================
  console.log('📝 Creating sample quotes...')

  const quotes = await Promise.all([
    // Quote 1: Completed load (John)
    prisma.quote.create({
      data: {
        userId: johnTrucker.id,
        vehicleId: johnSemi.id,
        originAddress: '1000 Main St, Dallas, TX 75201',
        originCity: 'Dallas',
        originState: 'TX',
        originZip: '75201',
        originLat: 32.7767,
        originLng: -96.7970,
        destinationAddress: '233 S Wacker Dr, Chicago, IL 60606',
        destinationCity: 'Chicago',
        destinationState: 'IL',
        destinationZip: '60606',
        destinationLat: 41.8781,
        destinationLng: -87.6298,
        totalMiles: 920,
        deadheadMiles: 45,
        statesCrossed: ['TX', 'OK', 'KS', 'MO', 'IL'],
        estimatedDriveTimeHours: 14.5,
        loadWeight: 42000,
        loadType: 'full_truckload',
        freightClass: 'dry_van',
        commodityType: 'General Merchandise',
        pickupDate: daysFromNow(-7),
        pickupTimeWindow: '08:00 - 12:00',
        deliveryDate: daysFromNow(-6),
        deliveryTimeWindow: '14:00 - 18:00',
        weatherCondition: 'normal',
        season: 'fall',
        serviceFees: {
          tracking: 25.00,
          total_fees: 25.00,
        },
        costBreakdown: {
          fuel: { gallons: 127.78, price_per_gallon: 3.45, total: 440.84 },
          tolls: { count: 6, total: 85.50 },
          labor: { driver_pay: 414.00, per_mile: 0.45 },
          fixed_costs_allocated: { total: 95.68 },
          variable_costs: { maintenance: 165.60, tires: 55.20, total: 220.80 },
          total_cost: 1256.82,
          cost_per_mile: 1.37,
        },
        totalRate: 2484.00,
        rpm: 2.70,
        cpm: 1.37,
        profitPerMile: 1.33,
        profitTotal: 1227.18,
        tolls: 85.50,
        fuelCost: 440.84,
        fuelPriceUsed: 3.45,
        marketData: {
          origin: { market_temperature: 'warm', truck_to_load_ratio: 1.1 },
          destination: { market_temperature: 'hot', truck_to_load_ratio: 0.8 },
        },
        acceptanceScore: 8.5,
        acceptanceRating: 'EXCELLENT LOAD',
        status: 'completed',
        completedAt: daysFromNow(-5),
        bookedAt: daysFromNow(-8),
      },
    }),

    // Quote 2: Booked load (John)
    prisma.quote.create({
      data: {
        userId: johnTrucker.id,
        vehicleId: johnSemi.id,
        originAddress: '1600 Smith St, Houston, TX 77002',
        originCity: 'Houston',
        originState: 'TX',
        originZip: '77002',
        originLat: 29.7604,
        originLng: -95.3698,
        destinationAddress: '200 Peachtree St NE, Atlanta, GA 30303',
        destinationCity: 'Atlanta',
        destinationState: 'GA',
        destinationZip: '30303',
        destinationLat: 33.7490,
        destinationLng: -84.3880,
        totalMiles: 790,
        deadheadMiles: 60,
        statesCrossed: ['TX', 'LA', 'MS', 'AL', 'GA'],
        estimatedDriveTimeHours: 12.5,
        loadWeight: 38000,
        loadType: 'full_truckload',
        freightClass: 'dry_van',
        commodityType: 'Electronics',
        requiresTracking: true,
        pickupDate: daysFromNow(2),
        pickupTimeWindow: '06:00 - 10:00',
        deliveryDate: daysFromNow(3),
        deliveryTimeWindow: '12:00 - 16:00',
        weatherCondition: 'light_rain',
        season: 'fall',
        serviceFees: {
          tracking: 25.00,
          weather_surcharge: 79.00,
          total_fees: 104.00,
        },
        costBreakdown: {
          fuel: { gallons: 109.72, price_per_gallon: 3.35, total: 367.56 },
          tolls: { count: 4, total: 62.00 },
          total_cost: 1045.20,
          cost_per_mile: 1.32,
        },
        totalRate: 2212.00,
        rpm: 2.80,
        cpm: 1.32,
        profitPerMile: 1.48,
        profitTotal: 1166.80,
        tolls: 62.00,
        fuelCost: 367.56,
        fuelPriceUsed: 3.35,
        acceptanceScore: 7.8,
        acceptanceRating: 'GOOD LOAD',
        status: 'booked',
        bookedAt: daysFromNow(-1),
        expiresAt: daysFromNow(7),
      },
    }),

    // Quote 3: Calculated (pending) - Flatbed load (John)
    prisma.quote.create({
      data: {
        userId: johnTrucker.id,
        vehicleId: johnFlatbed.id,
        originAddress: '350 S Grand Ave, Los Angeles, CA 90071',
        originCity: 'Los Angeles',
        originState: 'CA',
        originZip: '90071',
        originLat: 34.0522,
        originLng: -118.2437,
        destinationAddress: '201 E Washington St, Phoenix, AZ 85004',
        destinationCity: 'Phoenix',
        destinationState: 'AZ',
        destinationZip: '85004',
        destinationLat: 33.4484,
        destinationLng: -112.0740,
        totalMiles: 370,
        deadheadMiles: 25,
        statesCrossed: ['CA', 'AZ'],
        estimatedDriveTimeHours: 5.5,
        loadWeight: 35000,
        loadType: 'full_truckload',
        freightClass: 'flatbed',
        commodityType: 'Steel Beams',
        requiresDriverAssist: true,
        pickupDate: daysFromNow(5),
        pickupTimeWindow: '07:00 - 11:00',
        deliveryDate: daysFromNow(5),
        deliveryTimeWindow: '15:00 - 19:00',
        weatherCondition: 'normal',
        season: 'fall',
        serviceFees: {
          driver_assist: 125.00,
          special_equipment: 150.00,
          total_fees: 275.00,
        },
        costBreakdown: {
          fuel: { gallons: 54.41, price_per_gallon: 4.15, total: 225.80 },
          tolls: { count: 0, total: 0 },
          total_cost: 485.40,
          cost_per_mile: 1.31,
        },
        totalRate: 1295.00,
        rpm: 3.50,
        cpm: 1.31,
        profitPerMile: 2.19,
        profitTotal: 809.60,
        tolls: 0,
        fuelCost: 225.80,
        fuelPriceUsed: 4.15,
        acceptanceScore: 9.2,
        acceptanceRating: 'EXCELLENT LOAD',
        status: 'calculated',
        expiresAt: hoursFromNow(24),
      },
    }),

    // Quote 4: Reefer load (Sarah Fleet)
    prisma.quote.create({
      data: {
        userId: sarahFleet.id,
        vehicleId: sarahReefer.id,
        originAddress: '100 Biscayne Blvd, Miami, FL 33132',
        originCity: 'Miami',
        originState: 'FL',
        originZip: '33132',
        originLat: 25.7617,
        originLng: -80.1918,
        destinationAddress: '501 W Adams St, Jacksonville, FL 32202',
        destinationCity: 'Jacksonville',
        destinationState: 'FL',
        destinationZip: '32202',
        destinationLat: 30.3322,
        destinationLng: -81.6557,
        totalMiles: 345,
        deadheadMiles: 15,
        statesCrossed: ['FL'],
        estimatedDriveTimeHours: 5.0,
        loadWeight: 38000,
        loadType: 'full_truckload',
        freightClass: 'refrigerated',
        commodityType: 'Frozen Seafood',
        isReefer: true,
        reeferMode: 'continuous',
        reeferTempMin: -10,
        reeferTempMax: 0,
        requiresTracking: true,
        pickupDate: daysFromNow(1),
        pickupTimeWindow: '04:00 - 06:00',
        deliveryDate: daysFromNow(1),
        deliveryTimeWindow: '12:00 - 14:00',
        weatherCondition: 'normal',
        season: 'fall',
        serviceFees: {
          tracking: 25.00,
          reefer_fuel: 45.00,
          total_fees: 70.00,
        },
        costBreakdown: {
          fuel: { gallons: 55.65, price_per_gallon: 3.55, total: 197.56 },
          reefer_fuel: { hours: 8, rate: 1.50, total: 12.00 },
          total_cost: 520.00,
          cost_per_mile: 1.51,
        },
        totalRate: 1380.00,
        rpm: 4.00,
        cpm: 1.51,
        profitPerMile: 2.49,
        profitTotal: 860.00,
        tolls: 0,
        fuelCost: 197.56,
        fuelPriceUsed: 3.55,
        acceptanceScore: 8.9,
        acceptanceRating: 'EXCELLENT LOAD',
        status: 'booked',
        bookedAt: new Date(),
        expiresAt: daysFromNow(3),
      },
    }),

    // Quote 5: Expedited team load (Sarah Fleet)
    prisma.quote.create({
      data: {
        userId: sarahFleet.id,
        vehicleId: sarahSemi.id,
        originAddress: '1 World Trade Center, New York, NY 10007',
        originCity: 'New York',
        originState: 'NY',
        originZip: '10007',
        originLat: 40.7128,
        originLng: -74.0060,
        destinationAddress: '555 California St, San Francisco, CA 94104',
        destinationCity: 'San Francisco',
        destinationState: 'CA',
        destinationZip: '94104',
        destinationLat: 37.7749,
        destinationLng: -122.4194,
        totalMiles: 2900,
        deadheadMiles: 35,
        statesCrossed: ['NY', 'NJ', 'PA', 'OH', 'IN', 'IL', 'IA', 'NE', 'WY', 'UT', 'NV', 'CA'],
        estimatedDriveTimeHours: 42.0,
        loadWeight: 40000,
        loadType: 'full_truckload',
        freightClass: 'dry_van',
        commodityType: 'Medical Supplies',
        isExpedite: true,
        isTeam: true,
        requiresTracking: true,
        pickupDate: daysFromNow(0),
        pickupTimeWindow: '18:00 - 20:00',
        deliveryDate: daysFromNow(2),
        deliveryTimeWindow: '08:00 - 12:00',
        weatherCondition: 'snow',
        season: 'fall',
        serviceFees: {
          expedite_surcharge: 2175.00,
          team_surcharge: 2175.00,
          tracking: 30.00,
          weather_surcharge: 435.00,
          total_fees: 4815.00,
        },
        costBreakdown: {
          fuel: { gallons: 386.67, price_per_gallon: 3.60, total: 1392.01 },
          tolls: { count: 18, total: 285.00 },
          labor: { team_driver_pay: 2030.00, per_mile: 0.70 },
          total_cost: 4150.00,
          cost_per_mile: 1.43,
        },
        totalRate: 11745.00,
        rpm: 4.05,
        cpm: 1.43,
        profitPerMile: 2.62,
        profitTotal: 7595.00,
        tolls: 285.00,
        fuelCost: 1392.01,
        fuelPriceUsed: 3.60,
        weatherData: {
          route_alerts: [
            { location: 'I-80 Wyoming', alert_type: 'Winter Storm Warning', severity: 'medium' },
          ],
          rate_impact: { surcharge_percent: 5, reason: 'Winter weather on route' },
        },
        acceptanceScore: 9.5,
        acceptanceRating: 'EXCELLENT LOAD',
        status: 'calculated',
        expiresAt: hoursFromNow(4),
      },
    }),

    // Quote 6: Expired quote
    prisma.quote.create({
      data: {
        userId: johnTrucker.id,
        vehicleId: johnSemi.id,
        originAddress: '100 Congress Ave, Austin, TX 78701',
        originCity: 'Austin',
        originState: 'TX',
        originZip: '78701',
        totalMiles: 450,
        deadheadMiles: 30,
        destinationAddress: '600 Congress Ave, Denver, CO 80203',
        destinationCity: 'Denver',
        destinationState: 'CO',
        destinationZip: '80203',
        statesCrossed: ['TX', 'NM', 'CO'],
        loadWeight: 35000,
        loadType: 'full_truckload',
        freightClass: 'dry_van',
        commodityType: 'Consumer Goods',
        weatherCondition: 'normal',
        totalRate: 1350.00,
        rpm: 3.00,
        cpm: 1.25,
        tolls: 45.00,
        status: 'expired',
        expiresAt: daysFromNow(-2),
      },
    }),
  ])

  console.log(`   ✅ Created ${quotes.length} quotes`)

  // =========================================================================
  // 6. SEED BOOKING RECORDS
  // =========================================================================
  console.log('📋 Creating booking records...')

  const bookedQuotes = quotes.filter(q => q.status === 'booked' || q.status === 'completed')

  const bookings = await Promise.all(
    bookedQuotes.map((quote, index) =>
      prisma.bookingRecord.create({
        data: {
          quoteId: quote.id,
          userId: quote.userId,
          pickupContactName: index === 0 ? 'Bob Shipper' : 'Alice Warehouse',
          pickupContactPhone: index === 0 ? '555-111-2222' : '555-333-4444',
          pickupDate: quote.pickupDate || new Date(),
          pickupTime: '08:00 AM',
          deliveryContactName: index === 0 ? 'Carol Receiver' : 'Dave Distribution',
          deliveryContactPhone: index === 0 ? '555-555-6666' : '555-777-8888',
          deliveryDate: quote.deliveryDate || daysFromNow(1),
          deliveryTime: '02:00 PM',
          specialInstructions: index === 0
            ? 'Call 30 minutes before arrival. Dock #5.'
            : 'Temperature sensitive - maintain cold chain.',
          paymentMethod: index === 0 ? 'standard' : 'quickpay',
          quickpayFeeRate: index === 0 ? 0 : 0.02,
          originalRate: Number(quote.totalRate),
          feeAmount: index === 0 ? 0 : Number(quote.totalRate) * 0.02,
          finalAmount: index === 0
            ? Number(quote.totalRate)
            : Number(quote.totalRate) * 0.98,
          confirmationEmail: quote.userId === johnTrucker.id
            ? 'john.trucker@example.com'
            : 'sarah.fleet@example.com',
          confirmationSentAt: new Date(),
          status: quote.status === 'completed' ? 'completed' : 'confirmed',
        },
      })
    )
  )

  console.log(`   ✅ Created ${bookings.length} booking records`)

  // =========================================================================
  // 7. SEED FUEL PRICE CACHE
  // =========================================================================
  console.log('⛽ Creating fuel price cache...')

  const fuelPrices = [
    { stateCode: 'TX', pricePerGallon: 3.15 },
    { stateCode: 'CA', pricePerGallon: 4.85 },
    { stateCode: 'FL', pricePerGallon: 3.45 },
    { stateCode: 'NY', pricePerGallon: 3.95 },
    { stateCode: 'IL', pricePerGallon: 3.65 },
    { stateCode: 'PA', pricePerGallon: 3.75 },
    { stateCode: 'OH', pricePerGallon: 3.45 },
    { stateCode: 'GA', pricePerGallon: 3.35 },
    { stateCode: 'AZ', pricePerGallon: 3.55 },
    { stateCode: 'CO', pricePerGallon: 3.40 },
    { stateCode: 'WA', pricePerGallon: 4.25 },
    { stateCode: 'OR', pricePerGallon: 4.05 },
    { stateCode: 'NV', pricePerGallon: 3.90 },
    { stateCode: 'UT', pricePerGallon: 3.50 },
    { stateCode: 'NM', pricePerGallon: 3.35 },
    { stateCode: 'OK', pricePerGallon: 3.10 },
    { stateCode: 'KS', pricePerGallon: 3.20 },
    { stateCode: 'MO', pricePerGallon: 3.25 },
    { stateCode: 'AR', pricePerGallon: 3.15 },
    { stateCode: 'LA', pricePerGallon: 3.10 },
    { stateCode: 'MS', pricePerGallon: 3.05 },
    { stateCode: 'AL', pricePerGallon: 3.20 },
    { stateCode: 'TN', pricePerGallon: 3.30 },
    { stateCode: 'KY', pricePerGallon: 3.35 },
    { stateCode: 'IN', pricePerGallon: 3.40 },
    { stateCode: 'MI', pricePerGallon: 3.55 },
    { stateCode: 'WI', pricePerGallon: 3.45 },
    { stateCode: 'MN', pricePerGallon: 3.40 },
    { stateCode: 'IA', pricePerGallon: 3.30 },
    { stateCode: 'NE', pricePerGallon: 3.25 },
    { stateCode: 'SD', pricePerGallon: 3.35 },
    { stateCode: 'ND', pricePerGallon: 3.40 },
    { stateCode: 'MT', pricePerGallon: 3.50 },
    { stateCode: 'WY', pricePerGallon: 3.45 },
    { stateCode: 'ID', pricePerGallon: 3.60 },
    { stateCode: 'NJ', pricePerGallon: 3.65 },
    { stateCode: 'CT', pricePerGallon: 3.80 },
    { stateCode: 'MA', pricePerGallon: 3.75 },
    { stateCode: 'VA', pricePerGallon: 3.45 },
    { stateCode: 'NC', pricePerGallon: 3.40 },
    { stateCode: 'SC', pricePerGallon: 3.30 },
  ]

  const fuelCacheEntries = await Promise.all(
    fuelPrices.map(fp =>
      prisma.fuelPriceCache.upsert({
        where: { stateCode_fuelType: { stateCode: fp.stateCode, fuelType: 'diesel' } },
        update: { pricePerGallon: fp.pricePerGallon, fetchedAt: new Date() },
        create: {
          stateCode: fp.stateCode,
          pricePerGallon: fp.pricePerGallon,
          fuelType: 'diesel',
          source: 'eia',
          expiresAt: hoursFromNow(24),
        },
      })
    )
  )

  console.log(`   ✅ Created ${fuelCacheEntries.length} fuel price cache entries`)

  // =========================================================================
  // 8. SEED TOLL CACHE
  // =========================================================================
  console.log('🛣️  Creating toll cache...')

  const tollCacheEntries = await Promise.all([
    prisma.tollCache.create({
      data: {
        originHash: hashAddress('1000 Main St, Dallas, TX 75201'),
        destinationHash: hashAddress('233 S Wacker Dr, Chicago, IL 60606'),
        vehicleType: 'semi',
        axleCount: 5,
        tollAmount: 85.50,
        tollCount: 6,
        routeData: {
          tolls: [
            { name: 'Dallas North Tollway', state: 'TX', amount: 8.50 },
            { name: 'Oklahoma Turnpike', state: 'OK', amount: 22.00 },
            { name: 'Kansas Turnpike', state: 'KS', amount: 18.75 },
            { name: 'I-70 Kansas', state: 'KS', amount: 12.25 },
            { name: 'Missouri I-70', state: 'MO', amount: 8.00 },
            { name: 'Illinois Tollway', state: 'IL', amount: 16.00 },
          ],
        },
        expiresAt: daysFromNow(7),
      },
    }),
    prisma.tollCache.create({
      data: {
        originHash: hashAddress('1600 Smith St, Houston, TX 77002'),
        destinationHash: hashAddress('200 Peachtree St NE, Atlanta, GA 30303'),
        vehicleType: 'semi',
        axleCount: 5,
        tollAmount: 62.00,
        tollCount: 4,
        routeData: {
          tolls: [
            { name: 'Sam Houston Tollway', state: 'TX', amount: 12.00 },
            { name: 'Louisiana I-10', state: 'LA', amount: 15.00 },
            { name: 'Alabama I-65', state: 'AL', amount: 18.00 },
            { name: 'Georgia 400', state: 'GA', amount: 17.00 },
          ],
        },
        expiresAt: daysFromNow(7),
      },
    }),
  ])

  console.log(`   ✅ Created ${tollCacheEntries.length} toll cache entries`)

  // =========================================================================
  // 9. SEED USER REWARDS
  // =========================================================================
  console.log('🏆 Creating user rewards...')

  const rewards = await Promise.all([
    // John's rewards
    prisma.userReward.create({
      data: {
        userId: johnTrucker.id,
        rewardType: 'milestone',
        rewardName: 'First Quote',
        description: 'Calculate your first freight rate quote',
        currentProgress: 1,
        targetProgress: 1,
        isCompleted: true,
        earnedAt: daysFromNow(-30),
      },
    }),
    prisma.userReward.create({
      data: {
        userId: johnTrucker.id,
        rewardType: 'milestone',
        rewardName: 'Road Warrior',
        description: 'Complete 10 booked loads',
        currentProgress: 8,
        targetProgress: 10,
        isCompleted: false,
      },
    }),
    prisma.userReward.create({
      data: {
        userId: johnTrucker.id,
        rewardType: 'streak',
        rewardName: 'Weekly Streak',
        description: 'Use the calculator every day for a week',
        currentProgress: 5,
        targetProgress: 7,
        isCompleted: false,
      },
    }),

    // Sarah's rewards
    prisma.userReward.create({
      data: {
        userId: sarahFleet.id,
        rewardType: 'milestone',
        rewardName: 'Fleet Builder',
        description: 'Add 5 vehicles to your fleet',
        currentProgress: 6,
        targetProgress: 5,
        isCompleted: true,
        earnedAt: daysFromNow(-14),
      },
    }),
    prisma.userReward.create({
      data: {
        userId: sarahFleet.id,
        rewardType: 'volume',
        rewardName: 'High Roller',
        description: 'Generate $50,000 in quotes',
        currentProgress: 35000,
        targetProgress: 50000,
        isCompleted: false,
        metadata: { currency: 'USD' },
      },
    }),
  ])

  console.log(`   ✅ Created ${rewards.length} user rewards`)

  // =========================================================================
  // 10. SEED REFERRALS
  // =========================================================================
  console.log('🤝 Creating referrals...')

  const referrals = await Promise.all([
    prisma.referral.create({
      data: {
        referrerId: johnTrucker.id,
        referralCode: 'JOHN2024',
        referralEmail: 'friend1@example.com',
        status: 'pending',
      },
    }),
    prisma.referral.create({
      data: {
        referrerId: sarahFleet.id,
        referralCode: 'SWIFT50',
        status: 'pending',
      },
    }),
  ])

  console.log(`   ✅ Created ${referrals.length} referrals`)

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n✨ Database seeding completed successfully!\n')
  console.log('📊 Summary:')
  console.log(`   • Users: ${users.length}`)
  console.log(`   • User Settings: ${settings.length}`)
  console.log(`   • Vehicles: ${vehicles.length}`)
  console.log(`   • Saved Trips: ${savedTrips.length}`)
  console.log(`   • Quotes: ${quotes.length}`)
  console.log(`   • Booking Records: ${bookings.length}`)
  console.log(`   • Fuel Prices: ${fuelCacheEntries.length}`)
  console.log(`   • Toll Cache: ${tollCacheEntries.length}`)
  console.log(`   • Rewards: ${rewards.length}`)
  console.log(`   • Referrals: ${referrals.length}`)

  console.log('\n🔑 Test Accounts:')
  console.log('   Email: john.trucker@example.com | Password: password123 (Owner Operator)')
  console.log('   Email: sarah.fleet@example.com  | Password: password123 (Fleet Manager)')
  console.log('   Email: mike.dispatch@example.com| Password: password123 (Dispatcher)')
  console.log('   Email: new.user@example.com    | Password: password123 (New User - Onboarding)')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
