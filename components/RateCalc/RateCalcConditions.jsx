import React, { useState, useEffect } from 'react'
import { TiWeatherCloudy } from "react-icons/ti";
import { IoSearchOutline } from "react-icons/io5";
import { Settings } from "lucide-react";
import { Input, Select, Button, Spinner } from "@/components/ui";
import { useAppContext } from "@/context/AppContext";
import { quotesApi } from "@/lib/api";
import { showToast } from "@/lib/toast";

function RateCalcConditions({ setStage, onPrevious, onComplete }) {
  const { calculatorData, updateCalculatorData, userSettings } = useAppContext();

  // Map backend values to display values
  const weatherBackendToDisplay = {
    "normal": "Normal",
    "light_rain": "Light Rain",
    "heavy_rain": "Heavy Rain",
    "snow": "Snow",
    "extreme": "Extreme Weather",
  };

  const seasonBackendToDisplay = {
    "spring": "Spring",
    "summer": "Summer",
    "fall": "Fall",
    "winter": "Winter",
  };

  const marketBackendToDisplay = {
    "hot": "Hot Market",
    "neutral": "Neutral",
    "slow": "Slow Market",
  };

  // Get default fuel price from user settings or fallback to industry default
  const getDefaultFuelPrice = () => {
    if (calculatorData.fuelPrice) return calculatorData.fuelPrice.toString();
    if (userSettings?.fuelCostPerGallon) return userSettings.fuelCostPerGallon.toString();
    return "3.50";
  };

  // Determine current season based on date
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "Spring";
    if (month >= 5 && month <= 7) return "Summer";
    if (month >= 8 && month <= 10) return "Fall";
    return "Winter";
  };

  const [weatherCondition, setWeatherCondition] = useState(
    weatherBackendToDisplay[calculatorData.weatherConditions] || "Normal"
  );
  const [season, setSeason] = useState(
    seasonBackendToDisplay[calculatorData.season] || getCurrentSeason()
  );
  const [fuelPrice, setFuelPrice] = useState(getDefaultFuelPrice());
  const [fuelPriceFromSettings, setFuelPriceFromSettings] = useState(false);
  const [destinationMarket, setDestinationMarket] = useState(
    marketBackendToDisplay[calculatorData.destinationMarket] || "Neutral"
  );
  const [isCalculating, setIsCalculating] = useState(false);

  // Update fuel price when settings load
  useEffect(() => {
    if (userSettings?.fuelCostPerGallon && !calculatorData.fuelPrice) {
      setFuelPrice(userSettings.fuelCostPerGallon.toString());
      setFuelPriceFromSettings(true);
    }
  }, [userSettings, calculatorData.fuelPrice]);

  const handleCalculateRate = async () => {
    // Map display values to backend values
    const weatherDisplayToBackend = {
      "Normal": "normal",
      "Light Rain": "light_rain",
      "Heavy Rain": "heavy_rain",
      "Snow": "snow",
      "Extreme Weather": "extreme",
    };

    const seasonDisplayToBackend = {
      "Spring": "spring",
      "Summer": "summer",
      "Fall": "fall",
      "Winter": "winter",
    };

    const marketDisplayToBackend = {
      "Hot Market": "hot",
      "Neutral": "neutral",
      "Slow Market": "slow",
    };

    // Update context with conditions data
    const conditionsUpdate = {
      weatherConditions: weatherDisplayToBackend[weatherCondition] || "normal",
      season: seasonDisplayToBackend[season] || "fall",
      fuelPrice: parseFloat(fuelPrice) || 3.50,
      destinationMarket: marketDisplayToBackend[destinationMarket] || "neutral",
    };
    updateCalculatorData(conditionsUpdate);

    // Build API request payload
    const apiPayload = {
      origin: calculatorData.origin,
      destination: calculatorData.destination,
      vehicleType: calculatorData.vehicleType,
      vehicleId: calculatorData.vehicleId,
      loadType: calculatorData.loadType,
      weight: calculatorData.weight,
      freightClass: calculatorData.freightClass,
      weatherConditions: conditionsUpdate.weatherConditions,
      fuelPrice: conditionsUpdate.fuelPrice,
      deadheadMiles: calculatorData.deadheadMiles,
      specialServices: calculatorData.specialEquipment || [],
    };

    setIsCalculating(true);

    try {
      // Call the API
      const result = await quotesApi.calculateRate(apiPayload);

      // Transform API result to Quote component format
      const quoteData = {
        // Basic info from calculator
        origin: calculatorData.origin,
        destination: calculatorData.destination,
        deadheadMiles: calculatorData.deadheadMiles,
        // Rate data from API
        recommendedRate: {
          total: result.recommendedRate,
          perMile: result.ratePerMile,
          miles: result.totalMiles,
          label: "Competitive",
        },
        spotMarketRate: {
          total: result.maxRate,
          perMile: result.maxRate / result.totalMiles,
          label: "Current Market",
        },
        contractRate: {
          total: result.minRate,
          perMile: result.minRate / result.totalMiles,
          label: "Competitive",
        },
        breakdown: {
          baseRate: result.costBreakdown?.baseCost || 0,
          fuelSurcharge: result.costBreakdown?.fuelCost || 0,
          deadheadCost: result.costBreakdown?.deadheadCost || 0,
          costPerMile: result.costPerMile || 1.75,
          maintenanceCost: result.costBreakdown?.maintenanceCost || 0,
          tireCost: result.costBreakdown?.tireCost || 0,
          fixedCosts: result.costBreakdown?.fixedCosts || 0,
          profitMargin: result.costBreakdown?.profitMargin || 0,
        },
        serviceFees: result.serviceFees || {},
        routeAnalysis: {
          pickup: {
            region: "Northeast",
            truckToFreightRatio: 0.5,
            marketCondition: destinationMarket === "Hot Market" ? "Hot" : destinationMarket === "Slow Market" ? "Cold" : "Warm",
            rateNegotiation: "Negotiate higher rates (carrier advantage)",
          },
          delivery: {
            region: "Northeast",
            truckToFreightRatio: 0.5,
            marketCondition: destinationMarket === "Hot Market" ? "Hot" : destinationMarket === "Slow Market" ? "Cold" : "Warm",
            nextLoadPotential: "High (easy to find next load)",
            availableLoads: 85,
          },
        },
        marketAnalysis: {
          loadBoardStats: {
            truckToLoadRatio: 1.22,
            marketTrend: "Stable",
            averageRate: result.ratePerMile,
            loadVolume: 507,
            totalLoadsInDestination: 416,
            destinationRadius: 100,
          },
          nextMoneyLanes: [
            { id: 1, miles: 789, loadsAvailable: 21, ratePerMile: 3.41 },
            { id: 2, miles: 755, loadsAvailable: 13, ratePerMile: 2.96 },
            { id: 3, miles: 879, loadsAvailable: 13, ratePerMile: 2.77 },
          ],
        },
        bookingInfo: {
          calculatedRate: result.recommendedRate,
          confirmationTime: "1 business hour",
        },
        // Raw API result for saving
        _apiResult: result,
        _calculatorData: { ...calculatorData, ...conditionsUpdate },
      };

      // Call the onComplete handler passed from parent
      if (onComplete) {
        onComplete(quoteData);
      }
    } catch (error) {
      console.error("Rate calculation error:", error);
      showToast.error(error.message || "Failed to calculate rate");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className='p-4 bg-white'>
      <div className='flex gap-3 items-center mb-4'>
        <TiWeatherCloudy className='text-blue-600' size={25}/>
        <p className='text-xl font-semibold text-neutral-900'>Conditions & Equipment</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Weather Conditions */}
        <Select
          label="Weather Conditions"
          value={weatherCondition}
          onChange={(e) => setWeatherCondition(e.target.value)}
          options={[
            { value: "Normal", label: "Normal" },
            { value: "Light Rain", label: "Light Rain" },
            { value: "Heavy Rain", label: "Heavy Rain" },
            { value: "Snow", label: "Snow" },
            { value: "Extreme Weather", label: "Extreme Weather" },
          ]}
        />

        {/* Season */}
        <Select
          label="Season"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          options={[
            { value: "Spring", label: "Spring" },
            { value: "Summer", label: "Summer" },
            { value: "Fall", label: "Fall" },
            { value: "Winter", label: "Winter" },
          ]}
        />

        {/* Fuel Price */}
        <div>
          <Input
            label="Fuel Price ($/gallon)"
            type="number"
            step="0.01"
            value={fuelPrice}
            onChange={(e) => {
              setFuelPrice(e.target.value);
              setFuelPriceFromSettings(false);
            }}
            helperText={
              fuelPriceFromSettings
                ? "From your saved settings"
                : "Enter current fuel price per gallon"
            }
          />
          {fuelPriceFromSettings && (
            <div className="flex items-center gap-1 mt-1">
              <Settings size={12} className="text-blue-500" />
              <span className="text-xs text-blue-600">Using your settings</span>
            </div>
          )}
        </div>

        {/* Destination Market */}
        <Select
          label="Destination Market"
          value={destinationMarket}
          onChange={(e) => setDestinationMarket(e.target.value)}
          options={[
            { value: "Hot Market", label: "Hot Market" },
            { value: "Neutral", label: "Neutral" },
            { value: "Slow Market", label: "Slow Market" },
          ]}
          helperText="Market rating is auto-detected based on destination"
        />
      </div>

      {/* Navigation Buttons */}
      <div className='flex flex-col sm:flex-row justify-between gap-3 mt-4'>
        <Button
          onClick={onPrevious}
          variant="secondary"
          size="lg"
          disabled={isCalculating}
        >
          Back
        </Button>
        <Button
          onClick={handleCalculateRate}
          size="lg"
          icon={isCalculating ? <Spinner size="sm" /> : <IoSearchOutline size={20}/>}
          iconPosition="left"
          disabled={isCalculating}
        >
          {isCalculating ? "Calculating..." : "Calculate Rate"}
        </Button>
      </div>
    </div>
  )
}

export default RateCalcConditions
