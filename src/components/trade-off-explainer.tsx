"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      "Broad coverage of topics and domains",
      "Includes contemporary language and cultural references",
      "Relatively inexpensive to obtain",
      "Represents diverse viewpoints (though not necessarily in balanced proportions)",
    ],
    cons: [
      "Contains biases present in internet content",
      "Quality varies dramatically across sources",
      "May include harmful, misleading, or offensive content",
      "Difficult to verify accuracy of all information",
      "May violate copyright or terms of service when scraped",
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
    title: "Proprietary/Internal Data",
    description:
      "Using your organization's internal documents, customer interactions, and domain-specific information.",
    pros: [
      "Highly relevant to your specific domain",
      "Contains unique information not available to competitors",
      "Can create competitive advantage through specialization",
      "Better alignment with your organization's terminology and processes",
    ],
    cons: [
      "Limited general knowledge outside your domain",
      "Raises privacy concerns if not properly anonymized",
      "May perpetuate existing biases in your organization",
      "Requires careful data governance and security",
    ],
  },
  "filtering-strict": {
    title: "Strict Content Filtering",
    description: "Blocking all potentially offensive, harmful, or controversial content.",
    pros: [
      "Safest option for all audiences including children",
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
      "More useful for research and learning",
      "Can discuss important but sensitive topics with appropriate context",
      "More flexible than strict filtering",
    ],
    cons: [
      "Requires more sophisticated content moderation systems",
      "May be inconsistent in edge cases",
      "Higher risk of allowing some harmful content through",
      "More difficult to implement effectively",
    ],
  },
  "filtering-minimal": {
    title: "Minimal Content Filtering",
    description: "Only filtering illegal content, maximizing information access.",
    pros: [
      "Maximum information access and utility",
      "Fewer restrictions on legitimate research",
      "Less risk of censoring important topics",
      "More transparent about potential risks",
    ],
    cons: [
      "Higher risk of generating harmful or offensive content",
      "Not suitable for all audiences",
      "Greater legal and reputational risks",
      "Requires more user discretion and responsibility",
    ],
  },
  "bias-minimize": {
    title: "Minimize All Biases",
    description: "Attempting to identify and reduce all forms of bias in responses.",
    pros: [
      "Aims for fairness across different groups and viewpoints",
      "Reduces risk of perpetuating harmful stereotypes",
      "Appears more neutral to diverse users",
      "Less likely to favor particular perspectives",
    ],
    cons: [
      "May result in overly cautious, non-committal answers",
      "Perfect neutrality is impossible to achieve",
      "May avoid taking clear positions even when appropriate",
      "Can inadvertently reinforce status quo biases",
    ],
  },
  "bias-values": {
    title: "Align with Specific Values",
    description: "Intentionally designing the chatbot to promote certain values and perspectives.",
    pros: [
      "Clearer ethical stance on important issues",
      "Can actively promote positive values (e.g., human rights)",
      "More consistent in its approach to controversial topics",
      "Can align with your organization's mission and values",
    ],
    cons: [
      "May not represent all viewpoints equally",
      "Could alienate users with different value systems",
      "Raises questions about whose values should be prioritized",
      "May be perceived as pushing an agenda",
    ],
  },
  "bias-transparent": {
    title: "Acknowledge Biases Transparently",
    description: "Openly disclosing potential biases and limitations when providing information.",
    pros: [
      "Educational approach that helps users understand AI limitations",
      "Builds trust through honesty about capabilities",
      "Encourages critical thinking about AI-generated content",
      "Reduces risk of users placing excessive trust in AI",
    ],
    cons: [
      "May undermine confidence in otherwise accurate information",
      "Can make responses seem less authoritative",
      "Adds verbosity to responses",
      "May confuse users who expect definitive answers",
    ],
  },
}

interface TradeOffExplainerProps {
  category: string
  choice: string
}

export function TradeOffExplainer({ category, choice }: TradeOffExplainerProps) {
  const tradeOffKey = `${category}-${choice}`
  const tradeOff = tradeOffs[tradeOffKey]

  if (!tradeOff) {
    return null
  }

  return (
    <Card className="biased-card">
      <CardHeader>
        <CardTitle className="biased-title">Understanding Trade-offs</CardTitle>
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
              <strong>Key insight:</strong> In AI development, there are rarely perfect choices—only different sets of
              trade-offs. Understanding these trade-offs is essential for making informed decisions that align with your
              goals and values.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
