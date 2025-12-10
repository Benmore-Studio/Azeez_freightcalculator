import React, { useState } from 'react';
import { IoNewspaperOutline, IoCalendarOutline } from 'react-icons/io5';
import { BsPeople } from 'react-icons/bs';
import { Input, Select, Button, Checkbox } from "@/components/ui";
import { useAppContext } from "@/context/AppContext";

function Ratecalcservice({ setStage, onPrevious }) {
  const { calculatorData, updateCalculatorData, userSettings } = useAppContext();

  // Get user's custom multipliers or use defaults
  const getMultiplierDisplay = (type) => {
    const defaults = {
      standard: 1.0,
      express: 1.15,
      rush: 1.30,
      sameDay: 1.50,
      teamDriver: 1.50,
    };

    if (!userSettings) return defaults[type];

    const settingsMap = {
      standard: Number(userSettings.standardMultiplier) || defaults.standard,
      express: Number(userSettings.expressMultiplier) || defaults.express,
      rush: Number(userSettings.rushMultiplier) || defaults.rush,
      sameDay: Number(userSettings.sameDayMultiplier) || defaults.sameDay,
      teamDriver: Number(userSettings.teamDriverMultiplier) || defaults.teamDriver,
    };

    return settingsMap[type] || defaults[type];
  };

  // Format multiplier as percentage
  const formatMultiplier = (multiplier) => {
    if (multiplier === 1.0) return 'Base rate';
    const percentage = Math.round((multiplier - 1) * 100);
    return `+${percentage}%`;
  };

  // Map backend values to display values
  const urgencyBackendToDisplay = {
    "standard": "Standard",
    "express": "Express",
    "rush": "Rush",
    "same_day": "Same Day",
  };

  const driverBackendToDisplay = {
    "solo": "Solo Driver",
    "team": "Team Driver",
  };

  const serviceLevelBackendToDisplay = {
    "driver_assist": "Driver Assist",
    "white_glove": "White Glove",
    "inside_delivery": "Inside Delivery",
    "curbside": "Curbside",
  };

  const trackingBackendToDisplay = {
    "standard": "Standard (Check Calls)",
    "realtime_gps": "Real-time GPS",
    "enhanced": "Enhanced",
    "none": "None",
  };

  const [formData, setFormData] = useState({
    deliveryDate: calculatorData.deliveryDate || '',
    deliveryTime: calculatorData.deliveryTime || '',
    deliveryUrgency: urgencyBackendToDisplay[calculatorData.deliveryUrgency] || 'Standard',
    driverType: driverBackendToDisplay[calculatorData.driverType] || 'Solo Driver',
    serviceLevel: serviceLevelBackendToDisplay[calculatorData.serviceLevel] || 'Driver Assist',
    trackingRequirements: trackingBackendToDisplay[calculatorData.trackingRequirements] || 'Standard (Check Calls)',
    specialEquipment: calculatorData.specialEquipment || []
  });

  const handleEquipmentToggle = (equipment) => {
    setFormData(prev => ({
      ...prev,
      specialEquipment: prev.specialEquipment.includes(equipment)
        ? prev.specialEquipment.filter(item => item !== equipment)
        : [...prev.specialEquipment, equipment]
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className='p-4 bg-white'>
      {/* Header */}
      <div className='flex gap-3 items-center mb-4'>
        <IoNewspaperOutline className='text-blue-600' size={25} />
        <p className='text-xl font-semibold text-neutral-900'>Service Requirements</p>
      </div>

      {/* Delivery Date & Time Section */}
      <div>
        <div className='flex items-center gap-2 mb-3'>
          <IoCalendarOutline size={20} className='text-neutral-600' />
          <p className='font-semibold text-neutral-900'>Delivery Date & Time</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            type='date'
            value={formData.deliveryDate}
            onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
            label="Delivery Date"
            helperText='Required delivery date'
          />
          <Select
            label="Delivery Time"
            value={formData.deliveryTime}
            onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
            options={[
              { value: 'morning', label: 'Morning (8AM - 12PM)' },
              { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
              { value: 'evening', label: 'Evening (5PM - 9PM)' },
            ]}
            placeholder="Select time"
            helperText='Preferred delivery window'
          />
        </div>
      </div>

      {/* Delivery Urgency & Driver Type */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
        <Select
          label="Delivery Urgency"
          value={formData.deliveryUrgency}
          onChange={(e) => handleInputChange('deliveryUrgency', e.target.value)}
          options={[
            { value: 'Standard', label: `Standard (${formatMultiplier(getMultiplierDisplay('standard'))})` },
            { value: 'Express', label: `Express (${formatMultiplier(getMultiplierDisplay('express'))})` },
            { value: 'Rush', label: `Rush (${formatMultiplier(getMultiplierDisplay('rush'))})` },
            { value: 'Same Day', label: `Same Day (${formatMultiplier(getMultiplierDisplay('sameDay'))})` },
          ]}
          helperText={userSettings ? "Rates from your settings" : "Using industry default rates"}
        />
        <Select
          label="Driver Type"
          value={formData.driverType}
          onChange={(e) => handleInputChange('driverType', e.target.value)}
          options={[
            { value: 'Solo Driver', label: 'Solo Driver (Base rate)' },
            { value: 'Team Driver', label: `Team Driver (${formatMultiplier(getMultiplierDisplay('teamDriver'))})` },
          ]}
        />
      </div>

      {/* Service Level & Tracking Requirements */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
        <Select
          label="Service Level"
          value={formData.serviceLevel}
          onChange={(e) => handleInputChange('serviceLevel', e.target.value)}
          options={[
            { value: 'Driver Assist', label: 'Driver Assist' },
            { value: 'White Glove', label: 'White Glove' },
            { value: 'Inside Delivery', label: 'Inside Delivery' },
            { value: 'Curbside', label: 'Curbside' },
          ]}
        />
        <Select
          label="Tracking Requirements"
          value={formData.trackingRequirements}
          onChange={(e) => handleInputChange('trackingRequirements', e.target.value)}
          options={[
            { value: 'Standard (Check Calls)', label: 'Standard (Check Calls)' },
            { value: 'Real-time GPS', label: 'Real-time GPS' },
            { value: 'Enhanced', label: 'Enhanced' },
            { value: 'None', label: 'None' },
          ]}
        />
      </div>

      {/* Special Equipment Needed */}
      <div className='mt-4'>
        <p className='font-semibold text-neutral-900 mb-3'>Special Equipment Needed</p>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
          {[
            'Liftgate',
            'Pallet Jack',
            'Straps & Securement',
            'Tarps',
            'Temperature Monitoring',
            'Ramps',
            'Chains',
            'E-Track'
          ].map((equipment) => (
            <Checkbox
              key={equipment}
              label={equipment}
              checked={formData.specialEquipment.includes(equipment)}
              onChange={() => handleEquipmentToggle(equipment)}
            />
          ))}
        </div>
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
          onClick={() => {
            // Map display values to backend values
            const urgencyDisplayToBackend = {
              "Standard": "standard",
              "Express": "express",
              "Rush": "rush",
              "Same Day": "same_day",
            };

            const driverDisplayToBackend = {
              "Solo Driver": "solo",
              "Team Driver": "team",
            };

            const serviceLevelDisplayToBackend = {
              "Driver Assist": "driver_assist",
              "White Glove": "white_glove",
              "Inside Delivery": "inside_delivery",
              "Curbside": "curbside",
            };

            const trackingDisplayToBackend = {
              "Standard (Check Calls)": "standard",
              "Real-time GPS": "realtime_gps",
              "Enhanced": "enhanced",
              "None": "none",
            };

            updateCalculatorData({
              deliveryDate: formData.deliveryDate,
              deliveryTime: formData.deliveryTime,
              deliveryUrgency: urgencyDisplayToBackend[formData.deliveryUrgency] || "standard",
              driverType: driverDisplayToBackend[formData.driverType] || "solo",
              serviceLevel: serviceLevelDisplayToBackend[formData.serviceLevel] || "driver_assist",
              trackingRequirements: trackingDisplayToBackend[formData.trackingRequirements] || "standard",
              specialEquipment: formData.specialEquipment,
            });
            setStage('Conditions');
          }}
          size="lg"
        >
          Next: Conditions
        </Button>
      </div>
    </div>
  );
}

export default Ratecalcservice;
