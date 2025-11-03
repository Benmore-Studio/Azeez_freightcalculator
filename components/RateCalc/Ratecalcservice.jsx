import React, { useState } from 'react';
import { IoNewspaperOutline, IoCalendarOutline } from 'react-icons/io5';
import { BsPeople } from 'react-icons/bs';
import { Input, Select, Button, Checkbox } from "@/components/ui";

function Ratecalcservice({ setStage }) {
  const [formData, setFormData] = useState({
    deliveryDate: '',
    deliveryTime: '',
    deliveryUrgency: 'Standard',
    driverType: 'Solo Driver',
    serviceLevel: 'Driver Assist',
    trackingRequirements: 'Standard (Check Calls)',
    specialEquipment: []
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
    <div className='p-4 sm:p-6 bg-white'>
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
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
        <Select
          label="Delivery Urgency"
          value={formData.deliveryUrgency}
          onChange={(e) => handleInputChange('deliveryUrgency', e.target.value)}
          options={[
            { value: 'Standard', label: 'Standard (Base rate)' },
            { value: 'Express', label: 'Express (+15%)' },
            { value: 'Rush', label: 'Rush (+30%)' },
            { value: 'Same Day', label: 'Same Day (+50%)' },
          ]}
        />
        <Select
          label="Driver Type"
          value={formData.driverType}
          onChange={(e) => handleInputChange('driverType', e.target.value)}
          options={[
            { value: 'Solo Driver', label: 'Solo Driver' },
            { value: 'Team Driver', label: 'Team Driver' },
          ]}
        />
      </div>

      {/* Service Level & Tracking Requirements */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
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
      <div className='mt-6'>
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
      <div className='flex flex-col sm:flex-row justify-between gap-3 mt-6'>
        <Button
          onClick={() => setStage('Load Details')}
          variant="secondary"
          size="lg"
        >
          Previous
        </Button>
        <Button
          onClick={() => setStage('Conditions')}
          size="lg"
        >
          Next: Conditions
        </Button>
      </div>
    </div>
  );
}

export default Ratecalcservice;
