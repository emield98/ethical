"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ChatbotAnimationProps {
  currentStep: number
  choices: any
}

export function ChatbotAnimation({ currentStep, choices }: ChatbotAnimationProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [isWaving, setIsWaving] = useState(false)
  const [mood, setMood] = useState<"happy" | "thinking" | "concerned" | "excited">("happy")

  useEffect(() => {
    // Blink animation every 3-5 seconds
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      },
      Math.random() * 2000 + 3000,
    )

    // Wave animation occasionally
    const waveInterval = setInterval(
      () => {
        setIsWaving(true)
        setTimeout(() => setIsWaving(false), 1000)
      },
      Math.random() * 10000 + 15000,
    )

    return () => {
      clearInterval(blinkInterval)
      clearInterval(waveInterval)
    }
  }, [])

  useEffect(() => {
    // Change mood based on budget remaining
    if (choices.budgetAmount > 0) {
      const remainingPercentage = (choices.remainingBudget / choices.budgetAmount) * 100
      if (remainingPercentage < 20) {
        setMood("concerned")
      } else if (remainingPercentage > 80) {
        setMood("excited")
      } else if (currentStep > 0) {
        setMood("thinking")
      } else {
        setMood("happy")
      }
    }
  }, [choices.remainingBudget, choices.budgetAmount, currentStep])

  const getStatusMessage = () => {
    if (currentStep === 0) return "Let's choose your budget!"
    if (currentStep === 1) return "What data should we use?"
    if (currentStep === 2) return "How strict should filtering be?"
    if (currentStep === 3) return "What personality should I have?"
    if (currentStep === 4) return "How should we handle bias?"
    if (currentStep === 5) return "Look what we built together!"
    return "Ready to build something amazing?"
  }

  const getMoodColor = () => {
    switch (mood) {
      case "excited":
        return "text-green-500"
      case "thinking":
        return "text-blue-500"
      case "concerned":
        return "text-yellow-500"
      default:
        return "text-slate-600"
    }
  }

  const getSelectedFeatures = () => {
    const features = []
    if (choices.trainingData?.length > 0) {
      features.push(`${choices.trainingData.length} data source${choices.trainingData.length > 1 ? "s" : ""}`)
    }
    if (choices.contentFiltering) {
      features.push(`${choices.contentFiltering} filtering`)
    }
    if (choices.behavior) {
      features.push(`${choices.behavior} personality`)
    }
    if (choices.biasHandling) {
      features.push(`${choices.biasHandling} bias handling`)
    }
    return features
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Your AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {/* Chatbot Avatar */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          {/* Main body */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
            {/* Eyes */}
            <div className="flex justify-center items-center pt-6 space-x-3">
              <div
                className={`w-3 h-3 bg-white rounded-full transition-all duration-200 ${isBlinking ? "h-0.5" : ""}`}
              />
              <div
                className={`w-3 h-3 bg-white rounded-full transition-all duration-200 ${isBlinking ? "h-0.5" : ""}`}
              />
            </div>

            {/* Mouth */}
            <div className="flex justify-center mt-2">
              {mood === "happy" && <div className="w-4 h-2 border-b-2 border-white rounded-full" />}
              {mood === "excited" && <div className="w-5 h-3 border-b-2 border-white rounded-full" />}
              {mood === "thinking" && <div className="w-3 h-3 bg-white rounded-full opacity-60" />}
              {mood === "concerned" && <div className="w-4 h-2 border-t-2 border-white rounded-full" />}
            </div>
          </div>

          {/* Waving hand */}
          {isWaving && <div className="absolute -right-2 top-4 text-2xl animate-bounce">👋</div>}

          {/* Thinking bubbles */}
          {mood === "thinking" && (
            <div className="absolute -top-2 -right-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-100" />
                <div className="w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-200" />
              </div>
            </div>
          )}
        </div>

        {/* Status message */}
        <div className="space-y-2">
          <p className={`text-sm font-medium ${getMoodColor()}`}>{getStatusMessage()}</p>

          {choices.budgetAmount > 0 && (
            <p className="text-xs text-slate-500">
              Budget: {((choices.remainingBudget / choices.budgetAmount) * 100).toFixed(0)}% remaining
            </p>
          )}
        </div>

        {/* Selected features */}
        {getSelectedFeatures().length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Current Features:</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {getSelectedFeatures().map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Mood indicator */}
        <div className="flex justify-center space-x-1">
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              mood === "excited"
                ? "bg-green-400"
                : mood === "thinking"
                  ? "bg-blue-400"
                  : mood === "concerned"
                    ? "bg-yellow-400"
                    : "bg-slate-400"
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-300 delay-100 ${
              mood === "excited"
                ? "bg-green-400"
                : mood === "thinking"
                  ? "bg-blue-400"
                  : mood === "concerned"
                    ? "bg-yellow-400"
                    : "bg-slate-400"
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-300 delay-200 ${
              mood === "excited"
                ? "bg-green-400"
                : mood === "thinking"
                  ? "bg-blue-400"
                  : mood === "concerned"
                    ? "bg-yellow-400"
                    : "bg-slate-400"
            }`}
          />
        </div>
      </CardContent>
    </Card>
  )
}
