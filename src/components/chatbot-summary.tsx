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
          <TabsList className="grid w-full grid-cols-3">
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
            <Alert className="mb-4">
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                All AI chatbots come with ethical considerations. These risks vary based on your design choices.
              </AlertDescription>
            </Alert>
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

// Helper functions

function getBudgetLabel(budget: string): string {
  switch (budget) {
    case "low":
      return "Limited Budget"
    case "medium":
      return "Medium Budget"
    case "high":
      return "Large Budget"
    default:
      return "Undefined Budget"
  }
}

function getDataLabel(data: string): string {
  switch (data) {
    case "public":
      return "Public Data"
    case "curated":
      return "Curated Data"
    case "proprietary":
      return "Proprietary Data"
    default:
      return "Undefined Data"
  }
}

function getBudgetDescription(budget: string): string {
  switch (budget) {
    case "low":
      return "With a limited budget, your chatbot will rely on pre-trained models with minimal customization. You'll need to leverage open-source solutions and focus on a narrow use case to be effective."
    case "medium":
      return "Your medium budget allows for some model fine-tuning and customization. You can collect moderate amounts of training data and implement more sophisticated features than off-the-shelf solutions."
    case "high":
      return "With a large budget, you can develop custom models, collect extensive training data, and implement advanced features like multimodal capabilities, sophisticated context handling, and extensive testing."
    default:
      return ""
  }
}

function getDataDescription(data: string): string {
  switch (data) {
    case "public":
      return "Your chatbot will draw knowledge from a wide range of public internet sources, giving it broad coverage but potentially including biases, misinformation, and varying quality content."
    case "curated":
      return "Your chatbot will be trained on carefully selected, high-quality sources like academic journals, textbooks, and verified information. This provides more reliable information but may have limited coverage of certain topics or cultural contexts."
    case "proprietary":
      return "Your chatbot will leverage your organization's internal data, making it highly specialized for your domain but potentially limited in general knowledge. This approach offers unique value but requires careful data governance."
    default:
      return ""
  }
}

function getFilteringDescription(filtering: string): string {
  switch (filtering) {
    case "strict":
      return "Your chatbot will avoid all potentially offensive, harmful, or controversial content. This creates a safe environment but may limit the chatbot's utility for certain topics and discussions."
    case "moderate":
      return "Your chatbot will allow educational discussion of sensitive topics while blocking harmful content. This balances safety with utility but requires more sophisticated content moderation systems."
    case "minimal":
      return "Your chatbot will only filter illegal content, maximizing information access but increasing the risk of generating harmful or offensive responses. This approach requires robust user guidelines and oversight."
    default:
      return ""
  }
}

function getBehaviorDescription(behavior: string): string {
  switch (behavior) {
    case "directive":
      return "Your chatbot will speak with authority and confidence, providing direct answers and actively correcting misinformation. It positions itself as a reliable expert users can trust."
    case "empathetic":
      return "Your chatbot will prioritize emotional connection and user comfort, using emotional language and creating warm, supportive interactions that feel naturally human."
    case "transparent":
      return "Your chatbot will frequently remind users of its artificial nature and limitations, encouraging critical thinking and independent verification while maintaining professional distance."
    default:
      return ""
  }
}

function getBiasDescription(bias: string): string {
  switch (bias) {
    case "minimize":
      return "Your chatbot will attempt to identify and reduce all forms of bias in its responses, aiming for neutrality. This may result in more cautious, less opinionated answers."
    case "values":
      return "Your chatbot will be intentionally designed to promote specific values and perspectives. This creates a clearer ethical stance but may not represent all viewpoints equally."
    case "transparent":
      return "Your chatbot will openly acknowledge potential biases and limitations when providing information. This educational approach helps users understand the context but may reduce perceived authority."
    default:
      return ""
  }
}

