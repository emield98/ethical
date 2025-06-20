"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BookOpen, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Source } from "@/components/source-citation"

type InsightCategory = "budget" | "data" | "filtering" | "bias" | "business" | "technical"

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
"budget-small": [
  {
    title: "Ethics on a Shoestring",
    description:
      "Small budgets often exclude structured ethical audits, safety testing, or long-term risk assessment. Developers may rely on free or low-quality tools and datasets, unintentionally embedding harmful patterns into the system. Ethical blind spots often go unnoticed due to time and resource pressure.",
    category: "budget",
    realWorldExample:
      "In 2023, a small startup released an AI mental health chatbot (Tessa) that offered inappropriate advice due to a lack of professional oversight and dataset review, leading to widespread backlash and its eventual takedown.",
    learnMoreLink: "https://www.cbsnews.com/news/eating-disorder-helpline-chatbot-disabled/",
    }
],
"budget-medium": [
  {
    title: "Partial Oversight, Partial Blindness",
    description:
      "Medium budgets often enable ethical intentions without full execution. While teams can afford audits or fairness testing in some areas, they might skip others (e.g., long-term monitoring or multilingual bias detection). Tradeoffs must be made between performance, safety, and equity.",
    category: "budget",
  }
],

"budget-large": [
  {
    title: "Power at a Price: Ethical Responsibility at Scale",
    description:
      "Large budgets support cutting-edge models, but with immense energy consumption, massive compute usage (e.g., GPU clusters), and greater societal influence. Ethical responsibility scales with power: deploying high-impact AI requires global fairness, sustainability, and accountability frameworks.",
    category: "budget",
    realWorldExample:
      "Training GPT-3 required hundreds of petaflop/s-days of compute, consuming energy equivalent to multiple U.S. households over a year. Large tech firms have since faced pressure to account for the environmental and social externalities of scaling AI systems.",
    learnMoreLink: "https://higes.substack.com/p/the-energy-cost-of-teaching-machines-diving-deep-into-energy-and-llms-d01f7e1acb12?utm_source=chatgpt.com",
    }
],

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
        "It is important to acknowledge and review the specific ethical issues that might arise when recruiting MTurk workers as participants. Things like participants' economic vulnerability, participants' sensitivity, and power dynamics between participants and researchers. ",
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
      title: "Balancing Safety and Freedom",
      description:
        "Strict filtering does the best job of preventing harmful content. On the other hand, it can also limit the chatbot's ability to engage in open discussions. Consider what you find most important in your chatbot.",
      category: "filtering",
      realWorldExample:
        "In 2024, Google's Gemini was criticized for generating overly potically correct image generations of people and historical figures. While creating a more inclusive AI, it also led to backlash for being overly sanitized and not representing historical accuracy.",
      learnMoreLink: "https://www.cnn.com/2024/02/22/tech/google-gemini-ai-image-generator",
    },
    {
      title: "Censorship Concerns",
      description:
        "Strict filtering can lead to censorship, where important or controversial information is hidden from users. This can limit access to diverse viewpoints, reduce critical discussion, and create a distorted perception of reality,where only sanitized or approved content is shown.",
      category: "filtering",
      realWorldExample:
        "In 2025, researchers found that DeepSeek AI refused to answer 85% of questions about sensitive political topics in China, often giving nationalistic responses.",
      learnMoreLink: "https://techcrunch.com/2025/01/29/deepseeks-ai-avoids-answering-85-of-prompts-on-sensitive-topics-related-to-china/",
    }
  ],
  "filtering-moderate": [
    {
      title: "Balancing Safety and Freedom",
      description:
        "Moderate filtering aims to balance safety with open discussion, but it can still lead to the exclusion of some important information. Consider whether this middle is the right approach, or if you prefer a stricter or more minimal filtering approach.",
      category: "filtering",
    },
    {
      title: "Contextual Understanding Challenges",
      description:
        "Moderate filtering aims to balance safety with open discussion, but AI struggles to understand context. This can lead to inconsistent moderation or the accidental blocking of valid conversations.",
      category: "filtering",
    },
  ],
  "filtering-minimal": [
    {
      title: "Balancing Safety and Freedom",
      description:
        "Minimal filtering allows for more open discussions and diverse viewpoints, but also risks exposing users to harmful or inappropriate content, even when unintended. Consider the trade-offs between safety and freedom of information access and expression.",
      category: "filtering",
      realWorldExample:
        "In 2023, the National Eating Disorders Association (NEDA) faced backlash after their AI chatbot provided harmful advice to their users with eating disorders about dieting and weight loss.",
      learnMoreLink: "https://www.cbsnews.com/news/eating-disorder-helpline-chatbot-disabled/",
    },
    {
      title: "Malicious Use Risks",
      description:
        "The minimal filtering approach can lead to the AI being used for harmful purposes, such as generating hate speech, misinformation, or even illegal content. This puts more responsibilities in the hands of the user and can have serious consequences for both users and the platform hosting the AI.",
      category: "filtering",
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
        "The case of lipstick on a pig. These methods can only cover up the biases involved in de model but will not remove systematic gender biases in word embeddings. There is a risk of inaccurate outcomes due to overdebiasing.",
      category: "bias",
      realWorldExample:
        "The Gemini software made by google produced historically inaccurate output as a result of overly debiasing. https://www.theguardian.com/technology/2024/feb/28/google-chief-ai-tools-photo-diversity-offended-users",
      learnMoreLink: "https://www.youtube.com/watch?v=V08bH95W9eM",
    },
    {
      title: "Cultural flattening from overdebiasing",
      description:
        "When models are aggressively debiased at every stage they can lose meaningful cultural variation. The result is a flattened, homogenized output, defaulting to dominant (often Western) norms and erasing diverse cultural voices.",
      category: "bias",
      realWorldExample:
        "An ACL paper studying multilingual and Arabic monolingual LMs found that despite efforts for neutrality, these models systematically favored Western cultural entities. This shows how overdebiasing can erase non-Western cultural contexts in generation and understanding.",
      learnMoreLink: "https://aclanthology.org/2024.acl-long.862/"
    }
  ],
  "bias-values": [
    {
      title: "Debiasing Dataset is not enough",
      description:
        "Just cleaning the dataset doesn’t mean the model is actually fair.  Often people think the model is neutral because the data had been filtered, but the bias  still there. This shows that only focusing on the data can create a false sense of safety and stop people from looking deeper.",
      category: "bias",
      realWorldExample:
        "OpenAI used cleaned datasets for GPT-3 with the hope that this would lead to a model with less bias. The result was a model which was perceived to have no bias, but was in fact still biased. This created a false sense of security.",
      learnMoreLink: "https://aclanthology.org/2021.nuse-1.5/#:~:text=Our%20study%20raises%20questions%20on%20how%20one%20can,Third%20Workshop%20on%20Narrative%20Understanding%2C%20pages%2048%E2%80%9355%2C%20Virtual.", 
    },
    {
      title: "False confidence from dataset-only debiasing",
      description:
        "Only debiasing the dataset during fine-tuning can lead to the mistaken belief that a model is fair, even though the original pre-trained model still contains deeply embedded biases. These can resurface during use, especially in subtle or complex contexts, undermining the effectiveness of the intervention.",
      category: "bias",
      realWorldExample:
        "Researchers fine-tuned BERT on gender-balanced datasets to reduce bias. However, the model still associated occupations like 'programmer' more with 'man' than 'woman', showing that without addressing the underlying representations, dataset-level fixes are not enough.",
      learnMoreLink: "https://arxiv.org/abs/2010.14534"
    }
  ],
  "bias-transparent": [
    {
      title: "Reinforcing stereotypes",
      description:
        "Models with large biases often lead to public outrage, despite previous warnings that the model might be biased. This leads to the insight that it might not be enough to just commit to disclosing the biases, they should actively be adressed.",
      category: "bias",
      realWorldExample: "Meta released Galactica without debiasing but with warnings about potential bias, yet the model quickly lost public trust after generating misleading and biased scientific content, leading to its removal just three days later.",
      learnMoreLink: "https://www.technologyreview.com/2022/11/18/1063487/meta-large-language-model-ai-only-survived-three-days-gpt-3-science/"
    },
    {
      title: "Overtrust in flawed outputs",
      description:
      "Even when a model’s limitations are disclosed, users may still overtrust its outputs, especially in informal or emotionally engaging settings. If no debiasing is done, the model may reproduce offensive or harmful content that damages public trust and leads to ethical failures.",
      category: "bias",
      realWorldExample: "Microsoft released Tay, an AI chatbot, without proper debiasing and with minimal oversight. Despite being labeled experimental, the bot rapidly began producing racist and offensive tweets based on user interactions, resulting in its shutdown within 24 hours.",
      learnMoreLink: "https://www.theverge.com/2016/3/24/11297050/tay-microsoft-chatbot-racist"
    }
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

  // Split the currentChoice by comma to handle multiple values
  const choices = currentChoice.split(",").filter(Boolean)
  
  // Add specific insights for each choice
  choices.forEach(choice => {
    const stepKey = `${currentStep}-${choice.trim()}`
    if (insights[stepKey]) {
      relevantInsights = [...relevantInsights, ...insights[stepKey]]
    }
  })
  
  // Add common insights that apply to this scenario
  commonInsights.forEach(insight => {
    if (insight.applicableScenarios?.some(scenario => 
      choices.some(choice => scenario === `${currentStep}-${choice.trim()}`)
    )) {
      relevantInsights.push(insight)
    }
  })

  // Add adaptation insights if relevant
  if (adaptToUser && currentStep === "behavior" && insights["adaptToUser-true"]) {
    relevantInsights = [...relevantInsights, ...insights["adaptToUser-true"]]
  }

  // Remove duplicate insights based on title
  relevantInsights = relevantInsights.filter((insight, index, self) =>
    index === self.findIndex((i) => i.title === insight.title)
  )

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
// At bottom of ethical-insights.tsx
export { insights, commonInsights }
