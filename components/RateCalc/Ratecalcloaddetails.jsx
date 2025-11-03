import React from 'react'
import { IoCubeOutline } from "react-icons/io5";
import { LuWeight } from "react-icons/lu";
import { useState } from 'react';
import { AiOutlinePrinter } from "react-icons/ai";
import Loaddetailsrefrigerator from './Loaddetailsrefrigerator';
import { Input, Select, Button, Checkbox } from "@/components/ui";


function Ratecalcloaddetails({setStage}) {
  const [vehicle, setVehicle] = useState("Dry Van");
  const handleChange = (e) => {
    setVehicle(e.target.value);
  }
  return (
    <div className='p-4 sm:p-6 bg-white'>
        <div className='flex gap-3 items-center mb-4'>
            <IoCubeOutline className='text-blue-600' size={25}/>
            <p className='text-xl font-semibold text-neutral-900'>Load Details</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label="Weight (Lbs)"
            type="number"
            placeholder="Enter weight"
            icon={<LuWeight size={20}/>}
          />

          <Select
            label="Freight Type"
            value={vehicle}
            onChange={handleChange}
            options={[
              { value: "Dry Van", label: "Dry Van" },
              { value: "Refrigerated", label: "Refrigerated" },
              { value: "Flatbed", label: "Flatbed" },
              { value: "Oversized", label: "Oversized" },
              { value: "Hazardous Material", label: "Hazardous Material" },
              { value: "Tanker", label: "Tanker" },
            ]}
          />   
          {vehicle === "Refrigerated" && <Loaddetailsrefrigerator/>}       
        </div>
        <div className='mt-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label="Commodity"
              type="text"
              placeholder='e.g Electronics, Food, Products, etc.'
            />
            {vehicle === "Oversized" && (
              <Input
                label="Oversized dimensions"
                type="text"
                placeholder="12'W x 14'H x 53'L"
              />
            )}
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            <Checkbox label="Requires endorsement" />
            <Checkbox label="Military/Restricted Access" />
            <Checkbox label="Distribution Center" />
            <div className='sm:col-span-2 lg:col-span-3'>
              <Checkbox
                label="Requires printed paperwork/documentation ($15 fee)"
                description="Physical documentation required for shipment"
              />
            </div>
          </div>
          <div className='flex flex-col sm:flex-row justify-between gap-3 mt-6'>
            <Button
              onClick={() => {setStage("Location")}}
              variant="secondary"
              size="lg"
            >
              Previous
            </Button>
            <Button
              onClick={() => {setStage("Service")}}
              size="lg"
            >
              Next: Service Details
            </Button>
          </div>



        </div>
    </div>
  )
}

export default Ratecalcloaddetails;