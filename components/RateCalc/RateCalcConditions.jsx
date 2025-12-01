import React, { useState } from 'react'
import { TiWeatherCloudy } from "react-icons/ti";
import { IoSearchOutline } from "react-icons/io5";
import { Input, Select, Button } from "@/components/ui";

function RateCalcConditions({ setStage, onPrevious, onComplete }) {
  const [weatherCondition, setWeatherCondition] = useState("Normal");
  const [season, setSeason] = useState("Fall");
  const [fuelPrice, setFuelPrice] = useState("3.50");
  const [destinationMarket, setDestinationMarket] = useState("Neutral");

  const handleCalculateRate = () => {
    // Collect all form data from this stage and pass to parent
    const conditionsData = {
      weatherCondition,
      season,
      fuelPrice: parseFloat(fuelPrice),
      destinationMarket
    };

    // Call the onComplete handler passed from parent
    if (onComplete) {
      onComplete(conditionsData);
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
        <Input
          label="Fuel Price ($/gallon)"
          type="number"
          step="0.01"
          value={fuelPrice}
          onChange={(e) => setFuelPrice(e.target.value)}
          helperText="Auto-calculated based on current route prices"
        />

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
        >
          Back
        </Button>
        <Button
          onClick={handleCalculateRate}
          size="lg"
          icon={<IoSearchOutline size={20}/>}
          iconPosition="left"
        >
          Calculate Rate
        </Button>
      </div>
    </div>
  )
}

export default RateCalcConditions
