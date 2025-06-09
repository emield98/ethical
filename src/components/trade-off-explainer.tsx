"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Scale } from "lucide-react"

interface TradeOff {
  title: string
  description: string
  pros: string[]
  cons: string[]
}

const tradeOffs: Record<string, TradeOff> = {
  "data-public": {
    title: "Public Internet Data",
    description: "Using data scraped from the public internet, including websites, forums, and social media.",
    pros: [
      "Represents a lot of unfiltered viewpoints",
      "Broad coverage of topics and domains",
      "Includes contemporary language",
      "Relatively inexpensive to obtain",
      "Large amount of data"
    ],
    cons: [
      "Represents a lot of unfiltered viewpoints",
      "Contains biases present in internet content",
      "Quality varies dramatically across sources",
      "May include harmful, misleading, or offensive content",
      "Difficult to verify accuracy of all information",
      "May violate copyright (not that big tech cares)",
    ],
  },
  "data-curated": {
    title: "Curated Sources",
    description:
      "Using carefully selected, high-quality sources like academic journals, textbooks, and verified information.",
    pros: [
      "Higher quality and more reliable information",
      "Reduced risk of harmful or misleading content",
      "Better factual accuracy",
      "More consistent writing style and quality",
    ],
    cons: [
      "Limited coverage of emerging topics or niche subjects",
      "May lack colloquial language and cultural references",
      "More expensive and time-consuming to collect",
      "May overrepresent certain perspectives (e.g., academic viewpoints)",
    ],
  },
  "data-proprietary": {
    title: "Proprietary Data",
    description:
      "Using websites like Outlier AI or Amazon Mechanical Turk to pay people to answer questions, write prompts, and other forms of human verified data.",
    pros: [
      "Highest quality data",
      "Tons of control over the data",
      "Data sourced from here will obviously be free of hate speech or other offensive content",
    ],
    cons: [
      "Super expensive and time-consuming to collect",
      "May overrepresent certain perspectives (e.g., academic viewpoints)",
      "Can result in unnoticed issues in the data, like the workers being biased towards certain topics",
    ],
  },
  "filtering-strict": {
    title: "Strict Content Filtering",
    description: "Blocking all potentially offensive, harmful, or controversial content.",
    pros: [
      "Good for public-facing or vulnerable audiences",
      "Minimizes legal and reputational risks",
      "Clearer boundaries for users",
      "Reduces potential for harm or offense",
    ],
    cons: [
      "May block important educational content on sensitive topics",
      "Can appear overly cautious or censorious",
      "Limits utility for legitimate research or discussion",
      "May reflect particular cultural or political values",
    ],
  },
  "filtering-moderate": {
    title: "Moderate Content Filtering",
    description: "Allowing discussion of sensitive topics in educational contexts while blocking harmful content.",
    pros: [
      "Balances safety with educational value",
      "Useful for research and learning",
      "Can discuss important, but sensitive topics with appropriate context",
      "More flexible than strict filtering",
    ],
    cons: [
      "Relies on AI's imperfect ability to read context",
      "May still let subtle bias or some harmful content through",
      "Users may perceive filtering as either too strict or too loose",
      "May unintentionally block valid content in sensitive discussions",
      "Difficult to implement effectively",
    ],
  },
  "filtering-minimal": {
    title: "Minimal Content Filtering",
    description: "Only filtering illegal content, maximizing information access.",
    pros: [
      "Maximum information access and utility",
      "Fewer restrictions on legitimate research",
      "Less risk of censoring important topics and perspectives",
      "Allows for open discussion of controversial issues",
      "More transparent about potential risks",
      "Low cost and fast performance",
    ],
    cons: [
      "Higher risk of harmful or offensive outputs",
      "Access to all information, including hate speech and misinformation",
      "Not suitable for all audiences",
      "Greater legal and reputational risks",
      "Requires more user discretion and responsibility",
    ],
  },
  "behavior-directive": {
    title: "Authoritative AI Communication",
    description: "Designing AI to speak with confidence and authority about information and recommendations.",
    pros: [
      "Users feel confident in the information they receive",
      "Enables faster decision-making in time-sensitive situations",
      "Provides clear guidance when users are overwhelmed by options",
      "Reduces user anxiety about AI reliability",
      "More efficient communication without excessive hedging",
    ],
    cons: [
      "Risk of users developing blind trust in AI recommendations",
      "May appear arrogant or dismissive of user intelligence",
      "Can discourage users from developing critical thinking skills",
      "Difficult to communicate genuine uncertainty appropriately",
      "May overstate confidence in ambiguous or evolving situations",
    ],
  },
  "behavior-empathetic": {
    title: "Emotionally Responsive AI Design",
    description: "Creating AI that uses emotional language, shows concern for users, and prioritizes emotional comfort in interactions.",
    pros: [
      "Creates more pleasant and engaging user experiences",
      "Users feel understood and emotionally supported",
      "Higher user satisfaction and continued engagement",
      "More effective at motivating behavior change",
      "Reduces user stress and anxiety during interactions",
    ],
    cons: [
      "Risk of emotional manipulation, even if unintentional",
      "May avoid delivering important but uncomfortable truths",
      "Can blur boundaries between AI and human relationships",
      "Creates potential for unhealthy emotional dependency",
      "May prioritize feelings over factual accuracy",
    ],
  },
  "behavior-transparent": {
    title: "AI Transparency and Limitation Disclosure",
    description: "Designing AI to frequently acknowledge its artificial nature, limitations, and the need for user critical thinking.",
    pros: [
      "Users maintain awareness of AI limitations and capabilities",
      "Promotes healthy skepticism and critical thinking",
      "Reduces risk of over-dependence on AI systems",
      "Builds trust through honesty about capabilities",
      "Encourages users to seek multiple sources of information",
    ],
    cons: [
      "May reduce user confidence in otherwise accurate information",
      "Can create unnecessarily cautious or hedged responses",
      "Less engaging and natural-feeling interactions",
      "May undermine AI's utility by excessive self-deprecation",
      "Can frustrate users seeking definitive guidance",
    ],
  },
  "behavior-adaptive": {
    title: "Personalized AI Behavior Adaptation",
    description: "Enabling AI to learn from user interactions and adapt its communication style, preferences, and responses over time.",
    pros: [
      "Highly personalized experience tailored to individual users",
      "More natural and fluid communication over time",
      "Higher user satisfaction through customized interactions",
      "Can accommodate different learning styles and preferences",
      "Improves efficiency by learning user's preferred interaction patterns",
    ],
    cons: [
      "Requires extensive collection and analysis of personal behavioral data",
      "Risk of creating filter bubbles that reinforce existing beliefs",
      "Potential for subtle manipulation through behavioral mirroring",
      "Privacy concerns about psychological profiling",
      "May reduce exposure to diverse perspectives and challenging ideas",
    ],
  },
  "bias-minimize": {
    title: "Minimize All Biases",
    description: "Debiasing at every step of the models training using methods such as GN-Glove and Hard-Debiased.",
    pros: [
      "Aims for fairness across different groups and viewpoints",
      "Reduces risk of perpetuating harmful stereotypes",
      "Addresses bias at multiple levels of the pipeline: from data to representation to output.",
      "Potential for a more robust and ethically-aligned model.",
    ],
    cons: [
      "Risk of overcorrecting",
      "Perfect debiasing is impossible to achieve",
      "May reduce performance due to debiasing constraints.",
      "Technically complex and expensive",
    ],
  },
  "bias-values": {
    title: "Debiasing the dataset",
    description: "Attempting to remove harmful biases in the data before training.",
    pros: [
      "Relatively easy to implement compared to architectural debiasing.",
      "Can reduce exposure to extremely biased content.",
      "Using a 'cleaner' dataset avoids learning from problematic sources",
    ],
    cons: [
      "Will still be biased since bias cannot be removed by cleaning the dataset",
      "Cleaning the dataset might remove valuable information",
      "Risk of false sense of security since not all bias is removed",
    ],
  },
  "bias-transparent": {
    title: "Acknowledge Biases Transparently",
    description: "No debiasing, instead openly disclose potential biases and limitations when providing information.",
    pros: [
      "Preserves the models full expressiveness and access to all original patterns in the data.",
      "Encourages critical thinking about AI-generated content",
      "Reduces risk of users placing excessive trust in AI",
    ],
    cons: [
      "May undermine confidence in otherwise accurate information",
      "High risk of amplifying existing stereotypes",
      "May confuse users who expect definitive answers",
    ],
  },
}

