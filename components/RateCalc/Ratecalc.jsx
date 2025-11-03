import React from 'react'
import Ratestepicon from './Ratestepicon'
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineCube } from "react-icons/hi2";
import { IoNewspaperOutline } from "react-icons/io5";
import { TiWeatherCloudy } from "react-icons/ti";
import { useState } from 'react';
import Ratecalclocation from './Ratecalclocation';
import Ratecalcloaddetails from './Ratecalcloaddetails';
import Ratecalcservice from './Ratecalcservice';
import RateCalcConditions from './RateCalcConditions';
import Quote from '@/components/quote/quote';
import { Card, Button, ProgressBar } from '@/components/ui';


function Ratecalc({ setStep }) {
    const [stage,setStage] = useState("Location")
    const [showQuote, setShowQuote] = useState(false)
    const [calculationData, setCalculationData] = useState(null)

    // Function to handle calculation completion
    const handleCalculationComplete = (data) => {
        setCalculationData(data)
        setShowQuote(true)
    }

    // Function to reset calculator
    const handleNewCalculation = () => {
        setShowQuote(false)
        setStage("Location")
        setCalculationData(null)
    }

    // If quote is ready, show Quote component
    if (showQuote) {
        return (
            <div className='mt-6'>
                <Quote quoteData={calculationData} />
                <div className='flex justify-center mt-6 mb-6'>
                    <Button
                        onClick={handleNewCalculation}
                        size="lg"
                        className='bg-gray-800 hover:bg-gray-900'
                    >
                        ← New Calculation
                    </Button>
                </div>
            </div>
        )
    }

    // Otherwise show calculator
    const stagePercentage = {
        "Location": 25,
        "Load Details": 50,
        "Service": 75,
        "Conditions": 100
    };

    return (
        <Card padding="none" variant="elevated" className='mt-6 overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-900 to-blue-800 p-6'>
                <div className='flex flex-col sm:flex-row justify-between gap-4'>
                    <div className='flex flex-col gap-3'>
                        <p className='text-white text-2xl font-semibold'>Advanced Rate Calculator</p>
                        <p className='text-blue-100 text-sm'>Enter your load details to get an accurate rate estimate in seconds</p>
                    </div>
                    <div className='border rounded-md p-3 border-blue-600 bg-blue-950/30 self-start'>
                        <p className='text-blue-200 text-xs font-medium'>Searches Used</p>
                        <p className='text-white text-lg font-bold mt-1'>0/5</p>
                    </div>
                </div>
            </div>

            <ProgressBar
                value={stagePercentage[stage]}
                max={100}
                size="sm"
                className="rounded-none"
            />

            <div className='flex flex-wrap justify-between gap-2 p-4 bg-neutral-50'>
                <Ratestepicon Icon={IoLocationOutline} text="Location" currentStage={stage}/>
                <Ratestepicon Icon={HiOutlineCube} text="Load Details" currentStage={stage}/>
                <Ratestepicon Icon={IoNewspaperOutline} text="Service" currentStage={stage}/>
                <Ratestepicon Icon={TiWeatherCloudy} text="Conditions" currentStage={stage}/>
            </div>
            {stage === "Location" && <Ratecalclocation setStage={setStage} /> }
            {stage === "Load Details" && <Ratecalcloaddetails setStage={setStage}/> }
            {stage === "Service" && <Ratecalcservice setStage={setStage} />}
            {stage === "Conditions" && <RateCalcConditions setStage={setStage} onComplete={handleCalculationComplete} />}
        </Card>
    )
}

export default Ratecalc;