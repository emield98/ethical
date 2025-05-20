"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, RefreshCw, Share2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CostCalculator } from "./cost-calculator"
import { calculateCosts, formatCost, getCostFactors } from "./cost-calculator"
import { DecisionImpactVisualizer } from "./decision-impact-visualizer"

type ChatbotChoices = {
  budget: string
  trainingData: string
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
    <Card className="biased-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="biased-title">Your Chatbot Design Summary</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="biased-badge">
              {getBudgetLabel(choices.budget)}
            </Badge>
            <Badge variant="outline" className="biased-badge">
              {getDataLabel(choices.trainingData)}
            </Badge>
          </div>
        </div>
        <CardDescription>
          Based on your choices, here's what your chatbot would look like and the implications of your decisions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="biased-tabs">
          <TabsList className="grid w-full grid-cols-4 biased-tabs-list">
            <TabsTrigger value="characteristics" className="biased-tab">
              Characteristics
            </TabsTrigger>
            <TabsTrigger value="costs" className="biased-tab">
              Costs
            </TabsTrigger>
            <TabsTrigger value="risks" className="biased-tab">
              Ethical Risks
            </TabsTrigger>
            <TabsTrigger value="examples" className="biased-tab">
              Real-World Examples
            </TabsTrigger>
          </TabsList>

          <TabsContent value="characteristics" className="pt-4 space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium biased-title">Chatbot Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 asymmetrical-grid">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Resources</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{getBudgetDescription(choices.budget)}</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Knowledge Base</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getDataDescription(choices.trainingData)}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Content Boundaries</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getFilteringDescription(choices.contentFiltering)}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Personality</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getBehaviorDescription(choices.behavior)}
                    {choices.adaptToUser && " Adapts to user preferences and behavior over time."}
                  </p>
                </div>

                <div className="p-4 border rounded-lg md:col-span-2">
                  <h4 className="font-medium mb-2">Bias Approach</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getBiasDescription(choices.biasHandling)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 uneven-spacing">
              <h3 className="text-lg font-medium biased-title">Strengths</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {getStrengths(choices).map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 uneven-spacing">
              <h3 className="text-lg font-medium biased-title">Limitations</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {getLimitations(choices).map((limitation, index) => (
                  <li key={index}>{limitation}</li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <DecisionImpactVisualizer choices={choices} />
            </div>
          </TabsContent>

          <TabsContent value="costs" className="pt-4">
            <CostCalculator choices={choices} />
          </TabsContent>

          <TabsContent value="risks" className="pt-4 space-y-4">
            <Alert className="mb-4 ethical-card">
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                All AI chatbots come with ethical considerations. Understanding these risks is crucial for responsible
                deployment.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 uneven-spacing">
              {getEthicalRisks(choices).map((risk, index) => (
                <div key={index} className="p-4 border rounded-lg biased-card">
                  <h4 className="font-medium mb-2 biased-title">{risk.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{risk.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium biased-title">Mitigation Strategies</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 uneven-spacing">
                {getMitigationStrategies(choices).map((strategy, index) => (
                  <li key={index}>{strategy}</li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="pt-4 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Based on your choices, your chatbot would be similar to these real-world examples:
            </p>

            {getRealWorldExamples(choices).map((example, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2 biased-card">
                <h4 className="font-medium biased-title">{example.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{example.description}</p>
                <div className="text-sm">
                  <span className="font-medium">Similar characteristics: </span>
                  <span className="text-slate-600 dark:text-slate-400">{example.similarities}</span>
                </div>
              </div>
            ))}

            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
              <h4 className="font-medium mb-2 biased-title">Learning More</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                These examples are simplified. Real AI systems are complex products with extensive development, testing,
                and ongoing maintenance. To learn more about AI ethics and chatbot development, explore resources from
                organizations like the Partnership on AI, AI Ethics Lab, or academic institutions specializing in AI
                research.
              </p>
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
          <Button onClick={handleDownload} className="flex items-center gap-2 biased-button">
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
    case "formal":
      return "Your chatbot will maintain a professional, precise, and authoritative tone. It will prioritize accuracy and clarity over conversational engagement."
    case "friendly":
      return "Your chatbot will be warm, approachable, and conversational. It will use casual language and focus on building rapport with users."
    case "creative":
      return "Your chatbot will be imaginative, witty, and expressive. It will use colorful language and may incorporate humor and storytelling into its responses."
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
  if (choices.trainingData === "public") {
    strengths.push("Broad knowledge across many domains and topics")
    strengths.push("Familiarity with contemporary language and cultural references")
  } else if (choices.trainingData === "curated") {
    strengths.push("High-quality, reliable information from verified sources")
    strengths.push("Reduced risk of spreading misinformation")
  } else if (choices.trainingData === "proprietary") {
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
  if (choices.behavior === "formal") {
    strengths.push("Professional appearance suitable for business contexts")
    strengths.push("Clear, precise communication style")
  } else if (choices.behavior === "friendly") {
    strengths.push("Approachable personality that builds user rapport")
    strengths.push("Conversational style that feels natural to users")
  } else if (choices.behavior === "creative") {
    strengths.push("Engaging, memorable interactions")
    strengths.push("Ability to generate creative content and ideas")
  }

  // Adaptation-based strengths
  if (choices.adaptToUser) {
    strengths.push("Personalized experience that improves over time")
    strengths.push("Ability to remember user preferences and history")
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
  if (choices.trainingData === "public") {
    limitations.push("May contain biases, misinformation, or low-quality content")
    limitations.push("Less reliable for specialized or technical information")
  } else if (choices.trainingData === "curated") {
    limitations.push("May have gaps in coverage of emerging topics or niche subjects")
    limitations.push("Potentially limited understanding of colloquial language or cultural nuances")
  } else if (choices.trainingData === "proprietary") {
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
  if (choices.behavior === "formal") {
    limitations.push("May appear stiff or impersonal to some users")
    limitations.push("Less engaging for casual conversation")
  } else if (choices.behavior === "creative") {
    limitations.push("May prioritize engagement over accuracy in some cases")
    limitations.push("Style might not be appropriate for all professional contexts")
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
  if (choices.trainingData === "public") {
    risks.push({
      title: "Bias Amplification",
      description:
        "Public internet data contains societal biases that your chatbot may learn and amplify, potentially reinforcing stereotypes or discrimination.",
    })
  } else if (choices.trainingData === "proprietary") {
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
  if (choices.trainingData === "public") {
    strategies.push("Use bias detection tools to identify and mitigate biases in training data")
    strategies.push("Supplement public data with curated sources for sensitive topics")
  } else if (choices.trainingData === "proprietary") {
    strategies.push("Implement robust data governance and anonymization procedures")
    strategies.push("Conduct regular privacy impact assessments")
  }

  // Filtering-specific strategies
  if (choices.contentFiltering === "minimal") {
    strategies.push("Implement user controls to adjust content filtering levels")
    strategies.push("Establish clear usage guidelines and terms of service")
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
  if (choices.budget === "high" && choices.trainingData === "public") {
    examples.push({
      name: "ChatGPT",
      description: "OpenAI's conversational AI trained on diverse internet data with various safety measures.",
      similarities: "Broad knowledge base, significant development resources, and extensive capabilities.",
    })
  } else if (
    choices.budget === "medium" &&
    (choices.trainingData === "curated" || choices.trainingData === "proprietary")
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
  if (choices.behavior === "formal" && choices.contentFiltering === "strict") {
    examples.push({
      name: "Educational Assistants",
      description:
        "AI tutors and educational tools like Khan Academy's Khanmigo that maintain professional tone and strict content standards.",
      similarities: "Professional demeanor, educational focus, and strong safety measures.",
    })
  } else if (choices.behavior === "friendly" && choices.contentFiltering === "moderate") {
    examples.push({
      name: "Customer Service Chatbots",
      description:
        "Conversational assistants like those used by major retailers that balance helpfulness with appropriate boundaries.",
      similarities: "Conversational tone, customer-focused approach, and balanced content policies.",
    })
  } else if (choices.behavior === "creative" && choices.contentFiltering !== "strict") {
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
  } else if (!choices.adaptToUser && choices.biasHandling === "transparent") {
    examples.push({
      name: "Research Assistants",
      description: "Academic or research-focused AI tools that prioritize transparency about limitations and sources.",
      similarities: "Emphasis on accuracy, transparent about limitations, and educational approach.",
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
  let summary = "CHATBOT DESIGN SUMMARY\n\n"

  summary += "CONFIGURATION CHOICES:\n"
  summary += `- Budget: ${getBudgetLabel(choices.budget)}\n`
  summary += `- Training Data: ${getDataLabel(choices.trainingData)}\n`
  summary += `- Content Filtering: ${choices.contentFiltering}\n`
  summary += `- Behavior: ${choices.behavior}\n`
  summary += `- Adapts to User: ${choices.adaptToUser ? "Yes" : "No"}\n`
  summary += `- Bias Handling: ${choices.biasHandling}\n\n`

  summary += "CHARACTERISTICS:\n"
  summary += `${getBudgetDescription(choices.budget)}\n\n`
  summary += `${getDataDescription(choices.trainingData)}\n\n`
  summary += `${getFilteringDescription(choices.contentFiltering)}\n\n`
  summary += `${getBehaviorDescription(choices.behavior)}\n`
  if (choices.adaptToUser) {
    summary += "Adapts to user preferences and behavior over time.\n\n"
  } else {
    summary += "\n"
  }
  summary += `${getBiasDescription(choices.biasHandling)}\n\n`

  const costs = calculateCosts(choices)
  const totalCost = costs.development + costs.training + costs.infrastructure + costs.maintenance + costs.moderation

  summary += "ESTIMATED COSTS:\n"
  summary += `- Total First-Year Cost: $${formatCost(totalCost)}\n`
  summary += `- Development: $${formatCost(costs.development)}\n`
  summary += `- Training: $${formatCost(costs.training)}\n`
  summary += `- Infrastructure: $${formatCost(costs.infrastructure)}\n`
  summary += `- Maintenance: $${formatCost(costs.maintenance)}\n`
  summary += `- Content Moderation: $${formatCost(costs.moderation)}\n\n`

  summary += "COST FACTORS:\n"
  getCostFactors(choices).forEach((factor) => {
    summary += `- ${factor}\n`
  })
  summary += "\n"

  summary += "STRENGTHS:\n"
  getStrengths(choices).forEach((strength) => {
    summary += `- ${strength}\n`
  })
  summary += "\n"

  summary += "LIMITATIONS:\n"
  getLimitations(choices).forEach((limitation) => {
    summary += `- ${limitation}\n`
  })
  summary += "\n"

  summary += "ETHICAL RISKS:\n"
  getEthicalRisks(choices).forEach((risk) => {
    summary += `- ${risk.title}: ${risk.description}\n`
  })
  summary += "\n"

  summary += "MITIGATION STRATEGIES:\n"
  getMitigationStrategies(choices).forEach((strategy) => {
    summary += `- ${strategy}\n`
  })
  summary += "\n"

  summary += "SIMILAR REAL-WORLD EXAMPLES:\n"
  getRealWorldExamples(choices).forEach((example) => {
    summary += `- ${example.name}: ${example.description}\n  Similarities: ${example.similarities}\n`
  })
  summary += "\n"

  summary +=
    "NOTE: This is a simplified educational simulation. Real AI development involves more complex considerations, extensive testing, and ongoing maintenance.\n"

  return summary
}
