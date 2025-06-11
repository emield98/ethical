"use client"

import { Check } from "lucide-react"

interface StepProgressProps {
  currentStep: number
  steps: string[]
}

export function StepProgress({ currentStep, steps }: StepProgressProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between mb-4 min-w-[340px] sm:min-w-0">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1 min-w-0">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors mx-auto ${
                index < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : index === currentStep
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-white border-slate-300 text-slate-400"
              }`}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {/* Step connector */}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 min-w-[340px] sm:min-w-0">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`${index === currentStep ? "font-medium text-blue-600 dark:text-blue-400" : ""} flex-1 text-center block`}
            style={{ minWidth: 0, wordBreak: 'break-word' }}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}
