import React, { useState } from 'react';
import { IoCubeOutline } from "react-icons/io5";
import { LuWeight } from "react-icons/lu";
import Loaddetailsrefrigerator from './Loaddetailsrefrigerator';
import { Input, Select, Button, Checkbox } from "@/components/ui";
import { useAppContext } from "@/context/AppContext";

function Ratecalcloaddetails({ setStage, onPrevious }) {
  const { calculatorData, updateCalculatorData } = useAppContext();

  const [weight, setWeight] = useState(calculatorData.weight || "");
  const [freightType, setFreightType] = useState(calculatorData.freightClass || "general");
  const [commodity, setCommodity] = useState(calculatorData.commodity || "");
  const [requiresEndorsement, setRequiresEndorsement] = useState(calculatorData.requiresEndorsement || false);
  const [militaryAccess, setMilitaryAccess] = useState(calculatorData.militaryAccess || false);
  const [distributionCenter, setDistributionCenter] = useState(calculatorData.distributionCenter || false);
  const [paperworkRequired, setPaperworkRequired] = useState(calculatorData.paperworkRequired || false);

  // Map display values to backend values
  const freightTypeMap = {
    "general": "general",
    "refrigerated": "refrigerated",
    "hazmat": "hazmat",
    "oversized": "oversized",
  };

  const displayToBackendMap = {
    "Dry Van": "general",
    "Refrigerated": "refrigerated",
    "Flatbed": "general",
    "Oversized": "oversized",
    "Hazardous Material": "hazmat",
    "Tanker": "hazmat",
  };

  const backendToDisplayMap = {
    "general": "Dry Van",
    "refrigerated": "Refrigerated",
    "hazmat": "Hazardous Material",
    "oversized": "Oversized",
  };

  const [displayFreightType, setDisplayFreightType] = useState(
    backendToDisplayMap[calculatorData.freightClass] || "Dry Van"
  );

  const handleFreightChange = (e) => {
    setDisplayFreightType(e.target.value);
    setFreightType(displayToBackendMap[e.target.value] || "general");
  };

  const handleNext = () => {
    updateCalculatorData({
      weight: parseInt(weight) || 0,
      freightClass: freightType,
      commodity,
      requiresEndorsement,
      militaryAccess,
      distributionCenter,
      paperworkRequired,
    });
    setStage("Service");
  };

  return (
    <div className='p-4 bg-white'>
      <div className='flex gap-3 items-center mb-4'>
        <IoCubeOutline className='text-blue-600' size={25} />
        <p className='text-xl font-semibold text-neutral-900'>Load Details</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Input
          label="Weight (Lbs)"
          type="number"
          placeholder="Enter weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          icon={<LuWeight size={20} />}
        />

        <Select
          label="Freight Type"
          value={displayFreightType}
          onChange={handleFreightChange}
          options={[
            { value: "Dry Van", label: "Dry Van" },
            { value: "Refrigerated", label: "Refrigerated" },
            { value: "Flatbed", label: "Flatbed" },
            { value: "Oversized", label: "Oversized" },
            { value: "Hazardous Material", label: "Hazardous Material" },
            { value: "Tanker", label: "Tanker" },
          ]}
        />
        {displayFreightType === "Refrigerated" && <Loaddetailsrefrigerator />}
      </div>
      <div className='mt-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label="Commodity"
            type="text"
            placeholder='e.g Electronics, Food, Products, etc.'
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
          />
          {displayFreightType === "Oversized" && (
            <Input
              label="Oversized dimensions"
              type="text"
              placeholder="12'W x 14'H x 53'L"
            />
          )}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
          <Checkbox
            label="Requires endorsement"
            checked={requiresEndorsement}
            onChange={(e) => setRequiresEndorsement(e.target.checked)}
          />
          <Checkbox
            label="Military/Restricted Access"
            checked={militaryAccess}
            onChange={(e) => setMilitaryAccess(e.target.checked)}
          />
          <Checkbox
            label="Distribution Center"
            checked={distributionCenter}
            onChange={(e) => setDistributionCenter(e.target.checked)}
          />
          <div className='sm:col-span-2 lg:col-span-3'>
            <Checkbox
              label="Requires printed paperwork/documentation ($15 fee)"
              description="Physical documentation required for shipment"
              checked={paperworkRequired}
              onChange={(e) => setPaperworkRequired(e.target.checked)}
            />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row justify-between gap-3 mt-4'>
          <Button
            onClick={onPrevious}
            variant="secondary"
            size="lg"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
          >
            Next: Service Details
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Ratecalcloaddetails;