function getStrengths(choices: ChatbotChoices): string[] {
  const strengths: string[] = []

  // Budget-based strengths
  if (choices.budget === "high") {
    strengths.push("Ability to develop custom models tailored to specific needs")
    strengths.push("Resources for extensive testing and refinement")
  }

  // Data-based strengths
  if (Array.isArray(choices.trainingData) && choices.trainingData.includes("public")) {
    strengths.push("Broad knowledge across many domains and topics")
    strengths.push("Familiarity with contemporary language and cultural references")
  }
  if (Array.isArray(choices.trainingData) && choices.trainingData.includes("curated")) {
    strengths.push("High-quality, reliable information from verified sources")
    strengths.push("Reduced risk of spreading misinformation")
  }
  if (Array.isArray(choices.trainingData) && choices.trainingData.includes("proprietary")) {
    strengths.push("Specialized knowledge in your organization's domain")
    strengths.push("Ability to reference internal information not available to competitors")
  }

  // Filtering-based strengths
  if (choices.contentFiltering === "strict") {
    strengths.push("Safe for all audiences including children")
    strengths.push("Minimal risk of generating harmful content")
  } else if (choices.contentFiltering === "moderate") {
    strengths.push("Balance between safety and educational value")
    strengths.push("Ability to discuss sensitive topics in appropriate contexts")
  }

  // Behavior-based strengths
  if (choices.behavior === "directive") {
    strengths.push("Provides confident, authoritative guidance")
    strengths.push("Efficient decision-making support for users")
    strengths.push("Clear, direct communication style")
  } else if (choices.behavior === "empathetic") {
    strengths.push("Creates engaging, supportive user experiences")
    strengths.push("Higher user satisfaction and emotional connection")
    strengths.push("Effective at motivating positive behavior change")
  } else if (choices.behavior === "transparent") {
    strengths.push("Promotes user critical thinking and independence")
    strengths.push("Builds trust through honest limitation disclosure")
    strengths.push("Encourages verification of information from multiple sources")
  }

  // Adaptation-based strengths
  if (choices.adaptToUser) {
    strengths.push("Personalized experience that improves over time")
    strengths.push("Ability to remember user preferences and communication style")
  }

  // Bias-based strengths
  if (choices.biasHandling === "transparent") {
    strengths.push("Educational approach that helps users understand AI limitations")
    strengths.push("Builds trust through honesty about capabilities")
  }

  return strengths
}

function getLimitations(choices: ChatbotChoices): string[] {
  const limitations: string[] = []

  // Budget-based limitations
  if (choices.budget === "low") {
    limitations.push("Limited customization and capabilities")
    limitations.push("Reliance on generic pre-trained models")
  } else if (choices.budget === "medium") {
    limitations.push("Some trade-offs between features due to resource constraints")
  }

  // Data-based limitations
  if (Array.isArray(choices.trainingData) && choices.trainingData.includes("public")) {
    limitations.push("May contain biases, misinformation, or low-quality content")
    limitations.push("Less reliable for specialized or technical information")
  } else if (Array.isArray(choices.trainingData) && choices.trainingData.includes("curated")) {
    limitations.push("May have gaps in coverage of emerging topics or niche subjects")
    limitations.push("Potentially limited understanding of colloquial language or cultural nuances")
  } else if (Array.isArray(choices.trainingData) && choices.trainingData.includes("proprietary")) {
    limitations.push("Limited general knowledge outside your organization's domain")
    limitations.push("May struggle with common questions unrelated to your specific field")
  }

  // Filtering-based limitations
  if (choices.contentFiltering === "strict") {
    limitations.push("May refuse to discuss important but sensitive topics")
    limitations.push("Could be overly cautious, limiting utility")
  } else if (choices.contentFiltering === "minimal") {
    limitations.push("Higher risk of generating inappropriate or offensive content")
    limitations.push("May require more oversight and moderation")
  }

  // Behavior-based limitations
  if (choices.behavior === "directive") {
    limitations.push("Risk of users developing over-reliance on AI recommendations")
    limitations.push("May discourage critical thinking and independent analysis")
    limitations.push("Could appear arrogant or dismissive in some contexts")
  } else if (choices.behavior === "empathetic") {
    limitations.push("Risk of emotional manipulation or unhealthy dependency")
    limitations.push("May avoid delivering important but uncomfortable truths")
    limitations.push("Could blur boundaries between AI and human relationships")
  } else if (choices.behavior === "transparent") {
    limitations.push("May reduce user confidence in otherwise accurate information")
    limitations.push("Could appear overly cautious or non-committal")
    limitations.push("Less engaging for users seeking definitive guidance")
  }

  // Adaptation-based limitations
  if (choices.adaptToUser) {
    limitations.push("Raises privacy concerns about data collection and storage")
    limitations.push("Risk of creating filter bubbles that reinforce existing beliefs")
  } else {
    limitations.push("Less personalized experience for returning users")
  }

  // Bias-based limitations
  if (choices.biasHandling === "minimize") {
    limitations.push("May provide overly cautious or non-committal answers")
    limitations.push("Could avoid taking clear positions even when appropriate")
  } else if (choices.biasHandling === "values") {
    limitations.push("May not represent all viewpoints equally")
    limitations.push("Could alienate users with different value systems")
  }

  return limitations
}

