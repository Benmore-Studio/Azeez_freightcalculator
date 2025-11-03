"use client";
import Image from "next/image";
import { SiTicktick } from "react-icons/si";
import { useState } from "react";
import UserButton from "@/components/Step1/UserButton";
import { FaArrowRightLong } from "react-icons/fa6";
import Step1 from "@/components/Step1/Step1";
import Step2 from "@/components/Step2/Step2";
import Step3 from "@/components/Step3/Step3";
import Step4 from "@/components/Step4/Step4";
import Step5 from "@/components/Step5/Step5";


export default function Home() {
  const [barvalue, setBarvalue] = useState("20");
  const [selectedUserType, setSelectedUserType] = useState(null);
  const[step,setStep] = useState(1);

  if (step === 1){
    return(
      <Step1 barvalue={barvalue} setBarvalue={setBarvalue} step={step} setStep={setStep} />
    )
  }
  if (step === 2){
    return(
      <Step2 barvalue={barvalue} setBarvalue={setBarvalue} step={step} setStep={setStep} />
    )
  }
  if (step === 3){
    return(
      <Step3 barvalue={barvalue} setBarvalue={setBarvalue} step={step} setStep={setStep} />
    )
  }
  if (step === 4){
    return(
      <Step4 barvalue={barvalue} setBarvalue={setBarvalue} step={step} setStep={setStep} />
    )
  }
  if (step === 5){
    return(
      <Step5 barvalue={barvalue} setBarvalue={setBarvalue} step={step} setStep={setStep} />
    )
  }
  
  
}
