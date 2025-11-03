"use client";
import React from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdOutlineLocalPhone } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

function UserButton({ type, selectedType, onSelect }) {
  const isSelected = selectedType === type;
  if (type === "owner") {
    return (
      <div onClick={onSelect} className="relative flex flex-col p-4 border border-gray-300 items-center gap-4 rounded-2xl">
        <CgProfile
          size={70}
          className="bg-blue-700 text-white p-2 rounded-full"
        />
        <p className="font-bold mt-2 text-center text-[25px]">Owner Operator</p>
        <p className="text-center font-medium text-gray-600 text-[13px] mt-1 mb-1">
          Individual truck owners managing their own operations
        </p>
        <p className="text-center font-extralight text-gray-400 text-[12px]">
          I operate my own truck and need to calculate fair rates for my loads
        </p>
        {/* when selected blue overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-800 rounded-2xl"></div>
        )}
      </div>
    );
  }
  if (type === "fleet") {
    return (
      <div onClick={onSelect} className=" relative flex flex-col p-4 border border-gray-300 items-center gap-4 rounded-2xl" >
        <CiDeliveryTruck
          size={70}
          className="bg-blue-700 text-white p-2 rounded-full"
        />
        <p className="font-bold mt-2 text-center text-[25px] ">
          Fleet
        </p>
        <p className="text-center font-medium text-gray-600 text-[13px] mt-1 mb-1">
          Companies managing multiple vehicles and drivers
        </p>
        <p className="text-center font-extralight text-gray-400 text-[12px]">
          I manage multiple trucks and need to calculate rates for my fleet
        </p>
        {/* when selected blue overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-800 rounded-2xl"></div>
        )}
      </div>
    );
  }
  if (type === "Dispatcher") {
    return (
      <div onClick={onSelect} className="relative flex flex-col p-4 border border-gray-300 items-center gap-4 rounded-2xl">
        <MdOutlineLocalPhone
          size={70}
          className="bg-blue-700 text-white p-2 rounded-full"
        />
        <p className="font-bold mt-2 text-center text-[25px]">Dispatcher</p>
        <p className="text-center font-medium text-gray-600 text-[13px] mt-1 mb-1">
          Load coordinators managing freight assignments
        </p>
        <p className="text-center font-extralight text-gray-400 text-[12px]">
          I coordinate loads for drivers and need to negotiate competitive rates
        </p>
        {/* when selected blue overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-800 rounded-2xl"></div>
        )}
      </div>
    );
  }
}

export default UserButton;
