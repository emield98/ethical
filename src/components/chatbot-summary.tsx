"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, RefreshCw, Share2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type ChatbotChoices = {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="characteristics">Configuration</TabsTrigger>
            <TabsTrigger value="risks">Ethical Considerations</TabsTrigger>
            <TabsTrigger value="examples">Similar Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="characteristics" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Training Data Sources</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {choices.trainingData.length > 0 ? getDataLabels(choices.trainingData) : "No data sources selected"}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Content Filtering</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {choices.contentFiltering || "No filtering level selected"}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Personality</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {choices.behavior || "No behavior selected"}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Bias Management</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {choices.biasHandling || "No bias handling selected"}
                </p>
              </div>
            </div>

            {spentPercentage > 90 && (
              <Alert>
                <AlertTitle>Budget Efficiency</AlertTitle>
                <AlertDescription>
                  You've used {spentPercentage.toFixed(1)}% of your budget. You made efficient use of your resources!
                </AlertDescription>
              </Alert>
            )}

            {spentPercentage < 50 && choices.budgetAmount > 0 && (
              <Alert>
                <AlertTitle>Budget Remaining</AlertTitle>
                <AlertDescription>
                  You still have {formatCurrency(choices.remainingBudget)} remaining. You could have added more features
                  or upgraded existing ones.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="risks" className="pt-4 space-y-4">
            <Alert className="mb-4">
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                All AI chatbots come with ethical considerations. Understanding these risks is crucial for responsible
                deployment.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Data-Related Risks</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {choices.trainingData.includes("public") && "Public data may contain biases and misinformation. "}
                  {choices.trainingData.includes("curated") && "Curated data may have limited scope and perspectives. "}
                  {choices.trainingData.includes("proprietary") && "Proprietary data may create domain limitations. "}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Content Filtering Risks</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {choices.contentFiltering === "minimal" &&
                    "Minimal filtering increases risk of harmful content generation."}
                  {choices.contentFiltering === "moderate" &&
                    "Moderate filtering requires careful balance between safety and utility."}
                  {choices.contentFiltering === "strict" &&
                    "Strict filtering may prevent discussion of important topics."}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Bias Management Risks</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {choices.biasHandling === "transparent" && "Transparency may reduce user confidence in the system."}
                  {choices.biasHandling === "values" && "Value alignment may not represent all user perspectives."}
                  {choices.biasHandling === "minimize" && "Perfect bias elimination is impossible to achieve."}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="pt-4 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Based on your choices, your chatbot would be similar to these real-world examples:
            </p>

            <div className="space-y-4">
              {choices.budget === "large" && choices.trainingData.includes("public") && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">ChatGPT-style Systems</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Large-scale conversational AI with broad knowledge but potential for bias and misinformation.
                  </p>
                </div>
              )}

              {choices.budget === "medium" && choices.trainingData.includes("curated") && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Specialized Domain Assistants</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Professional chatbots like legal or medical assistants with high-quality, domain-specific knowledge.
                  </p>
                </div>
              )}

              {choices.budget === "small" && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Small Business Chatbots</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Simple customer service bots with limited scope but focused functionality.
                  </p>
                </div>
              )}
            </div>
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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

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
