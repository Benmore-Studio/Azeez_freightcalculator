import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import { TbLocation } from "react-icons/tb";
import { TbCube } from "react-icons/tb";
import { MdCallSplit } from "react-icons/md";
import { useState } from "react";
import { Input, Select, Button, Checkbox } from "@/components/ui";

function Ratecalclocation({setStage}) {
  const [loadtype, setLoadtype] = useState(null);
  return (
    <div className="p-4 sm:p-6">
      <div className="flex gap-3 items-center mb-4">
        <IoLocationOutline size={25} className="text-blue-600" />
        <p className="text-xl font-semibold text-neutral-900">Location Details</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Origin"
          type="text"
          placeholder="Chicago, IL or 60601"
          helperText="Enter city, state or ZIP code"
          icon={<IoLocationOutline />}
        />
        <Input
          label="Destination"
          type="text"
          placeholder="Los Angeles, CA or 90001"
          helperText="Enter city, state or ZIP code"
          icon={<IoLocationOutline />}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
        <Checkbox label="Airport Pickup" />
        <Checkbox label="Airport Delivery" />
        <Checkbox label="Requires TSA Clearance" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <FaArrowRightLong className="text-neutral-600" />
            <p className="font-semibold text-neutral-900">Deadhead Miles To Pickup</p>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0"
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="sm"
              icon={<TbLocation size={18} />}
              iconPosition="left"
              className="whitespace-nowrap"
            >
              Use Location
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <p className="font-semibold text-neutral-900">Load Type</p>
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => {
                setLoadtype("Full Load");
              }}
              className={`flex items-center px-2 py-3 gap-2 border-2 justify-center rounded-md cursor-pointer transition-all ${
                loadtype === "Full Load"
                  ? "border-blue-500 bg-blue-200/50"
                  : "border-gray-400 hover:border-gray-500"
              }`}
            >
              <TbCube size={25} className="text-blue-500 text-lg" />
              <p>Full Load</p>
            </div>
            <div
              onClick={() => {
                setLoadtype("LTL (Partial)");
              }}
              className={`flex items-center px-2 py-3 gap-2 border-2 justify-center rounded-md cursor-pointer transition-all ${
                loadtype === "LTL (Partial)"
                  ? "border-blue-500 bg-blue-200/50"
                  : "border-gray-400 hover:border-gray-500"
              }`}
            >
              <MdCallSplit size={25} className="text-blue-500 text-lg " />
              <p>LTL Partial</p>
            </div>
          </div>
        </div>
      </div>

      {loadtype === "LTL (Partial)" && (
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <Checkbox
            label="Dedicated truck required for LTL pickup"
            description="If checked, the truck will be dedicated to your load only, at a higher rate."
          />
        </div>
      )}
      <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg mt-6">
        <Select
          label="Select Equipment for this load"
          placeholder="Choose equipment type"
          options={[
            { value: "dry-van", label: "Dry Van" },
            { value: "refrigerated", label: "Refrigerated" },
            { value: "flatbed", label: "Flatbed" },
          ]}
          helperText="Selecting the right equipment helps calculate the most accurate rate"
        />
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {setStage("Load Details")}}
          size="lg"
        >
          Next: Load Details
        </Button>
      </div>
    </div>
  );
}

export default Ratecalclocation;
