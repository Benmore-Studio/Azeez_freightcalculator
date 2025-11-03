"use client";
import { useState } from "react";
import UserButton from "./UserButton";
import { FaArrowRightLong } from "react-icons/fa6";
import { Container, Card, ProgressHeader, Button } from "@/components/ui";


export default function Step1({barvalue, setBarvalue,step,setStep}) {
  const [selectedUserType, setSelectedUserType] = useState(null);

  const onContinue = (e) => {
    e.preventDefault();
    if (selectedUserType!= null){
      setBarvalue("40");
      setStep(2);
    }
    
  }
  return (
    <Container>
      <ProgressHeader
        title="Let's get you set up"
        percentage={Number(barvalue)}
        className="mt-4"
      />

      <Card className="mt-6">
        <h1 className="text-center text-3xl font-bold text-neutral-900">
          Welcome to the Freight Rate Calculator
        </h1>
        <h2 className="font-medium text-center text-neutral-500 mt-6">
          Tell us a little about yourself so we can customize your experience
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <UserButton
            type="owner"
            selectedType={selectedUserType}
            onSelect={() => setSelectedUserType("owner")}
          />
          <UserButton
            type="fleet"
            selectedType={selectedUserType}
            onSelect={() => setSelectedUserType("fleet")}
          />
          <UserButton
            type="Dispatcher"
            selectedType={selectedUserType}
            onSelect={() => setSelectedUserType("Dispatcher")}
          />
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={onContinue}
            disabled={selectedUserType === null}
            icon={<FaArrowRightLong />}
            iconPosition="right"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </Card>
    </Container>
  );
}
