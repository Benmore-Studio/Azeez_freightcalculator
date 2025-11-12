// Centralized mock vehicles data
// This simulates the user's saved vehicles from the database
// Will be replaced with actual API calls when backend is ready

export const mockVehicles = [
  {
    id: 1,
    name: "Main Truck",
    type: "Semi Truck",
    year: 2020,
    make: "Freightliner",
    model: "Cascadia",
    mpg: 6.5,
    fuelType: "Diesel",
    equipment: "dry-van", // Single equipment type for calculator
    iconType: "truck",
  },
  {
    id: 2,
    name: "Backup Van",
    type: "Sprinter Van",
    year: 2021,
    make: "Mercedes",
    model: "Sprinter 2500",
    mpg: 18.0,
    fuelType: "Diesel",
    equipment: "dry-van",
    iconType: "van",
  },
  {
    id: 3,
    name: "Secondary Truck",
    type: "Semi Truck",
    year: 2019,
    make: "Volvo",
    model: "VNL 760",
    mpg: 6.8,
    fuelType: "Diesel",
    equipment: "flatbed",
    iconType: "truck",
  },
];

export const mockTrips = [
  {
    id: 1,
    name: "Chicago → LA",
    origin: "Chicago, IL",
    destination: "Los Angeles, CA",
    distance: 2015,
  },
  {
    id: 2,
    name: "Dallas → Atlanta",
    origin: "Dallas, TX",
    destination: "Atlanta, GA",
    distance: 780,
  },
  {
    id: 3,
    name: "Miami → NYC",
    origin: "Miami, FL",
    destination: "New York, NY",
    distance: 1280,
  },
];

// Get vehicles formatted for calculator
export function getVehiclesForCalculator() {
  return mockVehicles.map(v => ({
    id: v.id,
    name: v.name,
    equipment: v.equipment,
    mpg: v.mpg,
    type: v.type
  }));
}

// Get trips formatted for calculator
export function getTripsForCalculator() {
  return mockTrips;
}
