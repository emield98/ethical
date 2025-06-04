"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BookOpen, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Source } from "@/components/source-citation"

type InsightCategory = "data" | "filtering" | "bias" | "business" | "technical"

interface Source {
  name: string
  url?: string
  description?: string
  date?: string
}

interface EthicalInsight {
  title: string
  description: string
  category: InsightCategory
  realWorldExample?: string
  learnMoreLink?: string
  sources?: Source[]
  applicableScenarios?: string[]
}


const commonInsights: EthicalInsight[] = [
  {
    title: "Representation Bias",
    description:
      "The reliance on data to train algorithms introduces an omnipresent challenge, as data itself can reflect biases inherent in societal structures (eg, racism, prejudice, and classism), historical patterns of biases that mediate the practice of medicine and delivery of health care.",
    category: "data",
    realWorldExample:
      "In 2016, Microsoft's Tay chatbot was trained on Twitter data and quickly began producing offensive content after being exposed to toxic user interactions.",
    learnMoreLink: "https://en.wikipedia.org/wiki/Tay_(bot)",
    sources: [
      {
        name: "AI and Representation Bias",
        url: "https://www.nature.com/articles/s41591-020-01177-6",
        description: "Research paper on how AI systems can perpetuate healthcare disparities through biased training data",
        date: "2020"
      }
    ],
    applicableScenarios: ["data-public", "data-curated", "data-proprietary"]
  }
]

const insights: Record<string, EthicalInsight[]> = {
  "data-public": [
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
      title: "Workers Concerns",
      description:
        "It is important to acknowledge and review the specific ethical issues that might arise when recruiting MTurk workers as participants. Things like participants’ economic vulnerability, participants’ sensitivity, and power dynamics between participants and researchers. ",
      category: "data",
      sources: [
        {
          name: "Ethical concerns arising from recruiting workers from Amazon's Mechanical Turk as research participants: Commentary on Burnette et al.",
          url: "https://onlinelibrary.wiley.com/doi/10.1002/eat.23658",
          description: "Ilka Helene Gleibs and Nihan Albayrak-Aydemir contributed equally to this work.",
          date: "2021"
        }
      ]
    },
    {
      title: "Domain Limitations",
      description:
        "Chatbots trained primarily on proprietary data may develop knowledge in areas that the workers are experts in, but may not have general knowledge in other areas.",
      category: "data",
    },
  ],
  "filtering-strict": [
    {
      title: "Censorship and Representation Concerns",
      description:
        "Combining AI with human moderation offers the most accurate and ethical filtering. However, it raises concerns about privacy, information access, the potential bias of human reviewers, and sometimes may even represent a skewed view of reality.",
      category: "filtering",
      realWorldExample:
        "Some AI systems have refused to discuss topics like human reproduction or certain historical events due to overly aggressive content filters.",
    },
  ],
  "filtering-moderate": [
    {
      title: "Contextual Understanding Challenges",
      description:
        "Moderate filtering aims to balance safety with open discussion, but AI struggles to understand context. This can lead to inconsistent moderation or the accidental blocking of valid conversations.",
      category: "filtering",
    },
  ],
  "filtering-minimal": [
    {
      title: "Harmful Content Risks",
      description:
        "Minimal filtering prioritizes free access to all information but risks exposing users to harmful, offensive, or misleading content. It shifts responsibility to users and may be unsafe in public or educational settings.",
      category: "filtering",
      realWorldExample:
        "Several AI chatbots have generated instructions for illegal activities or harmful/misleading content when filtering was insufficient.",
    },
  ],
  "behavior-directive": [
    {
      title: "Authority and Trust Dynamics",
      description:
"When AI communicates with excessive confidence, it may discourage users from questioning its responses, leading to blind trust. This 'oracle effect' is especially risky in situations involving important or sensitive decisions.",      category: "technical",
          },
    {
      title: "The Illusion of Certainty",
      description:
        "AI systems have inherent uncertainties, but directive communication styles can mask these limitations. Users may not realize when the AI is extrapolating beyond its training data or making educated guesses.",
      category: "technical",
      realWorldExample:
        "Financial AI advisors that provided confident investment advice without clearly communicating market uncertainties, leading to unrealistic user expectations.",
      learnMoreLink: "https://mindmatters.ai/2025/04/llms-still-cannot-be-trusted-for-financial-advice/"
    },
  ],
  "behavior-empathetic": [
    {
      title: "Emotional Manipulation Through Design",
      description:
        "When AI systems simulate empathy and emotional understanding, they can manipulate users' emotions even if unintentionally. This is particularly concerning with vulnerable populations like elderly users or people in emotional distress.",
      category: "technical",
      realWorldExample:
        "Mental health chatbots like Woebot have faced criticism for creating emotional dependencies in users who began treating the AI as a real friend or therapist.",
      learnMoreLink: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10944174/",
    },
    {
      title: "Truth vs Comfort Dilemma",
      description:
        "Empathetic AI may prioritize user comfort over factual accuracy, avoiding difficult truths that might upset users. This can prevent users from accessing important but uncomfortable information.",
      category: "technical",
      realWorldExample:
        "Health-focused chatbots that avoid discussing serious symptoms to prevent causing anxiety, potentially delaying necessary medical care.",
    },
  ],
  "behavior-transparent": [
    {
      title: "Undermining Utility Through Over-Transparency",
      description:
        "Constantly emphasizing limitations can make AI less useful and trustworthy, even when its information is accurate. Users may lose confidence in genuinely helpful guidance.",
      category: "technical",
      },
    {
      title: "Transparency Fatigue",
      description:
        "Users may become desensitized to repeated warnings about AI limitations, similar to how people ignore cookie consent notices. This can defeat the purpose of transparency.",
      category: "technical",
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
      title: "The Mirror Effect and Filter Bubbles",
      description:
        "When AI adapts to user communication styles, it may reinforce existing biases and create intellectual echo chambers. Users may receive increasingly narrow perspectives that match their existing beliefs.",
      category: "technical",
      realWorldExample:
        "Social media algorithms that adapt to user preferences have been linked to political polarization by showing users increasingly extreme content that matches their initial leanings.",
    },
    {
      title: "Privacy Through Behavioral Analysis",
      description:
        "Adaptive AI requires deep analysis of user behavior, communication patterns, and preferences. This creates detailed psychological profiles that raise significant privacy and data protection concerns.",
      category: "technical",
      realWorldExample:
        "Cambridge Analytica demonstrated how communication pattern analysis could reveal intimate details about users' personalities and political preferences.",
      learnMoreLink: "https://www.theatlantic.com/technology/archive/2018/03/the-cambridge-analytica-scandal-in-three-paragraphs/556046/",
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
  
  // Add specific insights for this step-choice combination
  if (insights[stepKey]) {
    relevantInsights = [...insights[stepKey]]
  }
  
  // Add common insights that apply to this scenario
  commonInsights.forEach(insight => {
    if (insight.applicableScenarios?.includes(stepKey)) {
      relevantInsights.push(insight)
    }
  })

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

              {insight.sources && insight.sources.length > 0 && (
                <div className="mt-2">
                  {insight.sources.map((source, idx) => (
                    <Source
                      key={idx}
                      name={source.name}
                      url={source.url}
                      description={source.description}
                      date={source.date}
                      compact
                    />
                  ))}
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