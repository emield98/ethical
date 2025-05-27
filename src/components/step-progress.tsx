"use client"

import { Check } from "lucide-react"

interface StepProgressProps {
  currentStep: number
  steps: string[]
}

export function StepProgress({ currentStep, steps }: StepProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
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
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 transition-colors ${index < currentStep ? "bg-green-500" : "bg-slate-300"}`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`${index === currentStep ? "font-medium text-blue-600 dark:text-blue-400" : ""}`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}