function getEthicalRisks(choices: ChatbotChoices): { title: string; description: string }[] {
  const risks: { title: string; description: string }[] = []

  // Common risks for all chatbots
  risks.push({
    title: "Misinformation",
    description:
      "All AI systems can generate incorrect information or 'hallucinate' facts. This risk is higher with public data sources and lower with curated content.",
  })

  // Data-specific risks
  if (Array.isArray(choices.trainingData) && choices.trainingData.includes("public")) {
    risks.push({
      title: "Bias Amplification",
      description:
        "Public internet data contains societal biases that your chatbot may learn and amplify, potentially reinforcing stereotypes or discrimination.",
    })
  }
  if (Array.isArray(choices.trainingData) && choices.trainingData.includes("proprietary")) {
    risks.push({
      title: "Data Privacy",
      description:
        "Using internal data raises concerns about employee and customer privacy, requiring careful data governance and anonymization.",
    })
  }

  // Filtering-specific risks
  if (choices.contentFiltering === "minimal") {
    risks.push({
      title: "Harmful Content Generation",
      description:
        "With minimal filtering, your chatbot may generate content that could be offensive, misleading, or potentially harmful to vulnerable users.",
    })
  } else if (choices.contentFiltering === "strict") {
    risks.push({
      title: "Censorship Concerns",
      description:
        "Overly strict filtering may prevent discussion of important topics like health, politics, or social issues, raising concerns about censorship.",
    })
  }

  // Behavior-specific risks
  if (choices.behavior === "directive") {
    risks.push({
      title: "Authority and Trust Dynamics",
      description:
        "Authoritative AI can create unhealthy power dynamics where users stop thinking critically and defer entirely to AI judgment, particularly dangerous in high-stakes decisions.",
    })
  } else if (choices.behavior === "empathetic") {
    risks.push({
      title: "Emotional Manipulation",
      description:
        "Empathetic AI can manipulate users' emotions, even unintentionally, creating unhealthy dependencies particularly concerning for vulnerable populations.",
    })
  } else if (choices.behavior === "transparent") {
    risks.push({
      title: "Transparency Fatigue",
      description:
        "Users may become desensitized to repeated warnings about AI limitations, defeating the purpose of transparency.",
    })
  }

  // Adaptation-specific risks
  if (choices.adaptToUser) {
    risks.push({
      title: "Filter Bubbles",
      description:
        "Adapting to users can create echo chambers that reinforce existing beliefs and limit exposure to diverse perspectives.",
    })
    risks.push({
      title: "Privacy Concerns",
      description:
        "Personalization requires collecting and storing user data, raising privacy concerns and potential regulatory compliance issues.",
    })
  }

  // Bias-specific risks
  if (choices.biasHandling === "values") {
    risks.push({
      title: "Value Imposition",
      description:
        "Aligning with specific values may impose particular worldviews on users who don't share those perspectives, raising ethical questions about AI influence.",
    })
  }

  // Budget-specific risks
  if (choices.budget === "low") {
    risks.push({
      title: "Limited Safety Measures",
      description:
        "A limited budget may constrain your ability to implement robust safety measures, increasing various risks.",
    })
  }

  return risks
}

function getMitigationStrategies(choices: ChatbotChoices): string[] {
  const strategies: string[] = []

  // Common strategies for all chatbots
  strategies.push("Implement clear disclaimers about the chatbot's limitations and potential errors")
  strategies.push("Establish a feedback mechanism for users to report problematic responses")

  // Data-specific strategies
  if (Array.isArray(choices.trainingData) && choices.trainingData.includes("public")) {
    strategies.push("Use bias detection tools to identify and mitigate biases in training data")
    strategies.push("Supplement public data with curated sources for sensitive topics")
  }
  if (Array.isArray(choices.trainingData) && choices.trainingData.includes("proprietary")) {
    strategies.push("Implement robust data governance and anonymization procedures")
    strategies.push("Conduct regular privacy impact assessments")
  }

  // Filtering-specific strategies
  if (choices.contentFiltering === "minimal") {
    strategies.push("Implement user controls to adjust content filtering levels")
    strategies.push("Establish clear usage guidelines and terms of service")
  }

  // Behavior-specific strategies
  if (choices.behavior === "directive") {
    strategies.push("Include uncertainty indicators in responses when appropriate")
    strategies.push("Encourage users to verify important information from multiple sources")
  } else if (choices.behavior === "empathetic") {
    strategies.push("Set clear boundaries about the AI's role and limitations")
    strategies.push("Include reminders that the AI is not a replacement for human relationships")
  } else if (choices.behavior === "transparent") {
    strategies.push("Balance transparency with utility to avoid undermining useful guidance")
    strategies.push("Develop clear language for acknowledging limitations without excessive hedging")
  }

  // Adaptation-specific strategies
  if (choices.adaptToUser) {
    strategies.push("Provide transparency about what data is collected and how it's used")
    strategies.push("Allow users to view and delete their data")
    strategies.push("Implement features to expose users to diverse perspectives")
  }

  // Bias-specific strategies
  if (choices.biasHandling === "values") {
    strategies.push("Clearly disclose the values and perspectives the chatbot is designed to promote")
    strategies.push("Consider providing alternative viewpoints when appropriate")
  } else if (choices.biasHandling === "transparent") {
    strategies.push("Develop clear language for acknowledging limitations without undermining user confidence")
  }

  // Budget-specific strategies
  if (choices.budget === "low") {
    strategies.push("Focus on a narrow use case where risks can be more effectively managed")
    strategies.push("Leverage open-source safety tools and best practices")
  }

  return strategies
}

