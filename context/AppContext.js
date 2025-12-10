"use client";
import { useContext, createContext, useState, useCallback, useEffect } from "react";
import { settingsApi } from "@/lib/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [vehicle, setVehicle] = useState("Semitruck");
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    profile_type: "",
  });
  const [costdata, setCostdata] = useState({
    radio: "default",
    defaultPayloads: {
      Semitruck: 45000,
      sprintervan: 3500,
      boxtruck: 10000,
      cargovan: 1500,
    },
    customPayloads: {
      Semitruck: 45000,
      sprintervan: 3500,
      boxtruck: 10000,
      cargovan: 1500,
    },
    variablecosts: {
      fuel: 0.65,
      maintenance: 0.2,
      driver: 0.55,
      miscellaneous: 0.02,
    },
    fixedcosts: {
      truck: { price: 600, frequency: "m" },
      insurance: { price: 450, frequency: "m" },
      permits: { price: 80, frequency: "m" },
      licenses: { price: 150, frequency: "m" },
      other: 100,
    },
    frequency: "monthly",
    milesdriven: 10000,
  });

  // User settings from database
  const [userSettings, setUserSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState(null);

  // Fetch user settings
  const fetchUserSettings = useCallback(async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const settings = await settingsApi.getSettings();
      setUserSettings(settings);
      return settings;
    } catch (error) {
      console.error("Failed to fetch user settings:", error);
      setSettingsError(error.message);
      return null;
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  // Check if user has custom settings (not using defaults)
  const hasCustomSettings = useCallback(() => {
    if (!userSettings) return false;
    // Check if any setting differs from default values
    const defaults = {
      truckPayment: 1800,
      insurance: 1500,
      permits: 300,
      overhead: 500,
      fuelCostPerMile: 0.65,
      maintenanceCostPerMile: 0.15,
      tireCostPerMile: 0.05,
      profitMargin: 0.15,
    };

    return (
      Number(userSettings.truckPayment) !== defaults.truckPayment ||
      Number(userSettings.insurance) !== defaults.insurance ||
      Number(userSettings.fuelCostPerMile) !== defaults.fuelCostPerMile ||
      Number(userSettings.profitMargin) !== defaults.profitMargin
    );
  }, [userSettings]);

  const [vehicleinfo, setVehicleinfo] = useState({
    type: "",
    vin: "",
    year: "",
    make: "",
    model: "",
    fuel_type: "",
    avg_mpg: "",
    equipment_type: [],
    endorsements: [],
    extras: "",
  });
  const [vehicles, setVehicles] = useState([]);

  // Calculator form data - persists across stages
  const [calculatorData, setCalculatorData] = useState({
    // Stage 1: Location
    origin: "",
    destination: "",
    deadheadMiles: 0,
    loadType: "full_load", // full_load or ltl
    vehicleId: null,
    vehicleType: "semi_truck",
    equipmentType: "dry_van",
    // Stage 2: Load Details
    weight: 0,
    freightClass: "general",
    commodity: "",
    requiresEndorsement: false,
    militaryAccess: false,
    distributionCenter: false,
    paperworkRequired: false,
    // Stage 3: Service
    deliveryDate: "",
    deliveryTime: "",
    deliveryUrgency: "standard",
    driverType: "solo",
    serviceLevel: "driver_assist",
    trackingRequirements: "standard",
    specialEquipment: [],
    // Stage 4: Conditions
    weatherConditions: "normal",
    season: "fall",
    fuelPrice: 3.5,
    destinationMarket: "neutral",
  });

  // Update specific calculator fields
  const updateCalculatorData = useCallback((updates) => {
    setCalculatorData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset calculator data
  const resetCalculatorData = useCallback(() => {
    setCalculatorData({
      origin: "",
      destination: "",
      deadheadMiles: 0,
      loadType: "full_load",
      vehicleId: null,
      vehicleType: "semi_truck",
      equipmentType: "dry_van",
      weight: 0,
      freightClass: "general",
      commodity: "",
      requiresEndorsement: false,
      militaryAccess: false,
      distributionCenter: false,
      paperworkRequired: false,
      deliveryDate: "",
      deliveryTime: "",
      deliveryUrgency: "standard",
      driverType: "solo",
      serviceLevel: "driver_assist",
      trackingRequirements: "standard",
      specialEquipment: [],
      weatherConditions: "normal",
      season: "fall",
      fuelPrice: 3.5,
      destinationMarket: "neutral",
    });
  }, []);

  // Legacy ratecalc state for backwards compatibility
  const [ratecalc, setRatecalc] = useState({
    origin: "",
    destination: "",
    transport_details: [],
    load_type: "",
    weight: "",
    freight_type: "",
    commodity: "",
    load_details: [],
    paperwork_required: false,
    delivery_date: Date(""),
    delivery_time: "",
    delivery_urgency: "",
    driver_type: "",
    service_level: "",
    tracking_requirements: "",
    special_equipment: [],
    weather_conditions: "",
    season: "",
    fuel_price: "",
    destination_market: "",
  });

  return (
    <AppContext.Provider
      value={{
        formdata,
        setFormdata,
        costdata,
        setCostdata,
        vehicleinfo,
        setVehicleinfo,
        vehicles,
        setVehicles,
        ratecalc,
        setRatecalc,
        vehicle,
        setVehicle,
        // New calculator state
        calculatorData,
        setCalculatorData,
        updateCalculatorData,
        resetCalculatorData,
        // User settings
        userSettings,
        setUserSettings,
        settingsLoading,
        settingsError,
        fetchUserSettings,
        hasCustomSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}