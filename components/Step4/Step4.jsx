import React, { useState } from "react";
import Step4equipmenttype from "./Step4equipmenttype";
import { IoCubeOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { LuSave } from "react-icons/lu";
import { Container, Card, ProgressHeader, BackButton, Select, Input, Button } from "@/components/ui";

/**
 * Step4 Component - Vehicle Information Step
 *
 * This component collects vehicle details as part of the onboarding wizard.
 * It allows users to select vehicle type, enter VIN, and provide vehicle specifications.
 *
 * @param {number} barvalue - Current progress bar value (0-100)
 * @param {function} setBarvalue - Function to update progress bar value
 * @param {number} step - Current wizard step number
 * @param {function} setStep - Function to navigate between wizard steps
 */
function Step4({ barvalue, setBarvalue, step, setStep }) {
  // State to track which vehicle type is selected (semitruck, sprintervan, boxtruck, cargovan)
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // State to track if the textarea is focused for styling purposes
  const [selectinput, setSelectinput] = useState(false);

  // List of available vehicle makes/manufacturers
  const defaultcarvalues = [
    "Freightliner",
    "Peterbilt",
    "Kenworth",
    "Volvo",
    "International",
    "Mack",
    "Western Star",
    "Mercedes",
    "Ford",
    "RAM",
    "Chevrolet",
    "Isuzu",
    "Hino",
  ];

  // List of available vehicle models (specific to Ford Transit series)
  const defaultmodelvalues = [
    "Transit",
    "Transit connect",
    "E-series",
    "F-650",
    "F-750",
  ];

  // List of available fuel types for vehicles
  const defaultfuelvalues = [
    "gasoline",
    "diesel",
    "cng",
    "lng",
    "electric",
    "hybrid",
  ];

  return (
    <Container>
      <ProgressHeader
        title="Let's get you set up"
        percentage={Number(barvalue)}
        className="mt-4"
      />

      <BackButton
        onClick={() => {
          setStep(step - 1);
          setBarvalue("70");
        }}
        className="mt-6"
      />

      <Card className="mt-6">
        <h2 className="font-bold text-neutral-900 text-2xl">
          Vehicle Information
        </h2>
        <p className="text-neutral-600 text-sm mt-3">
          Add your vehicles to help calculate accurate rates for each one
        </p>

        {/* Vehicle Type Selection - Grid of 4 clickable options */}
        <div className="w-full bg-blue-100 rounded-md mt-4 p-4">
          <p className="text-blue-800 font-bold mb-3">Vehicle Type</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 w-full gap-3">
            {/* Semi Truck Tractor Option */}
            <div
              onClick={() => {
                setSelectedVehicle("semitruck");
              }}
              className={`${
                selectedVehicle === "semitruck"
                  ? "border-blue-600"
                  : "border-blue"
              } border-2 rounded-md pt-9 cursor-pointer hover:border-blue-500 transition-colors`}
            >
              <p
                className={`${
                  selectedVehicle === "semitruck" ? "text-blue-600" : ""
                } w-fit mx-auto text-[13px]`}
              >
                Semi Truck Tractor
              </p>
            </div>

            {/* Sprinter Van Option */}
            <div
              onClick={() => {
                setSelectedVehicle("sprintervan");
              }}
              className={`${
                selectedVehicle === "sprintervan"
                  ? "border-blue-600"
                  : "border-blue"
              } border-2 rounded-md pt-9 cursor-pointer hover:border-blue-500 transition-colors`}
            >
              <p
                className={`${
                  selectedVehicle === "sprintervan" ? "text-blue-600" : ""
                } w-fit mx-auto text-[13px]`}
              >
                Sprinter Van
              </p>
            </div>

            {/* Box Truck Option */}
            <div
              onClick={() => {
                setSelectedVehicle("boxtruck");
              }}
              className={`${
                selectedVehicle === "boxtruck"
                  ? "border-blue-600"
                  : "border-blue"
              } border-2 rounded-md pt-9 cursor-pointer hover:border-blue-500 transition-colors`}
            >
              <p
                className={`${
                  selectedVehicle === "boxtruck" ? "text-blue-600" : ""
                } w-fit mx-auto text-[13px]`}
              >
                Box Truck
              </p>
            </div>

            {/* Cargo Van Option */}
            <div
              onClick={() => {
                setSelectedVehicle("cargovan");
              }}
              className={`${
                selectedVehicle === "cargovan"
                  ? "border-blue-600"
                  : "border-blue"
              } border-2 rounded-md pt-9 cursor-pointer hover:border-blue-500 transition-colors`}
            >
              <p
                className={`${
                  selectedVehicle === "cargovan" ? "text-blue-600" : ""
                } w-fit mx-auto text-[13px]`}
              >
                Cargo Van
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Details Section */}
        <p className="font-bold mt-3">Vehicle Specifications</p>

        {/* VIN Input Section - Optional field with auto-decode functionality */}
        <div className="mt-4">
          <Input
            label="VIN (Optional)"
            type="text"
            placeholder="Vehicle Identification Number"
            helperText="Enter VIN to auto-fill vehicle specifications"
          />
        </div>

        {/* Vehicle Specifications Form - 2 column grid layout */}
        <div className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle Year Dropdown */}
            <Select
              label="Vehicle Year"
              placeholder="Select year"
              options={Array.from(
                { length: new Date().getFullYear() - 1989 },
                (_, i) => {
                  const year = 1990 + i;
                  return { value: year, label: year.toString() };
                }
              )}
            />

            {/* Vehicle Make Dropdown */}
            <Select
              label="Make"
              placeholder="Select make"
              options={defaultcarvalues.map((car) => ({
                value: car,
                label: car,
              }))}
            />

            {/* Vehicle Model Dropdown */}
            <Select
              label="Model"
              placeholder="Select model"
              options={defaultmodelvalues.map((model) => ({
                value: model,
                label: model,
              }))}
            />

            {/* Fuel Type Dropdown */}
            <Select
              label="Fuel Type"
              placeholder="Select fuel type"
              options={defaultfuelvalues.map((fuel) => ({
                value: fuel,
                label: fuel.charAt(0).toUpperCase() + fuel.slice(1),
              }))}
            />

            {/* Average MPG Input */}
            <Input
              label="Average MPG"
              type="number"
              placeholder="14.5"
              helperText="Enter your vehicle's fuel efficiency"
            />
          </div>

          {/* Equipment Types Section - Grid of 8 selectable equipment options */}
          <p className="font-bold mt-6">Equipment Types</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <Step4equipmenttype Icon={IoCubeOutline} text="Dry Van" />
            <Step4equipmenttype Icon={IoCubeOutline} text="Refrigerated" />
            <Step4equipmenttype Icon={IoCubeOutline} text="Flatbed" />
            <Step4equipmenttype Icon={IoCubeOutline} text="Step Deck" />
            <Step4equipmenttype Icon={IoCubeOutline} text="Lowboy" />
            <Step4equipmenttype Icon={IoCubeOutline} text="Tanker" />
            <Step4equipmenttype Icon={IoCubeOutline} text="Conestoga" />
            <Step4equipmenttype Icon={IoCubeOutline} text="Specialized" />
          </div>

          {/* Endorsements & Qualifications Section - CDL endorsements */}
          <p className="font-bold mt-6">Endorsements & Qualifications</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            <Step4equipmenttype
              Icon={IoCubeOutline}
              text="Hazardous Material"
            />
            <Step4equipmenttype Icon={IoCubeOutline} text="Tanker (N)" />
            <Step4equipmenttype Icon={IoCubeOutline} text="Doubles/Triplets" />
            <Step4equipmenttype Icon={IoCubeOutline} text="Passenger" />
            <Step4equipmenttype Icon={IoCubeOutline} text="Air Brake" />
          </div>

          {/* Other Qualifications - Free text area */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Other Qualifications
            </label>
            <textarea
              placeholder="Enter any other qualifications or certifications"
              rows="4"
              className="w-full px-4 py-3 rounded-md border-2 border-neutral-300 resize-none outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors"
            />
          </div>

          {/* Action Buttons - Add vehicle or Add and Continue to next step */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="secondary"
              size="lg"
              icon={<IoMdAdd />}
              iconPosition="left"
              className="flex-1"
            >
              Add This Vehicle
            </Button>

            <Button
              onClick={() => {
                setStep(5);
                setBarvalue("100");
              }}
              size="lg"
              icon={<LuSave />}
              iconPosition="left"
              className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-green-500"
            >
              Add & Continue
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
}

export default Step4;
