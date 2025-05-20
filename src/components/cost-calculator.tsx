"use client"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { GlossaryTooltip } from "./ui-tooltip"

type ChatbotChoices = {
  budget: string
  trainingData: string
  contentFiltering: string
  behavior: string
  adaptToUser: boolean
  biasHandling: string
}

interface CostBreakdown {
  development: number
  training: number
  infrastructure: number
  maintenance: number
  moderation: number
}

export const getCostFactors = (choices: ChatbotChoices): string[] => {
  const factors: string[] = []

  if (choices.budget === "low") {
    factors.push("Limited resources for development and maintenance")
  } else if (choices.budget === "high") {
    factors.push("Higher costs for custom model development")
  }

  if (choices.trainingData === "proprietary") {
    factors.push("Costs associated with data cleaning and preparation")
  } else if (choices.trainingData === "curated") {
    factors.push("Premium costs for high-quality curated data sources")
  }

  if (choices.contentFiltering === "strict") {
    factors.push("Increased content moderation costs")
  } else if (choices.contentFiltering === "moderate") {
    factors.push("Balanced moderation costs with some manual review")
  }

  if (choices.adaptToUser) {
    factors.push("Additional costs for personalization infrastructure")
    factors.push("Higher data storage and processing requirements")
  }

  if (choices.behavior === "creative") {
    factors.push("More complex model training for creative responses")
  }

  if (choices.biasHandling === "transparent") {
    factors.push("Additional development for bias detection and disclosure")
  }

  return factors
}

export const calculateCosts = (choices: ChatbotChoices): CostBreakdown => {
  let development = 0
  let training = 0
  let infrastructure = 0
  let maintenance = 0
  let moderation = 0

  // Base costs determined by budget
  if (choices.budget === "low") {
    development = 5000
    training = 1000
    infrastructure = 500
    maintenance = 2000
    moderation = 1500
  } else if (choices.budget === "medium") {
    development = 25000
    training = 10000
    infrastructure = 5000
    maintenance = 12000
    moderation = 8000
  } else if (choices.budget === "high") {
    development = 150000
    training = 75000
    infrastructure = 30000
    maintenance = 60000
    moderation = 35000
  }

  // Adjust based on training data
  if (choices.trainingData === "proprietary") {
    training *= 1.5
    development *= 1.2
  } else if (choices.trainingData === "curated") {
    training *= 1.3
    moderation *= 0.8
  }

  // Adjust based on content filtering
  if (choices.contentFiltering === "strict") {
    moderation *= 1.5
    development *= 1.2
  } else if (choices.contentFiltering === "minimal") {
    moderation *= 0.7
  }

  // Adjust based on behavior
  if (choices.behavior === "creative") {
    development *= 1.2
    training *= 1.3
  } else if (choices.behavior === "formal") {
    development *= 0.9
  }

  // Adjust based on adaptation
  if (choices.adaptToUser) {
    infrastructure *= 1.5
    maintenance *= 1.3
    development *= 1.2
  }

  // Adjust based on bias handling
  if (choices.biasHandling === "transparent") {
    development *= 1.2
    training *= 1.1
  } else if (choices.biasHandling === "values") {
    training *= 1.2
  }

  return {
    development: Math.round(development),
    training: Math.round(training),
    infrastructure: Math.round(infrastructure),
    maintenance: Math.round(maintenance),
    moderation: Math.round(moderation),
  }
}

export const formatCost = (cost: number): string => {
  return cost.toLocaleString()
}

export function CostCalculator({ choices }: { choices: ChatbotChoices }) {
  const [viewMode, setViewMode] = useState<"yearly" | "monthly">("yearly")
  const costs = calculateCosts(choices)
  const totalCost = costs.development + costs.training + costs.infrastructure + costs.maintenance + costs.moderation
  const maxCost = Math.max(costs.development, costs.training, costs.infrastructure, costs.maintenance, costs.moderation)

  const costFactors = getCostFactors(choices)

  const getMonthlyValue = (value: number) => {
    // For development and training, we'll amortize over 12 months for display purposes
    return Math.round(value / 12)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Estimated Costs</h3>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "yearly" | "monthly")}>
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-6 border rounded-lg bg-slate-50 dark:bg-slate-900">
        <div className="text-center mb-6">
          <div className="text-sm text-slate-500 dark:text-slate-400">Total First-Year Cost</div>
          <div className="text-3xl font-bold mt-1">
            ${formatCost(viewMode === "yearly" ? totalCost : Math.round(totalCost / 12))}
            <span className="text-sm font-normal text-slate-500 ml-1">{viewMode === "monthly" ? "/month" : ""}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                <GlossaryTooltip term="development">Development</GlossaryTooltip>
              </span>
              <span className="font-medium">
                ${formatCost(viewMode === "yearly" ? costs.development : getMonthlyValue(costs.development))}
              </span>
            </div>
            <Progress value={(costs.development / maxCost) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                <GlossaryTooltip term="model training">Training</GlossaryTooltip>
              </span>
              <span className="font-medium">
                ${formatCost(viewMode === "yearly" ? costs.training : getMonthlyValue(costs.training))}
              </span>
            </div>
            <Progress value={(costs.training / maxCost) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                <GlossaryTooltip term="infrastructure">Infrastructure</GlossaryTooltip>
              </span>
              <span className="font-medium">
                ${formatCost(viewMode === "yearly" ? costs.infrastructure : Math.round(costs.infrastructure / 12))}
                <span className="text-xs text-slate-500 ml-1">{viewMode === "monthly" ? "/month" : "/year"}</span>
              </span>
            </div>
            <Progress value={(costs.infrastructure / maxCost) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                <GlossaryTooltip term="maintenance">Maintenance</GlossaryTooltip>
              </span>
              <span className="font-medium">
                ${formatCost(viewMode === "yearly" ? costs.maintenance : Math.round(costs.maintenance / 12))}
                <span className="text-xs text-slate-500 ml-1">{viewMode === "monthly" ? "/month" : "/year"}</span>
              </span>
            </div>
            <Progress value={(costs.maintenance / maxCost) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                <GlossaryTooltip term="content moderation">Content Moderation</GlossaryTooltip>
              </span>
              <span className="font-medium">
                ${formatCost(viewMode === "yearly" ? costs.moderation : Math.round(costs.moderation / 12))}
                <span className="text-xs text-slate-500 ml-1">{viewMode === "monthly" ? "/month" : "/year"}</span>
              </span>
            </div>
            <Progress value={(costs.moderation / maxCost) * 100} className="h-2" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Cost Factors</h4>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p className="mb-2">These factors from your choices influence the cost estimates:</p>
          <ul className="list-disc pl-5 space-y-1">
            {costFactors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
        <h4 className="font-medium mb-2">Cost Breakdown Notes</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <li>
            <span className="font-medium">Development:</span> Initial design, programming, testing, and{" "}
            <GlossaryTooltip term="deployment">deployment</GlossaryTooltip>
          </li>
          <li>
            <span className="font-medium">Training:</span> Data collection, preparation, and model training
          </li>
          <li>
            <span className="font-medium">Infrastructure:</span> Servers,{" "}
            <GlossaryTooltip term="cloud services">cloud services</GlossaryTooltip>, databases, and hosting
          </li>
          <li>
            <span className="font-medium">Maintenance:</span> Ongoing updates, bug fixes, and improvements
          </li>
          <li>
            <span className="font-medium">Content Moderation:</span> Systems and personnel to monitor and moderate
            content
          </li>
        </ul>
      </div>
    </div>
  )
}
