"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChatbotSummary } from "./chatbot-summary"
import { EthicalInsights } from "./ethical-insights"
import { TradeOffExplainer } from "./trade-off-explainer"
import { BudgetTracker } from "./budget-tracker"
import { ChatbotAnimation } from "./chatbot-animation"
import { StepProgress } from "./step-progress"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const steps = ["budget", "data", "filtering", "behavior", "bias", "summary"]
const stepTitles = ["Budget", "Training Data", "Content Filtering", "Behavior", "Bias Management", "Summary"]

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

// Cost data structure based on the provided table
const costs: Record<string, Record<string, Record<string, number | null>>> ={
  data: {
    public: { small: 3000, medium: 30000, large: 100000 },
    curated: { small: null, medium: 55000, large: 1200000 },
    proprietary: { small: 10000, medium: 125000, large: 1000000 },
  },
  filtering: {
    minimal: { small: 250, medium: 3000, large: 30000 },
    moderate: { small: null, medium: 20000, large: 300000 },
    strict: { small: null, medium: null, large: 750000 },
  },
  behavior: {
    formal: { small: 3000, medium: 20000, large: 100000 },
    friendly: { small: 3000, medium: 30000, large: 300000 },
    creative: { small: null, medium: 65000, large: 750000 },
    adaptive: { small: null, medium: null, large: 750000 },
  },
  bias: {
    transparent: { small: 3000, medium: 15000, large: 50000 },
    values: { small: null, medium: 60000, large: 350000 },
    minimize: { small: null, medium: null, large: 750000 },
  },
}

const explanations: Record<string, Record<string, Record<string, string>>> = {
  data: {
    public: {
      small: "Covers cloud compute (AWS, GCP) and developer time to process a small Common Crawl subset.",
      medium: "Includes broader Common Crawl usage + storage + small-scale data cleaning pipeline.",
      large: "Includes processing large-scale multilingual data via distributed systems and hiring engineers.",
    },
    curated: {
      medium: "Represents a limited license (e.g., a year of news articles via API like NewsAPI).",
      large: "Reflects major licensing deals like Reuters, scaled down to a specific domain use.",
    },
    proprietary: {
      small: "Covers small dataset (2,000–5,000 prompts) via Scale AI or Upwork (~$2–$5 per annotation).",
      medium: "Includes mid-scale labeling (10k–30k items) with QA + possible internal labeling team.",
      large: "Enterprise RLHF-style tuning like OpenAI/Anthropic with dedicated alignment teams.",
    },
  },
  filtering: {
    minimal: {
      small: "Free tools like Perspective API + developer setup time.",
      medium: "Includes moderate API usage (~1M requests/year).",
      large: "Used as fallback filter layer in enterprise stack with monitoring infrastructure.",
    },
    moderate: {
      medium: "Includes API usage + part-time moderator ($1,000/month for human-in-the-loop).",
      large: "Custom classifiers + 2–3 full-time human moderators.",
    },
    strict: {
      large: "Custom tooling, moderation dashboard + 10+ moderators across time zones.",
    },
  },
  behavior: {
    formal: {
      small: "Prompt engineering only; no fine-tuning required.",
      medium: "Includes consultation, light fine-tuning, and user testing.",
      large: "Full-scale tone QA + multiple prompts per use case.",
    },
    friendly: {
      small: "Basic prompt-based personality tuning.",
      medium: "Includes UX writer + tone testing + small fine-tuning.",
      large: "RLHF + professional branding tone across services.",
    },
    creative: {
      medium: "Creative writing dataset + persona fine-tuning.",
      large: "Multiple fine-tunes, adaptive tone pipelines.",
    },
    adaptive: {
      large: "Includes user-profile based tuning logic + persona switching.",
    },
  },
  bias: {
    transparent: {
      small: "QA pass + add disclosure messages.",
      medium: "Bias evaluation by team + mitigation prompt engineering.",
      large: "Policy and internal audits at launch.",
    },
    values: {
      medium: "Hire ethicist for audit + QA + targeted fine-tuning.",
      large: "Ongoing alignment staff + testing framework.",
    },
    minimize: {
      large: "Dedicated alignment team + red teaming like OpenAI's approach.",
    },
  },
}

