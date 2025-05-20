"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GlossaryTooltip } from "./ui-tooltip"

type ChatbotChoices = {
  budget: string
  trainingData: string
  contentFiltering: string
  behavior: string
  adaptToUser: boolean
  biasHandling: string
}

interface DecisionImpactVisualizerProps {
  choices: ChatbotChoices
}

export function DecisionImpactVisualizer({ choices }: DecisionImpactVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate metrics based on choices
    const metrics = calculateMetrics(choices)

    // Draw radar chart
    drawRadarChart(ctx, canvas.width, canvas.height, metrics)
  }, [choices])

  return (
    <Card className="biased-card">
      <CardHeader>
        <CardTitle className="biased-title">Impact Visualization</CardTitle>
        <CardDescription>See how your choices affect key aspects of your chatbot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full max-w-md mx-auto relative biased-radar">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-center">
            <GlossaryTooltip term="ethical AI">Ethics</GlossaryTooltip>
          </div>
          <div className="absolute top-1/4 right-0 translate-x-1/2 -translate-y-1/2 text-xs text-center">
            <GlossaryTooltip term="scalability">Scalability</GlossaryTooltip>
          </div>
          <div className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 text-xs text-center">
            <GlossaryTooltip term="personalization">Personalization</GlossaryTooltip>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs text-center">
            <GlossaryTooltip term="content filtering">Safety</GlossaryTooltip>
          </div>
          <div className="absolute bottom-1/4 left-0 -translate-x-1/2 translate-y-1/2 text-xs text-center">
            <GlossaryTooltip term="bias">Fairness</GlossaryTooltip>
          </div>
          <div className="absolute top-1/4 left-0 -translate-x-1/2 -translate-y-1/2 text-xs text-center">
            <GlossaryTooltip term="training data">Knowledge</GlossaryTooltip>
          </div>
        </div>
        <div className="mt-6 text-sm text-slate-600 dark:text-slate-400">
          <p>
            This visualization shows how your choices affect six key dimensions of your chatbot. The further the shape
            extends in each direction, the stronger your chatbot is in that dimension.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function calculateMetrics(choices: ChatbotChoices) {
  // Initialize metrics with default values
  const metrics = {
    ethics: 0.5, // Ethical considerations
    scalability: 0.5, // Ability to scale
    personalization: 0.5, // Personalization capabilities
    safety: 0.5, // Content safety
    fairness: 0.5, // Bias mitigation
    knowledge: 0.5, // Knowledge breadth
  }

  // Budget affects scalability
  if (choices.budget === "low") {
    metrics.scalability = 0.3
  } else if (choices.budget === "medium") {
    metrics.scalability = 0.6
  } else if (choices.budget === "high") {
    metrics.scalability = 0.9
  }

  // Training data affects knowledge
  if (choices.trainingData === "public") {
    metrics.knowledge = 0.8
    metrics.fairness = 0.4
  } else if (choices.trainingData === "curated") {
    metrics.knowledge = 0.6
    metrics.fairness = 0.7
  } else if (choices.trainingData === "proprietary") {
    metrics.knowledge = 0.4
    metrics.fairness = 0.6
  }

  // Content filtering affects safety
  if (choices.contentFiltering === "strict") {
    metrics.safety = 0.9
    metrics.ethics = 0.7
  } else if (choices.contentFiltering === "moderate") {
    metrics.safety = 0.6
    metrics.ethics = 0.6
  } else if (choices.contentFiltering === "minimal") {
    metrics.safety = 0.3
    metrics.ethics = 0.4
  }

  // Adaptation affects personalization
  if (choices.adaptToUser) {
    metrics.personalization = 0.9
    metrics.ethics = metrics.ethics * 0.8 // Slight ethical concern with personalization
  } else {
    metrics.personalization = 0.3
  }

  // Bias handling affects fairness and ethics
  if (choices.biasHandling === "minimize") {
    metrics.fairness = Math.min(0.9, metrics.fairness * 1.5)
    metrics.ethics = Math.min(0.8, metrics.ethics * 1.2)
  } else if (choices.biasHandling === "values") {
    metrics.fairness = Math.min(0.7, metrics.fairness * 1.2)
    metrics.ethics = Math.min(0.7, metrics.ethics * 1.1)
  } else if (choices.biasHandling === "transparent") {
    metrics.fairness = Math.min(0.8, metrics.fairness * 1.3)
    metrics.ethics = Math.min(0.9, metrics.ethics * 1.3)
  }

  return metrics
}

function drawRadarChart(ctx: CanvasRenderingContext2D, width: number, height: number, metrics: Record<string, number>) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(centerX, centerY) * 0.8

  // Define the metrics and their angles
  const metricsKeys = ["ethics", "scalability", "personalization", "safety", "fairness", "knowledge"]

  // Intentionally make the angles slightly uneven to represent bias
  const angles = [
    0, // ethics - top
    Math.PI * 0.3, // scalability - top right
    Math.PI * 0.7, // personalization - bottom right
    Math.PI, // safety - bottom
    Math.PI * 1.4, // fairness - bottom left
    Math.PI * 1.8, // knowledge - top left
  ]

  // Draw background circles with slight distortion
  ctx.strokeStyle = "#e2e8f0"
  ctx.fillStyle = "#f8fafc"

  for (let i = 1; i <= 3; i++) {
    const r = radius * (i / 3)
    ctx.beginPath()
    ctx.ellipse(centerX + 5, centerY - 3, r, r * 0.95, Math.PI * 0.1, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  }

  // Draw lines from center to each point
  ctx.strokeStyle = "#e2e8f0"
  angles.forEach((angle) => {
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle))
    ctx.stroke()
  })

  // Draw the radar chart based on metrics
  ctx.fillStyle = "rgba(99, 102, 241, 0.2)"
  ctx.strokeStyle = "rgba(99, 102, 241, 0.8)"
  ctx.lineWidth = 2

  ctx.beginPath()
  metricsKeys.forEach((key, i) => {
    const value = metrics[key]
    const angle = angles[i]
    const x = centerX + radius * value * Math.cos(angle)
    const y = centerY + radius * value * Math.sin(angle)

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Draw points at each metric value
  ctx.fillStyle = "rgba(99, 102, 241, 1)"
  metricsKeys.forEach((key, i) => {
    const value = metrics[key]
    const angle = angles[i]
    const x = centerX + radius * value * Math.cos(angle)
    const y = centerY + radius * value * Math.sin(angle)

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })
}
