"use client";
import React from "react";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoMailOutline, IoCallOutline, IoBusinessOutline } from "react-icons/io5";
import Step2button from "./Step2button";
import { useAppContext } from "@/context/AppContext";
import { Container, Card, ProgressHeader, BackButton, Input, Button } from "@/components/ui";

function Step2({ barvalue, setBarvalue, step, setStep }) {
  const [type, setType] = useState(null);
  const { formdata, setFormdata } = useAppContext();
  const handleChange = (e) => {
    const {name,value}= e.target
    setFormdata((prev) => ({
      ...prev, [name]:value
    }))
  }

  return (
    <Container>
      <ProgressHeader
        title="Let's get you set up"
        percentage={Number(barvalue)}
        className="mt-4"
      />

      <BackButton
        onClick={() => {
          setStep(1);
          setBarvalue("20");
        }}
        className="mt-6"
      />

      <Card className="mt-6">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-neutral-900">
          Welcome to FreightRate Pro
        </h2>
        <h3 className="text-center text-base text-neutral-600 mt-2">
          Let's get started by creating your profile
        </h3>

        <form className="mt-6 space-y-4">
          <Input
            label="Your Name"
            type="text"
            name="name"
            value={formdata.name}
            onChange={handleChange}
            icon={<CgProfile />}
            placeholder="John Smith"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              icon={<IoMailOutline />}
              placeholder="john@example.com"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formdata.phone}
              onChange={handleChange}
              icon={<IoCallOutline />}
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <Input
            label="Company Name"
            type="text"
            name="company"
            value={formdata.company}
            onChange={handleChange}
            icon={<IoBusinessOutline />}
            placeholder="ABC Trucking"
            helperText="Optional - Leave blank if individual"
          />
        </form>

        <Button
          onClick={() => {
            setStep(3);
            setBarvalue("70");
          }}
          fullWidth
          size="lg"
          className="mt-8"
        >
          Continue
        </Button>
      </Card>
    </Container>
  );
}

export default Step2;