interface TradeOffExplainerProps {
  category: string
  choice: string
}

export function TradeOffExplainer({ category, choice }: TradeOffExplainerProps) {
  const [expanded, setExpanded] = useState(false)
  const tradeOffKey = `${category}-${choice}`
  const tradeOff = tradeOffs[tradeOffKey]

  if (!tradeOff) {
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Scale className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          Understanding Trade-offs
        </CardTitle>
        <CardDescription>
          Every choice in AI development involves trade-offs. Here's what you should consider about your selection:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{tradeOff.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tradeOff.description}</p>
          </div>

          <div className={`${!expanded && (tradeOff.pros.length > 2 || tradeOff.cons.length > 2) ? "max-h-64 overflow-hidden relative" : ""}`}>
            <Tabs defaultValue="pros" className="biased-tabs">
              <TabsList className="grid w-full grid-cols-2 biased-tabs-list">
                <TabsTrigger value="pros" className="biased-tab">
                  Advantages
                </TabsTrigger>
                <TabsTrigger value="cons" className="biased-tab">
                  Limitations
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pros" className="pt-4">
                <ul className="space-y-2 uneven-spacing">
                  {tradeOff.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold">+</span>
                      <span className="text-sm">{pro}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="cons" className="pt-4">
                <ul className="space-y-2 uneven-spacing">
                  {tradeOff.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400 font-bold">−</span>
                      <span className="text-sm">{con}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>

            <div className="pt-4 text-sm text-slate-600 dark:text-slate-400">
              <p>
                <strong>Key insight:</strong> In AI development, there are rarely perfect choices, only different sets of
                trade-offs. Understanding these trade-offs is essential for making informed decisions that align with your
                goals and values.
              </p>
            </div>
            
            {!expanded && (tradeOff.pros.length > 2 || tradeOff.cons.length > 2) && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
            )}
          </div>
          
          {(tradeOff.pros.length > 2 || tradeOff.cons.length > 2) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              {expanded ? "Show less" : "Show more"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}