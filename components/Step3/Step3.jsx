import React from "react";
import Step3radiobutton from "./Step3radiobutton";
import Step3fixedcosts from "./Step3fixedcosts";
import Step3variablecosts from "./Step3variablecosts";
import { useAppContext } from "@/context/AppContext";
import { Container, Card, ProgressHeader, BackButton, Select, Input, Button, Radio } from "@/components/ui";

function Step3({ barvalue, setBarvalue, step, setStep }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  // Get global state from context
  const {vehicle, setVehicle, costdata, setCostdata} = useAppContext();


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
          setBarvalue("40");
        }}
        className="mt-6"
      />

      <Card className="mt-6">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
          Calculate Your Cost Per Mile
        </h2>
        <h3 className="text-sm text-neutral-600 mt-2">
          Understanding your true operating costs is essential for profitable rate setting
        </h3>

        <div className="w-full bg-blue-200 rounded-md p-4">
          {/* Cost Data Source Radio Buttons */}
          <div>
            <h4 className="text-blue-800 font-bold">Cost Data Source</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Step3radiobutton
              text="We'll use typical costs for your vehicle type if you're just starting
          out or prefer estimates"
              label="Use Industry Averages"
              radio={costdata.radio}
              value="default"
              onSelect={() => {
                setCostdata((prev) => ({
                  ...prev, radio:"default"
                }));
              }}
              setCostData={setCostdata}
            />
            <Step3radiobutton
              text="Use your actual costs if you have existing operations and real expense data"
              label="Enter My Own Data"
              radio={costdata.radio}
              value="unique"
              onSelect={() => {
                setCostdata((prev) => ({
                  ...prev, radio:"unique"
                }));
              }}
              setCostData={setCostdata}
            />
          </div>

          {/* Vehicle Type Dropdown */}
          <div className="mt-4">
            <Select
              label="Vehicle Type"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              options={[
                { value: "Semitruck", label: "Semi-Truck/Tractor Trailer" },
                { value: "sprintervan", label: "Sprinter Van" },
                { value: "boxtruck", label: "Straight/Box Truck" },
                { value: "cargovan", label: "Cargo Van" },
              ]}
            />
          </div>

          {/* Maximum Payload Input */}
          <div className="mt-3">
            <Input
              label="Maximum Payload (lbs)"
              type="number"
              value={costdata.radio === "default" ? costdata.defaultPayloads[vehicle] : costdata.customPayloads[vehicle]}
              onChange={(e) => {
                setCostdata((prev) => ({
                  ...prev,
                  customPayloads: {
                    ...prev.customPayloads,
                    [vehicle]: e.target.value
                  }
                }))
              }}
              disabled={costdata.radio === "default"}
              helperText="Maximum weight your vehicle can legally transport"
            />
          </div>
        </div>
      </Card>

      <Card variant="flat" className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Step3fixedcosts radio={costdata.radio} />
          <Step3variablecosts radio={costdata.radio} />
        </div>
      </Card>

      <Card variant="flat" className="mt-4">
        {/* Miles Driven Input Section */}
        <div className="bg-gray-100 rounded-md p-2">
          <div >
            <p className="font-bold">Miles Driven</p>
          </div>

          {/* Monthly/Annually Toggle */}
          <div className="flex gap-3">
            <div
              onClick={() => {
                // Only convert if switching FROM annually TO monthly
                if (costdata.frequency === "annually") {
                  setCostdata((prev) => ({
                    ...prev,
                    frequency: "monthly",
                    milesdriven: prev.milesdriven / 12
                  }));
                }
                // If already monthly or undefined, just set to monthly without conversion
                else if (costdata.frequency !== "monthly") {
                  setCostdata((prev) => ({
                    ...prev,
                    frequency: "monthly"
                  }));
                }
                // If already monthly, do nothing (prevents multiple clicks)
              }}
              className={`${
                costdata.frequency == "monthly"
                  ? "bg-blue-800 text-white"
                  : "bg-gray-400 text-black"
              } px-5 py-1  rounded-md cursor-pointer `}
            >
              Monthly
            </div>
            <div
              onClick={() => {
                // Only convert if switching FROM monthly TO annually
                if (costdata.frequency === "monthly") {
                  setCostdata((prev) => ({
                    ...prev,
                    frequency: "annually",
                    milesdriven: prev.milesdriven * 12
                  }));
                }
                // If already annually or undefined, just set to annually without conversion
                else if (costdata.frequency !== "annually") {
                  setCostdata((prev) => ({
                    ...prev,
                    frequency: "annually"
                  }));
                }
                // If already annually, do nothing (prevents multiple clicks)
              }}
              className={`${
                costdata.frequency == "annually"
                  ? "bg-blue-800 text-white"
                  : " bg-gray-400 text-black"
              } px-5 py-1 rounded-md cursor-pointer `}
            >
              Annually
            </div>
          </div>

          {/* Miles Input Field */}
          <div className="mt-2">
            <Input
              type="number"
              value={costdata.milesdriven}
              onChange={(e) => {
                setCostdata((prev) => ({
                  ...prev,milesdriven:e.target.value
                }));
              }}
              helperText="Approximately 120,000 miles annually"
            />
          </div>
        </div>

        {/* Cost Per Mile Summary Display */}
        <div className="bg-blue-200 p-4 mt-4">
            <div className="w-full flex justify-between">
                <h2 className="font-semibold">Your Cost Per Mile:</h2>
                <p className="text-blue-800 text-3xl font-bold">$1.75/mile</p>
            </div>

            {/* Fixed & Variable Cost Breakdown */}
            <div className="flex w-[80%] justify-between mt-4">
                <div className="flex flex-col ">
                    <p className="text-gray-800">Fixed Costs</p>
                    <p className="font-semibold">$0.33/mile </p>
                </div>
                <div className="flex flex-col">
                    <p className="text-gray-800">Variable Costs</p>
                    <p className="font-semibold">$0.33/mile </p>
                </div>
            </div>
            <p className="text-sm text-gray-800 mt-4">This is your minimum cost to operate. For profitability, your rates should exceed this amount.</p>
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            setBarvalue("90");
            setStep(4);
          }}
          fullWidth
          size="lg"
          className="mt-6"
        >
          Continue
        </Button>
      </Card>
    </Container>
  );
}

export default Step3;

