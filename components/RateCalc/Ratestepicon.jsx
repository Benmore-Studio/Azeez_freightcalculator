import React from 'react'

function Ratestepicon({Icon,text,currentStage}) {
    // Define the stage order
    const stageOrder = ["Location", "Load Details", "Service", "Conditions"]

    // Get the index of current stage and this step's stage
    const currentStageIndex = stageOrder.indexOf(currentStage)
    const thisStageIndex = stageOrder.indexOf(text)

    // Determine the state: current, completed, or future
    const isCurrent = thisStageIndex === currentStageIndex
    const isCompleted = thisStageIndex < currentStageIndex
    const isFuture = thisStageIndex > currentStageIndex

  return (
    <div className='flex flex-col items-center'>
        <Icon size={40} className={`p-2 rounded-full transition-all duration-300 ${
          isCurrent ? "bg-blue-600 text-white ring-4 ring-blue-200" :
          isCompleted ? "bg-blue-100 text-blue-600" :
          "bg-gray-100 text-gray-400"
        }`}/>
        <p className={`text-sm font-medium transition-all duration-300 ${
          isCurrent ? "text-blue-800 font-bold" :
          isCompleted ? "text-blue-600" :
          "text-gray-400"
        }`}>{text}</p>
    </div>
  )
}

export default Ratestepicon