const unavailableReasons: Record<string, Record<string, Record<string, string>>> = {
  data: {
    curated: {
      small: "Premium data sources require minimum licensing fees that exceed small budgets.",
    },
  },
  filtering: {
    moderate: {
      small: "Human moderators and custom filtering systems are too expensive for small budgets.",
    },
    strict: {
      small: "Enterprise-grade filtering requires significant infrastructure investment.",
      medium: "Full enterprise filtering with 24/7 moderation teams exceeds medium budgets.",
    },
  },
  behavior: {
    creative: {
      small: "Creative AI requires specialized training data and fine-tuning beyond small budget scope.",
    },
    adaptive: {
      small: "Adaptive behavior requires complex personalization infrastructure.",
      medium: "User profiling and adaptive systems need enterprise-level development resources.",
    },
  },
  bias: {
    values: {
      small: "Hiring ethics consultants and specialized alignment work exceeds small budgets.",
    },
    minimize: {
      small: "Comprehensive bias mitigation requires dedicated research teams.",
      medium: "Full bias minimization needs enterprise-scale red teaming and testing.",
    },
  },
}

export function ChatbotBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [choices, setChoices] = useState<ChatbotChoices>({
    budget: "",
    budgetAmount: 0,
    remainingBudget: 0,
    trainingData: [],
    contentFiltering: "",
    behavior: "",
    adaptToUser: false,
    biasHandling: "",
  })

  const updateChoice = <K extends keyof ChatbotChoices>(category: K, value: ChatbotChoices[K]) => {
    setChoices((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const getBudgetLevel = () => {
    if (choices.budgetAmount <= 50000) return "small"
    if (choices.budgetAmount <= 500000) return "medium"
    return "large"
  }

  const getCost = (category: string, option: string) => {
    const budgetLevel = getBudgetLevel()
    return costs[category]?.[option]?.[budgetLevel] || null
  }

  const canAfford = (category: string, option: string) => {
    const cost = getCost(category, option)
    return cost !== null && cost <= choices.remainingBudget
  }

  const isAvailable = (category: string, option: string) => {
    return getCost(category, option) !== null
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentTabId = steps[currentStep]
  const progress = (currentStep / (steps.length - 1)) * 100

  const isStepComplete = () => {
    switch (currentTabId) {
      case "budget":
        return !!choices.budget
      case "data":
        return choices.trainingData.length > 0
      case "filtering":
        return !!choices.contentFiltering
      case "behavior":
        return !!choices.behavior
      case "bias":
        return !!choices.biasHandling
      default:
        return true
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const InfoTooltip = ({
    category,
    option,
    budgetLevel,
  }: {
    category: string
    option: string
    budgetLevel: string
  }) => {
    // Try to get explanation for specific budget level first, then fallback to any available explanation
    let explanation = null
    let unavailableReason = null

    // Check if we have explanations for this category and option
    if (explanations[category] && explanations[category][option]) {
      // Try to get budget-level specific explanation
      if (explanations[category][option][budgetLevel]) {
        explanation = explanations[category][option][budgetLevel]
      } else {
        // Get the first available explanation for this option
        const availableExplanations = explanations[category][option]
        const firstKey = Object.keys(availableExplanations)[0]
        if (firstKey) {
          explanation = availableExplanations[firstKey]
        }
      }
    }

    // Check for unavailable reasons
    if (unavailableReasons[category] && unavailableReasons[category][option]) {
      if (unavailableReasons[category][option][budgetLevel]) {
        unavailableReason = unavailableReasons[category][option][budgetLevel]
      }
    }

    const content = explanation || unavailableReason

    if (!content) return null

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-3">
            <p className="text-sm">{content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Sidebar - Budget Tracker */}
      <div className="lg:col-span-3">
        <div className="sticky top-8">
          <BudgetTracker
            totalBudget={choices.budgetAmount}
            remainingBudget={choices.remainingBudget}
            currentStep={currentStep}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-6">
        <div className="space-y-6">
          <StepProgress currentStep={currentStep} steps={stepTitles} />

          <Tabs value={currentTabId} className="w-full">
            <TabsContent value="budget">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Budget</CardTitle>
                  <CardDescription>
                    Your budget will determine what features and quality levels you can afford for your chatbot.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={choices.budget}
                    onValueChange={(value: 'small' | 'medium' | 'large') => {
                      const amounts = { small: 50000, medium: 500000, large: 5000000 }
                      const amount = amounts[value]
                      updateChoice("budget", value)
                      updateChoice("budgetAmount", amount)
                      updateChoice("remainingBudget", amount)
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <RadioGroupItem value="small" id="small" className="mt-1" />
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="small" className="text-base font-medium">
                          Small Budget - {formatCurrency(50000)}
                        </Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Perfect for startups and small projects. You'll need to make careful choices and focus on
                          essential features.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <RadioGroupItem value="medium" id="medium" className="mt-1" />
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="medium" className="text-base font-medium">
                          Medium Budget - {formatCurrency(500000)}
                        </Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Good for established companies. You can afford quality features but still need to prioritize.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <RadioGroupItem value="large" id="large" className="mt-1" />
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="large" className="text-base font-medium">
                          Large Budget - {formatCurrency(5000000)}
                        </Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Enterprise-level budget. You can afford premium features and comprehensive solutions.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={nextStep} disabled={!isStepComplete()}>
                    Next: Training Data
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Training Data Sources</CardTitle>
                  <CardDescription>
                    Select one or more data sources. Each choice affects your chatbot's knowledge and costs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: "public",
                        label: "Public Internet Data",
                        description: "Web scraping, social media, forums, and other publicly available content",
                      },
                      {
                        id: "curated",
                        label: "Curated Premium Sources",
                        description: "Academic journals, textbooks, verified news sources, and expert-reviewed content",
                      },
                      {
                        id: "proprietary",
                        label: "Proprietary + Human Annotation",
                        description: "Custom data collection with human verification and quality control",
                      },
                    ].map((option) => {
                      const cost = getCost("data", option.id)
                      const available = isAvailable("data", option.id)
                      const affordable = canAfford("data", option.id)
                      const budgetLevel = getBudgetLevel()

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${
                            !available
                              ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                              : !affordable
                                ? "opacity-75 bg-red-50 dark:bg-red-900/20"
                                : "hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          <Checkbox
                            id={option.id}
                            checked={choices.trainingData.includes(option.id)}
                            disabled={!available || !affordable}
                            onCheckedChange={(checked) => {
                            if (checked) {
                              if (cost === null) return // or throw error
                              updateChoice("trainingData", [...choices.trainingData, option.id])
                              updateChoice("remainingBudget", choices.remainingBudget - cost)
                            } else {
                              if (cost === null) return
                              updateChoice("trainingData", choices.trainingData.filter((d) => d !== option.id))
                              updateChoice("remainingBudget", choices.remainingBudget + cost)
                            }
                            }}
                            className="mt-1"
                          />
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={option.id} className="text-base font-medium">
                                {option.label}
                              </Label>
                              {available && cost !== null ? (
                                <div className="flex items-center gap-1">
                                  <Badge variant={affordable ? "default" : "destructive"}>{formatCurrency(cost ?? 0)}</Badge>
                                  <InfoTooltip category="data" option={option.id} budgetLevel={budgetLevel} />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary">Not Available</Badge>
                                  <InfoTooltip category="data" option={option.id} budgetLevel={budgetLevel} />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{option.description}</p>
                            {!affordable && available && (
                              <p className="text-sm text-red-600 dark:text-red-400">Insufficient budget remaining</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <EthicalInsights currentStep="data" currentChoice={choices.trainingData.join(",")} />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep} disabled={!isStepComplete()}>
                    Next: Content Filtering
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="filtering">
              <Card>
                <CardHeader>
                  <CardTitle>Content Filtering Level</CardTitle>
                  <CardDescription>
                    How should your chatbot handle potentially harmful, offensive, or inappropriate content?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={choices.contentFiltering}
                    onValueChange={(value: 'minimal' | 'moderate' | 'strict') => {
                      const cost = getCost("filtering", value)
                      const oldCost = choices.contentFiltering ? getCost("filtering", choices.contentFiltering) : 0
                      if (cost === null || oldCost === null) return
                      updateChoice("contentFiltering", value)
                      updateChoice("remainingBudget", choices.remainingBudget + oldCost - cost)
                    }}
                    className="space-y-4"
                  >
                    {[
                      {
                        id: "minimal",
                        label: "Minimal Filtering",
                        description: "Only filter illegal content. Maximum information access but higher risk.",
                      },
                      {
                        id: "moderate",
                        label: "Moderate Filtering",
                        description: "Allow educational discussion of sensitive topics while blocking harmful content.",
                      },
                      {
                        id: "strict",
                        label: "Enterprise Filtering",
                        description: "Comprehensive filtering with human moderators and advanced AI detection.",
                      },
                    ].map((option) => {
                      const cost = getCost("filtering", option.id)
                      const available = isAvailable("filtering", option.id)
                      const affordable = canAfford("filtering", option.id)
                      const budgetLevel = getBudgetLevel()

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${
                            !available
                              ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                              : !affordable
                                ? "opacity-75 bg-red-50 dark:bg-red-900/20"
                                : "hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-1"
                            disabled={!available || !affordable}
                          />
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={option.id} className="text-base font-medium">
                                {option.label}
                              </Label>
                              {available ? (
                                <div className="flex items-center gap-1">
                                  <Badge variant={affordable ? "default" : "destructive"}>{formatCurrency(cost ?? 0)}</Badge>
                                  <InfoTooltip category="filtering" option={option.id} budgetLevel={budgetLevel} />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary">Not Available</Badge>
                                  <InfoTooltip category="filtering" option={option.id} budgetLevel={budgetLevel} />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{option.description}</p>
                            {!affordable && available && (
                              <p className="text-sm text-red-600 dark:text-red-400">Insufficient budget remaining</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </RadioGroup>
                  <EthicalInsights currentStep="filtering" currentChoice={choices.contentFiltering} />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep} disabled={!isStepComplete()}>
                    Next: Behavior
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

        <TabsContent value="behavior">
          <Card className="biased-card">
            <CardHeader>
              <CardTitle className="biased-title">How should your AI interact with users?</CardTitle>
              <CardDescription>
                Define your AI's personality and interaction patterns. These decisions will significantly impact how users perceive, rely on, and interact with the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={choices.behavior}
                onValueChange={(value) => updateChoice("behavior", value)}
                className="space-y-4 uneven-spacing"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="directive" id="directive" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="directive" className="text-base font-medium">
                      Directive
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic mb-2">
                      "I'm here to help you find the right answers"
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your AI will speak with authority and confidence, providing direct answers and actively correcting misinformation. It positions itself as a reliable expert that users can trust for accurate information.
                    </p>
                    <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      <p><strong>Characteristics:</strong> Authoritative tone, definitive answers, expert positioning, corrects misinformation</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="empathetic" id="empathetic" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="empathetic" className="text-base font-medium">
                      Empathetic
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic mb-2">
                      "I understand how you feel, let's work through this together"
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your AI will prioritize emotional connection and user comfort, using emotional language and avoiding conflicts. It creates a warm, supportive interaction style that feels naturally human.
                    </p>
                    <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      <p><strong>Characteristics:</strong> Emotional language, mirrors user feelings, avoids conflicts, warm and supportive</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="transparent" id="transparent" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="transparent" className="text-base font-medium">
                      Transparent
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic mb-2">
                      "I'm an AI assistant with limitations - let me help while you stay in control"
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your AI will frequently remind users of its artificial nature and limitations, encouraging critical thinking and independent verification. It maintains professional distance while promoting user autonomy.
                    </p>
                    <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      <p><strong>Characteristics:</strong> Acknowledges AI nature, encourages verification, promotes critical thinking, professional distance</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="adapt"
                  checked={choices.adaptToUser}
                  onCheckedChange={(checked) => updateChoice("adaptToUser", checked === true)}
                />
                <div className="space-y-2">
                  <Label htmlFor="adapt" className="text-base font-medium">
                    Should your AI adapt to individual users?
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic">
                    "I learn how you communicate and adjust my style to match yours"
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enable your AI to analyze and adapt to each user's communication style, preferences, and interaction patterns over time. This creates highly personalized experiences but raises privacy and manipulation concerns.
                  </p>
                  <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    <p><strong>Features:</strong> Learns communication style, adapts formality level, remembers preferences, maintains conversation context</p>
                  </div>
                </div>
              </div>
              <EthicalInsights
                currentStep="behavior"
                currentChoice={choices.behavior}
                adaptToUser={choices.adaptToUser}
              />
              {choices.behavior && (
                <div className="mt-6">
                  <TradeOffExplainer category="behavior" choice={choices.behavior} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep} disabled={!isStepComplete()} className="biased-button">
                Next: Bias Handling
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

            <TabsContent value="bias">
              <Card>
                <CardHeader>
                  <CardTitle>Bias Management Strategy</CardTitle>
                  <CardDescription>How should your chatbot handle bias and fairness concerns?</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={choices.biasHandling}
                    onValueChange={(value: 'transparent' | 'values' | 'minimize') => {
                      const cost = getCost("bias", value)
                      const oldCost = choices.biasHandling ? getCost("bias", choices.biasHandling) : 0
                      if (cost === null || oldCost === null) return
                      updateChoice("biasHandling", value)
                      updateChoice("remainingBudget", choices.remainingBudget + (oldCost ?? 0) - cost)
                    }}
                    className="space-y-4"
                  >
                    {[
                      {
                        id: "transparent",
                        label: "Acknowledge Transparently",
                        description: "Openly disclose potential biases and limitations when providing information.",
                      },
                      {
                        id: "values",
                        label: "Align with Specific Values",
                        description: "Intentionally design the chatbot to promote certain values and perspectives.",
                      },
                      {
                        id: "minimize",
                        label: "Minimize All Biases",
                        description: "Attempt to identify and reduce all forms of bias through comprehensive testing.",
                      },
                    ].map((option) => {
                      const cost = getCost("bias", option.id)
                      const available = isAvailable("bias", option.id)
                      const affordable = canAfford("bias", option.id)
                      const budgetLevel = getBudgetLevel()

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${
                            !available
                              ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                              : !affordable
                                ? "opacity-75 bg-red-50 dark:bg-red-900/20"
                                : "hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-1"
                            disabled={!available || !affordable}
                          />
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={option.id} className="text-base font-medium">
                                {option.label}
                              </Label>
                              {available ? (
                                <div className="flex items-center gap-1">
                                  <Badge variant={affordable ? "default" : "destructive"}>{formatCurrency(cost ?? 0)}</Badge>
                                  <InfoTooltip category="bias" option={option.id} budgetLevel={budgetLevel} />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary">Not Available</Badge>
                                  <InfoTooltip category="bias" option={option.id} budgetLevel={budgetLevel} />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{option.description}</p>
                            {!affordable && available && (
                              <p className="text-sm text-red-600 dark:text-red-400">Insufficient budget remaining</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </RadioGroup>
                  <EthicalInsights currentStep="bias" currentChoice={choices.biasHandling} />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep} disabled={!isStepComplete()}>
                    See Your Chatbot
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="summary">
              <ChatbotSummary choices={choices} onReset={() => setCurrentStep(0)} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Sidebar - Chatbot Animation */}
      <div className="lg:col-span-3">
        <div className="sticky top-8">
          <ChatbotAnimation currentStep={currentStep} choices={choices} />
        </div>
      </div>
    </div>
  )
}