function getRealWorldExamples(choices: ChatbotChoices): { name: string; description: string; similarities: string }[] {
  const examples: { name: string; description: string; similarities: string }[] = []

  // Examples based on budget and data
  if (choices.budget === "high" && Array.isArray(choices.trainingData) && choices.trainingData.includes("public")) {
    examples.push({
      name: "ChatGPT",
      description: "OpenAI's conversational AI trained on diverse internet data with various safety measures.",
      similarities: "Broad knowledge base, significant development resources, and extensive capabilities.",
    })
  } else if (
    choices.budget === "medium" &&
    Array.isArray(choices.trainingData) &&
    (choices.trainingData.includes("curated") || choices.trainingData.includes("proprietary"))
  ) {
    examples.push({
      name: "Industry-Specific Assistants",
      description:
        "Specialized chatbots like legal assistants (e.g., Harvey AI) or healthcare chatbots that focus on specific domains.",
      similarities: "Domain-specific knowledge, moderate customization, and professional focus.",
    })
  } else if (choices.budget === "low") {
    examples.push({
      name: "Small Business Chatbots",
      description: "Simple customer service chatbots that handle basic inquiries using pre-built platforms.",
      similarities: "Limited scope, reliance on existing platforms, and focused use cases.",
    })
  }

  // Examples based on behavior and filtering
  if (choices.behavior === "directive" && choices.contentFiltering === "strict") {
    examples.push({
      name: "IBM Watson Health",
      description:
        "IBM's AI system designed to assist doctors with medical diagnoses and treatment recommendations, known for providing confident, authoritative responses.",
      similarities: "High confidence in responses, expert positioning, direct recommendations.",
    })
  } else if (choices.behavior === "empathetic" && choices.contentFiltering === "moderate") {
    examples.push({
      name: "Woebot",
      description:
        "A mental health chatbot designed to provide emotional support and therapy-based interventions using empathetic communication.",
      similarities: "Emotional engagement, supportive language, relationship-building focus.",
    })
  } else if (choices.behavior === "transparent" && choices.contentFiltering !== "strict") {
    examples.push({
      name: "Research Assistants",
      description: "Academic or research-focused AI tools that prioritize transparency about limitations and sources.",
      similarities: "Emphasis on accuracy, transparent about limitations, and educational approach.",
    })
  } else if (choices.behavior === "empathetic" && choices.contentFiltering !== "strict") {
    examples.push({
      name: "Creative Writing Assistants",
      description:
        "Tools like Character.AI or creative modes in general AI assistants that focus on storytelling and creative content.",
      similarities: "Emphasis on creativity, expressive language, and imaginative capabilities.",
    })
  }

  // Examples based on adaptation and bias handling
  if (choices.adaptToUser && choices.biasHandling === "values") {
    examples.push({
      name: "Specialized Coaching Apps",
      description:
        "Mental health apps like Woebot or fitness coaches that adapt to users while promoting specific health values.",
      similarities: "Personalization features, alignment with health/wellness values, and adaptive learning.",
    })
  } else if (choices.adaptToUser) {
    examples.push({
      name: "Microsoft's Xiaoice",
      description:
        "A social chatbot popular in China that adapts to individual users' personalities and communication styles over time.",
      similarities: "Personalization through behavioral learning, communication style adaptation, context memory.",
    })
  }

  // If we don't have enough examples yet, add a generic one
  if (examples.length < 2) {
    examples.push({
      name: "General Purpose Assistants",
      description:
        "Multi-purpose AI assistants like Siri, Google Assistant, or Alexa that handle a wide range of tasks.",
      similarities: "Broad functionality, consumer focus, and balance between various design considerations.",
    })
  }

  return examples
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
