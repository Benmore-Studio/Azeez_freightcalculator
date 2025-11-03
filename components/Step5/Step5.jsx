import React from "react";
import { MdOutlineDone } from "react-icons/md";
import { GoTrophy } from "react-icons/go";
import { BsLightningCharge, BsTruck } from "react-icons/bs";
import { GiRibbonMedal } from "react-icons/gi";
import { MdKeyboardArrowRight } from "react-icons/md";
import Achievements from "./Achievements";
import { CiStar } from "react-icons/ci";
import { LuTruck } from "react-icons/lu";
import { FaArrowUp } from "react-icons/fa";
import Ratecalc from "../RateCalc/Ratecalc";
import { Container, ProgressHeader, Card, Button, ProgressBar } from "@/components/ui";



function Step5({ barvalue, setBarvalue, step, setStep }) {
  return (
    <Container>
      <ProgressHeader
        title="Let's get you set up"
        percentage={Number(barvalue)}
        className="mt-4"
      />

      <Card variant="flat" className="bg-green-50 border-2 border-green-200 flex flex-col items-center py-8 px-4 mt-6">
        <MdOutlineDone
          size={60}
          className="rounded-full p-3 bg-gradient-to-r from-green-400 to-teal-400 text-white"
        />
        <p className="font-bold text-green-950 text-xl mt-4">Setup Complete!</p>
        <p className="text-neutral-700 text-center mt-2">You're all set to start calculating freight rates.</p>
        <p className="text-neutral-600 text-center text-sm">Use the calculator below to get accurate rates for your loads.</p>
      </Card>

      <Card padding="none" className="mt-6 overflow-hidden">
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <GoTrophy size={20} className="text-white" />
              <p className="text-white font-bold">Your Trucking Journey</p>
            </div>
            <div className="flex items-center gap-2">
              <BsLightningCharge className="text-white" />
              <p className="text-white">Level 1</p>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar
              value={0}
              max={100}
              showLabel
              label="Progress to Level 2"
              size="sm"
              className="[&_.text-blue-600]:text-white [&_.text-neutral-700]:text-white [&_.bg-neutral-200]:bg-blue-900"
            />
          </div>
        </div>
        <div className="bg-white p-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <GiRibbonMedal size={20} className="text-yellow-400" />
              <p className="text-md font-semibold">Achievements</p>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-blue-400">Show All</p>
              <MdKeyboardArrowRight className="text-blue-400" />
            </div>
          </div>
          <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Achievements text="New Trucker" Icon={CiStar} />
            <Achievements text="New Trucker" Icon={CiStar} />
            <Achievements text="New Trucker" Icon={CiStar} />
            <Achievements text="New Trucker" Icon={CiStar} />
            <Achievements text="New Trucker" Icon={CiStar} />
            <Achievements text="New Trucker" Icon={CiStar} />
            <Achievements text="New Trucker" Icon={CiStar} />
            <Achievements text="New Trucker" Icon={CiStar} />
            <Achievements text="New Trucker" Icon={CiStar} />
            <Achievements text="New Trucker" Icon={CiStar} />
          </div>
          <div>
            <div className="bg-gray-100 p-3 flex justify-between items-center hover:bg-gray-300 hover:cursor-pointer  ">
              <div className="flex gap-3">
                <div>
                  <CiStar
                    size={35}
                    className="bg-gray-200 rounded-full p-1 text-white"
                  />
                </div>
                <div className="flex flex-col ">
                  <p className="text-[15px] font-semibold">
                    Unlock more achievements
                  </p>
                  <p className="text-[10px]">8 achievements remaining</p>
                </div>
              </div>
            <MdKeyboardArrowRight/>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 flex justify-between items-center rounded-sm mt-4 ">
              <div className="flex gap-3">
                <div>
                  <CiStar
                    size={35}
                    className="bg-gray-200 rounded-full p-1 text-white"
                  />
                </div>
                <div className="flex flex-col ">
                  <p className="text-[15px] text-in font-semibold text-indigo-800">
                    Unlock Premium achievements
                  </p>
                  <p className="text-[10px] text-indigo-600">Subscribe to earn exclusive badges and level up faster</p>
                </div>
              </div>
            <Button variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              Upgrade
            </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card variant="flat" className="bg-blue-50 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <LuTruck size={40} className="p-3 rounded-full text-blue-600 bg-blue-200" />
            <p className="font-medium text-neutral-900">Truck Stop Preferences</p>
          </div>
          <FaArrowUp className="text-neutral-600" />
        </div>
      </Card>

      <div className="mt-6">
        <Ratecalc setStep={setStep} />
      </div>
    </Container>
  );
}

export default Step5;
