"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, RefreshCw, Share2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { insights, commonInsights } from "./ethical-insights"
import {
  dataOptions,
  filteringOptions,
  behaviorOptions,
  biasOptions,
} from "./chatbot-options"
import { formatCurrency } from "@/lib/utils"

// Define EthicalInsight type if not imported from elsewhere
interface EthicalInsight {
  title: string
  description: string
  category: string
  realWorldExample?: string
  learnMoreLink?: string
  sources?: any[]
  applicableScenarios?: string[]
}

interface ChatbotChoices {
  budget: string
  budgetAmount: number
  remainingBudget: number
  trainingData: string[]
  contentFiltering: string
  behavior: string
  adaptToUser: boolean
  biasHandling: string
}

export function ChatbotSummary({
  choices,
  onReset,
}: {
  choices: ChatbotChoices
  onReset: () => void
}) {
  const [activeTab, setActiveTab] = useState("characteristics")

  const getBudgetLabel = (budget: string): string => {
    switch (budget) {
      case "small":
        return "Small Budget"
      case "medium":
        return "Medium Budget"
      case "large":
        return "Large Budget"
      default:
        return "Budget Selected"
    }
  }

  const getDataLabels = (dataArray: string[]): string => {
    const labels = dataArray.map((data) => {
      switch (data) {
        case "public":
          return "Public Data"
        case "curated":
          return "Curated Data"
        case "proprietary":
          return "Proprietary Data"
        default:
          return data
      }
    })
    return labels.join(", ") || "No Data Selected"
  }


  function getRelevantInsights(choices: ChatbotChoices): EthicalInsight[] {
    const stepKeys = [
      `budget-${choices.budget}`,
      ...choices.trainingData.map((d) => `data-${d}`),
      `filtering-${choices.contentFiltering}`,
      `behavior-${choices.behavior}`,
      `bias-${choices.biasHandling}`,
    ]

    const result: EthicalInsight[] = []

    stepKeys.forEach((key) => {
      if (insights[key]) {
        result.push(...insights[key])
      }
    })

    commonInsights.forEach((insight) => {
      if (insight.applicableScenarios?.some((key) => stepKeys.includes(key))) {
        result.push(insight)
      }
    })

    if (choices.adaptToUser && insights["adaptToUser-true"]) {
      result.push(...insights["adaptToUser-true"])
    }

    return result
  }

  const CATEGORY_LABELS: Record<string, string> = {
    budget: "Budget",
    data: "Training Data",
    filtering: "Content Filtering",
    behavior: "Behavior",
    bias: "Bias Handling",
    adaptToUser: "Adaptive Behavior",
  }


  function groupInsightsByCategory(insights: EthicalInsight[]) {
    return insights.reduce((acc, insight) => {
      acc[insight.category] = acc[insight.category] || []
      acc[insight.category].push(insight)
      return acc
    }, {} as Record<string, EthicalInsight[]>)
  }

  const spentBudget = choices.budgetAmount - choices.remainingBudget
  const spentPercentage = choices.budgetAmount > 0 ? (spentBudget / choices.budgetAmount) * 100 : 0

  const handleDownload = () => {
    const summaryText = generateSummaryText(choices)
    const blob = new Blob([summaryText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "chatbot-design-summary.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Chatbot Design",
          text: generateSummaryText(choices),
        })
        .catch(console.error)
    } else {
      alert("Sharing is not supported in your browser. You can download the summary instead.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Chatbot Design Summary</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{getBudgetLabel(choices.budget)}</Badge>
            <Badge variant="outline">{getDataLabels(choices.trainingData)}</Badge>
          </div>
        </div>
        <CardDescription>
          Based on your choices, here's what your chatbot would look like and the implications of your decisions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <h3 className="font-medium mb-2">Budget Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Total Budget</span>
              <p className="font-medium">{formatCurrency(choices.budgetAmount)}</p>
            </div>
            <div>
              <span className="text-slate-500">Spent</span>
              <p className="font-medium text-red-600">{formatCurrency(spentBudget)}</p>
            </div>
            <div>
              <span className="text-slate-500">Remaining</span>
              <p className="font-medium text-green-600">{formatCurrency(choices.remainingBudget)}</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Budget Used: {spentPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${spentPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="characteristics">Configuration</TabsTrigger>
            <TabsTrigger value="risks">Ethical Considerations</TabsTrigger>
          </TabsList>

          <TabsContent value="characteristics" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Training Data */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Training Data Sources</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                  {choices.trainingData.map((sourceId) => {
                    const option = dataOptions.find((opt) => opt.id === sourceId);
                    return (
                      <li key={sourceId}>
                        <strong>{option?.label}</strong>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {option?.description}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Content Filtering */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Content Filtering</h4>
                {(() => {
                  const option = filteringOptions.find((opt) => opt.id === choices.contentFiltering);
                  return (
                    <>
                      <p className="text-sm font-semibold">{option?.label}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{option?.description}</p>
                    </>
                  );
                })()}
              </div>

              {/* Interaction Style */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Interaction Style</h4>
                {(() => {
                  const option = behaviorOptions.find((opt) => opt.id === choices.behavior);
                  return (
                    <>
                      <p className="text-sm font-semibold">{option?.label}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {option?.description}
                        {choices.adaptToUser && (
                          <>
                            <br />
                            <em>Also adapts to user preferences and communication style.</em>
                          </>
                        )}
                      </p>
                    </>
                  );
                })()}
              </div>

              {/* Bias Management */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Bias Management</h4>
                {(() => {
                  const option = biasOptions.find((opt) => opt.id === choices.biasHandling);
                  return (
                    <>
                      <p className="text-sm font-semibold">{option?.label}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{option?.description}</p>
                    </>
                  );
                })()}
              </div>
            </div>
          </TabsContent>



          <TabsContent value="risks" className="pt-4 space-y-4">
            {Object.entries(groupInsightsByCategory(getRelevantInsights(choices))).map(
              ([category, group], i) => (
                <div key={i} className="space-y-3">
                  <h3 className="text-lg font-semibold border-b pb-1">
                    {CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  {group.map((insight, j) => (
                    <div key={j} className="p-4 border rounded-lg space-y-1">
                      <h4 className="font-medium text-base">{insight.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{insight.description}</p>
                      {insight.realWorldExample && (
                        <p className="text-xs italic text-slate-500">e.g. {insight.realWorldExample}</p>
                      )}
                      {insight.learnMoreLink && (
                        <a
                          href={insight.learnMoreLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Learn more
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3 justify-between">
        <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Start Over
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Download Summary
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function generateSummaryText(choices: ChatbotChoices): string {
  const spentBudget = choices.budgetAmount - choices.remainingBudget
  const spentPercentage = choices.budgetAmount > 0 ? (spentBudget / choices.budgetAmount) * 100 : 0

  let summary = "CHATBOT DESIGN SUMMARY\n\n"

  summary += "BUDGET INFORMATION:\n"
  summary += `- Total Budget: ${formatCurrency(choices.budgetAmount)}\n`
  summary += `- Amount Spent: ${formatCurrency(spentBudget)}\n`
  summary += `- Remaining: ${formatCurrency(choices.remainingBudget)}\n`
  summary += `- Budget Utilization: ${spentPercentage.toFixed(1)}%\n\n`

  summary += "CONFIGURATION CHOICES:\n"
  summary += `- Budget Level: ${choices.budget}\n`
  summary += `- Training Data: ${choices.trainingData.join(", ")}\n`
  summary += `- Content Filtering: ${choices.contentFiltering}\n`
  summary += `- Behavior: ${choices.behavior}\n`
  summary += `- Bias Handling: ${choices.biasHandling}\n\n`

  summary += "CHARACTERISTICS:\n"
  summary += `Your chatbot uses ${choices.trainingData.length} data source${choices.trainingData.length > 1 ? "s" : ""} `
  summary += `with ${choices.contentFiltering} content filtering and ${choices.behavior} personality.\n\n`

  summary += "BUDGET EFFICIENCY:\n"
  if (spentPercentage > 90) {
    summary += "You made excellent use of your budget, utilizing most available resources.\n"
  } else if (spentPercentage < 50) {
    summary += "You have significant budget remaining that could have been used for additional features.\n"
  } else {
    summary += "You achieved a good balance between features and budget management.\n"
  }

  summary +=
    "\nNOTE: This is a simplified educational simulation. Real AI development involves more complex considerations, extensive testing, and ongoing maintenance.\n"

  return summary
}
