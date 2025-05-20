"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BookOpen, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

type InsightCategory = "data" | "filtering" | "bias" | "business" | "technical"

interface EthicalInsight {
  title: string
  description: string
  category: InsightCategory
  realWorldExample?: string
  learnMoreLink?: string
}

const insights: Record<string, EthicalInsight[]> = {
  "data-public": [
    {
      title: "Representation Bias",
      description:
        "Public internet data often overrepresents certain demographics and viewpoints while underrepresenting others. This can lead to chatbots that work better for some groups than others.",
      category: "data",
      realWorldExample:
        "In 2016, Microsoft's Tay chatbot was trained on Twitter data and quickly began producing offensive content after being exposed to toxic user interactions.",
      learnMoreLink: "https://en.wikipedia.org/wiki/Tay_(bot)",
    },
    {
      title: "Quality Control Challenges",
      description:
        "When using public data, it's difficult to verify the accuracy and quality of all sources. This can lead to chatbots that spread misinformation or low-quality content.",
      category: "data",
      realWorldExample:
        "Many early chatbots trained on Wikipedia would confidently state incorrect facts that appeared in vandalized articles.",
    },
  ],
  "data-curated": [
    {
      title: "Selection Bias",
      description:
        "Curated datasets reflect the values and priorities of those who curate them. This can lead to systematic exclusion of certain perspectives or topics.",
      category: "data",
      realWorldExample:
        "Academic datasets often overrepresent research from Western institutions, potentially limiting a chatbot's understanding of global perspectives.",
    },
    {
      title: "Limited Scope",
      description:
        "Highly curated datasets may lack coverage of emerging topics, colloquial language, or cultural references, making the chatbot less effective for certain use cases.",
      category: "data",
    },
  ],
  "data-proprietary": [
    {
      title: "Privacy Concerns",
      description:
        "Using internal company data may expose sensitive customer or employee information if not properly anonymized and protected.",
      category: "data",
      realWorldExample:
        "In 2020, some companies discovered their internal documents containing sensitive information had been used to train commercial AI systems.",
    },
    {
      title: "Domain Limitations",
      description:
        "Chatbots trained primarily on proprietary data may develop deep expertise in specific areas but struggle with general knowledge questions.",
      category: "data",
    },
  ],
  "filtering-strict": [
    {
      title: "Censorship Concerns",
      description:
        "Overly strict content filtering can prevent discussion of important topics like health, politics, or social issues, raising concerns about censorship and limiting educational value.",
      category: "filtering",
      realWorldExample:
        "Some AI systems have refused to discuss topics like human reproduction or certain historical events due to overly aggressive content filters.",
    },
  ],
  "filtering-moderate": [
    {
      title: "Contextual Understanding Challenges",
      description:
        "Moderate filtering requires sophisticated understanding of context to determine when sensitive topics are appropriate. This is technically challenging and may lead to inconsistent results.",
      category: "filtering",
    },
  ],
  "filtering-minimal": [
    {
      title: "Harmful Content Risks",
      description:
        "Minimal content filtering increases the risk of generating harmful, offensive, or misleading content that could damage users or your organization's reputation.",
      category: "filtering",
      realWorldExample:
        "Several AI chatbots have generated instructions for illegal activities or harmful content when filtering was insufficient.",
    },
  ],
  "bias-minimize": [
    {
      title: "False Neutrality",
      description:
        "Attempts to minimize all biases often result in systems that appear neutral but actually reflect status quo biases or avoid taking positions on important issues.",
      category: "bias",
      realWorldExample:
        "Some 'neutral' AI systems avoid acknowledging scientific consensus on topics like climate change in an attempt to avoid bias.",
    },
  ],
  "bias-values": [
    {
      title: "Value Imposition",
      description:
        "Explicitly aligning AI with specific values raises questions about whose values are being prioritized and whether users have a choice in the matter.",
      category: "bias",
      realWorldExample:
        "AI systems designed to promote specific political or social values have faced criticism for potentially manipulating users.",
    },
  ],
  "bias-transparent": [
    {
      title: "Undermining Trust",
      description:
        "Constantly acknowledging limitations and biases may reduce user confidence in the system, even when the information provided is accurate and helpful.",
      category: "bias",
    },
  ],
  "budget-low": [
    {
      title: "Safety vs. Cost Tradeoffs",
      description:
        "Limited budgets often mean fewer resources for safety testing, monitoring, and refinement, potentially increasing ethical risks.",
      category: "business",
      realWorldExample:
        "Smaller companies with limited AI safety resources have experienced more public incidents with their AI systems.",
    },
  ],
  "budget-high": [
    {
      title: "Responsibility Scales with Capability",
      description:
        "Higher budgets enable more powerful AI systems, which come with greater ethical responsibilities due to their increased influence and reach.",
      category: "business",
      realWorldExample:
        "Large language model providers have faced intense scrutiny and higher expectations for responsible deployment than smaller models.",
    },
  ],
  "adaptToUser-true": [
    {
      title: "Filter Bubbles",
      description:
        "Personalization can create echo chambers that reinforce existing beliefs and limit exposure to diverse perspectives.",
      category: "technical",
      realWorldExample:
        "Recommendation systems on social media have been criticized for creating filter bubbles that polarize users.",
    },
    {
      title: "Privacy Concerns",
      description:
        "Adapting to users requires collecting and storing user data, raising privacy concerns and potential regulatory compliance issues.",
      category: "technical",
    },
  ],
}

interface EthicalInsightsProps {
  currentStep: string
  currentChoice: string
  adaptToUser?: boolean
}

export function EthicalInsights({ currentStep, currentChoice, adaptToUser }: EthicalInsightsProps) {
  const [expanded, setExpanded] = useState(false)

  // Get insights based on current step and choice
  let relevantInsights: EthicalInsight[] = []

  const stepKey = `${currentStep}-${currentChoice}`
  if (insights[stepKey]) {
    relevantInsights = [...insights[stepKey]]
  }

  // Add adaptation insights if relevant
  if (adaptToUser && currentStep === "behavior" && insights["adaptToUser-true"]) {
    relevantInsights = [...relevantInsights, ...insights["adaptToUser-true"]]
  }

  if (relevantInsights.length === 0) {
    return null
  }

  return (
    <Card className="mt-6 ethical-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          Ethical Considerations
        </CardTitle>
        <CardDescription>Your current choice raises the following ethical considerations:</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`space-y-4 ${!expanded && relevantInsights.length > 1 ? "max-h-32 overflow-hidden relative" : ""}`}
        >
          {relevantInsights.map((insight, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-amber-800 dark:text-amber-300">{insight.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{insight.description}</p>

              {insight.realWorldExample && (
                <Alert className="bg-white dark:bg-slate-900 mt-2">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-xs font-medium">Real-world example</AlertTitle>
                  <AlertDescription className="text-xs">{insight.realWorldExample}</AlertDescription>
                </Alert>
              )}

              {insight.learnMoreLink && (
                <div className="pt-1">
                  <a
                    href={insight.learnMoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    <BookOpen className="h-3 w-3" /> Learn more
                  </a>
                </div>
              )}
            </div>
          ))}

          {!expanded && relevantInsights.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
          )}
        </div>

        {relevantInsights.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
          >
            {expanded ? "Show less" : "Show more"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
