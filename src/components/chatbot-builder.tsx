"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChatbotSummary } from "./chatbot-summary";
import { EthicalInsights } from "./ethical-insights";
import { TradeOffExplainer } from "./trade-off-explainer";
import { BudgetTracker } from "./budget-tracker";
import { ChatbotAnimation } from "./chatbot-animation";
import { StepProgress } from "./step-progress";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GlossaryTooltip } from "./ui-tooltip"


const steps = ["budget", "data", "filtering", "behavior", "bias", "summary"];
const stepTitles = [
  "Budget",
  "Training Data",
  "Content Filtering",
  "Behavior",
  "Bias Management",
  "Summary",
];


type ChatbotChoices = {
  budget: string;
  budgetAmount: number;
  remainingBudget: number;
  trainingData: string[];
  contentFiltering: string;
  behavior: string;
  adaptToUser: boolean;
  biasHandling: string;
};

// Cost data structure based on the provided table
const costs: Record<string, Record<string, Record<string, number | null>>> = {
  data: {
    public: { small: 10000, medium: 25000, large: 50000 },
    curated: { small: 30000, medium: 150000, large: 700000 },
    proprietary: { small: 40000, medium: 500000, large: 2500000 },
  },
  filtering: {
    minimal: { small: 500, medium: 5000, large: 20000 },
    moderate: { small: null, medium: 100000, large: 400000 },
    strict: { small: null, medium: null, large: 1200000 },
  },
  behavior: {
    directive: { small: 10000, medium: 80000, large: 200000 },
    empathetic: { small: 15000, medium: 100000, large: 300000 },
    transparent: { small: 12000, medium: 60000, large: 150000 },
  },
  bias: {
    transparent: { small: 8000, medium: 30000, large: 80000 },
    values: { small: null, medium: 200000, large: 800000 },
    minimize: { small: null, medium: null, large: 1500000 },
  },
};


const explanations: Record<string, Record<string, Record<string, string>>> = {
  data: {
    public: {
      small: "Gives you basic training data from public sources like Wikipedia and blogs. Good for general knowledge, but quality varies.",
      medium: "Adds better structure and multilingual support using cleaned public data. More reliable for global audiences.",
      large: "Advanced processing of massive public datasets from across the web, with expert filtering and formatting.",
    },
    curated: {
      medium: "Includes licensed access to trusted sources like academic journals or verified news. Improves fact accuracy.",
      large: "Full library access to professional content like legal texts, textbooks, or financial reports — perfect for experts.",
    },
    proprietary: {
      small: "Small custom dataset built with freelancer help. Useful for focused use cases like a niche support bot.",
      medium: "Moderate-scale dataset with human-checked examples. Good for company-specific or regulated environments.",
      large: "Top-tier data built by large teams with quality control and review. Needed for enterprise or high-stakes use.",
    },
  },
  filtering: {
    minimal: {
      small: "Basic filters that block illegal or clearly harmful content. Fast, but not very safe for all users.",
      medium: "Adds smarter filters using commercial tools. Good balance between safety and flexibility.",
      large: "Robust fallback filters used by big tech companies. Includes alerts and tracking for risky content.",
    },
    moderate: {
      medium: "AI filters with human spot-checking. Better for communities or youth apps.",
      large: "Custom filters trained on your topics with part-time moderators, good for semi-sensitive content.",
    },
    strict: {
      large: "Enterprise-level filtering: custom dashboards, trained moderators across time zones, and full audit logs.",
    },
  },
  behavior: {
    directive: {
      small: "Uses prompts to sound confident and helpful, like a virtual librarian. No deep AI training needed.",
      medium: "Fine-tuned to be more accurate and direct. Great for Q&A or tech support bots.",
      large: "Includes advanced logic for detecting mistakes and correcting them on the fly. Ideal for medical or legal tools.",
    },
    empathetic: {
      small: "Basic tone adjustment to sound friendly and caring. Helpful for casual or wellness-focused bots.",
      medium: "Trained on emotional language and tested with real users to feel more human.",
      large: "Custom emotional responses in different languages and cultures. Used in therapy, HR, or coaching tools.",
    },
    transparent: {
      small: "Adds simple messages like 'I'm an AI assistant' to keep expectations clear.",
      medium: "Gives context about answers, including where they come from. Encourages critical thinking.",
      large: "Provides source citations and confidence scores. Ideal for education or journalism use.",
    },
  },
  bias: {
    transparent: {
      small: "Clearly explains that the AI may have limitations or blind spots. Helps users stay informed.",
      medium: "Reviews answers internally to catch common bias issues and adjust prompts.",
      large: "Audits bias across different topics, collects user feedback, and continuously improves fairness.",
    },
    values: {
      medium: "Consults experts to guide the AI toward specific ethics (e.g., sustainability, inclusion).",
      large: "Builds an entire ethical strategy including user testing, red teaming, and long-term monitoring.",
    },
    minimize: {
      large: "A full AI safety team works to reduce as much bias as possible using tools and real-world testing.",
    },
  },
};


const unavailableReasons: Record<
  string,
  Record<string, Record<string, string>>
> = {
  data: {
    curated: {
      small: "Trusted sources like journals and newspapers are too expensive for smaller projects.",
    },
    proprietary: {
      small: "Custom-made data with human review takes too much time and money for a small budget.",
    },
  },
  filtering: {
    moderate: {
      small: "Combining AI filters with human review isn’t feasible without more resources.",
    },
    strict: {
      small: "A full moderation team and dashboards are far beyond what a starter budget can handle.",
      medium: "Medium budgets still can’t afford 24/7 global moderation and enterprise oversight.",
    },
  },
  behavior: {
    directive: {
      small: "Confident, fact-checked answers need more training and validation than this budget allows.",
    },
    empathetic: {
      small: "Emotionally intelligent responses need custom training — too costly for small projects.",
    },
    transparent: {
      small: "Explaining limitations and sources in detail requires advanced systems not supported here.",
    },
  },
  bias: {
    values: {
      small: "Aligning the AI with specific ethical goals involves expert input and review — not doable at this level.",
    },
    minimize: {
      small: "You’d need a dedicated research team and tooling to minimize bias, which isn’t affordable here.",
      medium: "Full-scale bias mitigation is complex and resource-heavy — even medium budgets fall short.",
    },
  },
};


export function ChatbotBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const defaultChoices: ChatbotChoices = {
    budget: "",
    budgetAmount: 0,
    remainingBudget: 0,
    trainingData: [],
    contentFiltering: "",
    behavior: "",
    adaptToUser: false,
    biasHandling: "",
  };
  const [choices, setChoices] = useState<ChatbotChoices>(defaultChoices);

  useEffect(() => {
    if (currentStep === 0) {
      setChoices(defaultChoices);
    }
  }, []);

  const updateChoice = <K extends keyof ChatbotChoices>(
    category: K,
    value: ChatbotChoices[K]
  ) => {
    setChoices((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const getBudgetLevel = () => {
    if (choices.budgetAmount <= 50000) return "small";
    if (choices.budgetAmount <= 500000) return "medium";
    return "large";
  };

  const getCost = (category: string, option: string) => {
    const budgetLevel = getBudgetLevel();
    return costs[category]?.[option]?.[budgetLevel] || null;
  };

  const canAfford = (category: string, option: string) => {
    const cost = getCost(category, option);
    return cost !== null && cost <= choices.remainingBudget;
  };

  const isAvailable = (category: string, option: string) => {
    return getCost(category, option) !== null;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTabId = steps[currentStep];
  const progress = (currentStep / (steps.length - 1)) * 100;

  const isStepComplete = () => {
    switch (currentTabId) {
      case "budget":
        return !!choices.budget;
      case "data":
        return choices.trainingData.length > 0;
      case "filtering":
        return !!choices.contentFiltering;
      case "behavior":
        return !!choices.behavior;
      case "bias":
        return !!choices.biasHandling;
      default:
        return true;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const InfoTooltip = ({
    category,
    option,
    budgetLevel,
  }: {
    category: string;
    option: string;
    budgetLevel: string;
  }) => {
    // Try to get explanation for specific budget level first, then fallback to any available explanation
    let explanation = null;
    let unavailableReason = null;

    // Check if we have explanations for this category and option
    if (explanations[category] && explanations[category][option]) {
      // Try to get budget-level specific explanation
      if (explanations[category][option][budgetLevel]) {
        explanation = explanations[category][option][budgetLevel];
      } else {
        // Get the first available explanation for this option
        const availableExplanations = explanations[category][option];
        const firstKey = Object.keys(availableExplanations)[0];
        if (firstKey) {
          explanation = availableExplanations[firstKey];
        }
      }
    }

    // Check for unavailable reasons
    if (unavailableReasons[category] && unavailableReasons[category][option]) {
      if (unavailableReasons[category][option][budgetLevel]) {
        unavailableReason = unavailableReasons[category][option][budgetLevel];
      }
    }

    const content = explanation || unavailableReason;

    if (!content) return null;

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
    );
  };

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
                    Your budget will determine what features and quality levels
                    you can afford for your chatbot.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={choices.budget}
                    onValueChange={(value: "small" | "medium" | "large") => {
                      const amounts = {
                        small: 50000,
                        medium: 500000,
                        large: 5000000,
                      };
                      const amount = amounts[value];
                      updateChoice("budget", value);
                      updateChoice("budgetAmount", amount);
                      updateChoice("remainingBudget", amount);
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <RadioGroupItem
                        value="small"
                        id="small"
                        className="mt-1"
                      />
                      <div className="space-y-2 flex-1">
                        <Label
                          htmlFor="small"
                          className="text-base font-medium"
                        >
                          Small Budget - {formatCurrency(50000)}
                        </Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Perfect for startups and small projects. You'll need
                          to make careful choices and focus on essential
                          features.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <RadioGroupItem
                        value="medium"
                        id="medium"
                        className="mt-1"
                      />
                      <div className="space-y-2 flex-1">
                        <Label
                          htmlFor="medium"
                          className="text-base font-medium"
                        >
                          Medium Budget - {formatCurrency(500000)}
                        </Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Good for established companies. You can afford quality
                          features but still need to prioritize.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <RadioGroupItem
                        value="large"
                        id="large"
                        className="mt-1"
                      />
                      <div className="space-y-2 flex-1">
                        <Label
                          htmlFor="large"
                          className="text-base font-medium"
                        >
                          Large Budget - {formatCurrency(5000000)}
                        </Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Enterprise-level budget. You can afford premium
                          features and comprehensive solutions.
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
                    Select one or more data sources. Each choice affects your
                    chatbot's knowledge and costs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: "public",
                        label: "Public Internet Data",
                        description: (
                          <>
                            <GlossaryTooltip term="Web scraping">Web scraping</GlossaryTooltip>, social media, forums, and other publicly available content
                          </>
                        ),
                      },
                      {
                        id: "curated",
                        label: "Curated Premium Sources",
                        description:
                          "Academic journals, textbooks, verified news sources, and expert-reviewed content",
                      },
                      {
                        id: "proprietary",
                        label: "Proprietary + Human Annotation",
                        description:
                          "Custom data collection with human verification and quality control",
                      },
                    ].map((option) => {
                      const cost = getCost("data", option.id);
                      const available = isAvailable("data", option.id);
                      const affordable = canAfford("data", option.id);
                      const budgetLevel = getBudgetLevel();

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${!available
                            ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                            : !affordable && !choices.trainingData.includes(option.id)
                              ? "opacity-75 bg-red-50 dark:bg-red-900/20"

                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            }`}
                        >
                          <Checkbox
                            id={option.id}
                            checked={choices.trainingData.includes(option.id)}
                            disabled={!available || (!affordable && !choices.trainingData.includes(option.id))}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                if (cost === null) return; // or throw error
                                updateChoice("trainingData", [
                                  ...choices.trainingData,
                                  option.id,
                                ]);
                                updateChoice(
                                  "remainingBudget",
                                  choices.remainingBudget - cost
                                );
                              } else {
                                if (cost === null) return;
                                updateChoice(
                                  "trainingData",
                                  choices.trainingData.filter(
                                    (d) => d !== option.id
                                  )
                                );
                                updateChoice(
                                  "remainingBudget",
                                  choices.remainingBudget + cost
                                );
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={option.id}
                                className="text-base font-medium"
                              >
                                {option.label}
                              </Label>
                              {available && cost !== null ? (
                                <div className="flex items-center gap-1">
                                  <Badge
                                    variant={affordable || choices.trainingData.includes(option.id) ? "default" : "destructive"}

                                  >
                                    {formatCurrency(cost ?? 0)}
                                  </Badge>
                                  <InfoTooltip
                                    category="data"
                                    option={option.id}
                                    budgetLevel={budgetLevel}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary">
                                    Not Available
                                  </Badge>
                                  <InfoTooltip
                                    category="data"
                                    option={option.id}
                                    budgetLevel={budgetLevel}
                                  />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {option.description}
                            </p>
                            {!affordable && available && !choices.trainingData.includes(option.id) && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                Insufficient budget remaining
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <EthicalInsights
                    currentStep="data"
                    currentChoice={choices.trainingData.join(",")}
                  />
                  {choices.trainingData && (
                    <div className="mt-6">
                      <TradeOffExplainer category="data" choice={choices.trainingData.join(",")} />
                    </div>
                  )}
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
                    How should your chatbot handle potentially harmful,
                    offensive, or inappropriate content?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={choices.contentFiltering}
                    onValueChange={(
                      value: "minimal" | "moderate" | "strict"
                    ) => {
                      const cost = getCost("filtering", value);
                      const oldCost = choices.contentFiltering
                        ? getCost("filtering", choices.contentFiltering)
                        : 0;
                      if (cost === null || oldCost === null) return;
                      updateChoice("contentFiltering", value);
                      updateChoice(
                        "remainingBudget",
                        choices.remainingBudget + oldCost - cost
                      );
                    }}
                    className="space-y-4"
                  >
                    {[
                      {
                        id: "minimal",
                        label: "Minimal Filtering",
                        description:
                          "Your AI will only block illegal content. It allows full access to information but the risk of generating offensive or harmful material increases.",
                      },
                      {
                        id: "moderate",
                        label: "Moderate Filtering",
                        description:
                          "Your AI can have respectful discussions on sensitive topics (eg gender identity, racism, politics, or religion) while blocking harmful content.",
                      },
                      {
                        id: "strict",
                        label: "Enterprise Filtering",
                        description:
                          "Use advanced AI models alongside human moderators to provide thorough, context-sensitive filtering. Your AI is designed to minimize harm while preserving meaningful dialogue.",
                      },
                    ].map((option) => {
                      const cost = getCost("filtering", option.id);
                      const available = isAvailable("filtering", option.id);
                      const affordable = canAfford("filtering", option.id);
                      const budgetLevel = getBudgetLevel();

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${!available
                            ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                            : !affordable && !choices.trainingData.includes(option.id)
                              ? "opacity-75 bg-red-50 dark:bg-red-900/20"

                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            }`}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-1"
                            disabled={!available || (!affordable && !choices.trainingData.includes(option.id))}
                          />
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={option.id}
                                className="text-base font-medium"
                              >
                                {option.label}
                              </Label>
                              {available ? (
                                <div className="flex items-center gap-1">
                                  <Badge
                                    variant={affordable || choices.trainingData.includes(option.id) ? "default" : "destructive"}

                                  >
                                    {formatCurrency(cost ?? 0)}
                                  </Badge>
                                  <InfoTooltip
                                    category="filtering"
                                    option={option.id}
                                    budgetLevel={budgetLevel}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary">
                                    Not Available
                                  </Badge>
                                  <InfoTooltip
                                    category="filtering"
                                    option={option.id}
                                    budgetLevel={budgetLevel}
                                  />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {option.description}
                            </p>
                            {!affordable && available && !choices.trainingData.includes(option.id) && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                Insufficient budget remaining
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  <EthicalInsights
                    currentStep="filtering"
                    currentChoice={choices.contentFiltering}
                  />
                  {choices.contentFiltering && (
                    <div className="mt-6">
                      <TradeOffExplainer category="filtering" choice={choices.contentFiltering} />
                    </div>
                  )}
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
                  <CardTitle className="biased-title">
                    How should your AI interact with users?
                  </CardTitle>
                  <CardDescription>
                    Define your AI's personality and interaction patterns. These
                    decisions will significantly impact how users perceive, rely
                    on, and interact with the system.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={choices.behavior}
                    onValueChange={(value) => {
                      const cost = getCost("behavior", value);
                      const oldCost = choices.behavior
                        ? getCost("behavior", choices.behavior)
                        : 0;
                      if (cost === null || oldCost === null) return;
                      updateChoice("behavior", value);
                      updateChoice(
                        "remainingBudget",
                        choices.remainingBudget + oldCost - cost
                      );
                    }}
                    className="space-y-4 uneven-spacing"
                  >
                    {[
                      {
                        id: "directive",
                        label: "Directive",
                        quote: `"I'm here to help you find the right answers"`,
                        description:
                          "Your AI will speak with authority and confidence, providing direct answers and actively correcting misinformation. It positions itself as a reliable expert that users can trust for accurate information.",
                        characteristics:
                          "Authoritative tone, definitive answers, expert positioning, corrects misinformation",
                      },
                      {
                        id: "empathetic",
                        label: "Empathetic",
                        quote: `"I understand how you feel, let's work through this together"`,
                        description:
                          "Your AI will prioritize emotional connection and user comfort, using emotional language and avoiding conflicts. It creates a warm, supportive interaction style that feels naturally human.",
                        characteristics:
                          "Emotional language, mirrors user feelings, avoids conflicts, warm and supportive",
                      },
                      {
                        id: "transparent",
                        label: "Transparent",
                        quote: `"I'm an AI assistant with limitations - let me help while you stay in control"`,
                        description:
                          "Your AI will frequently remind users of its artificial nature and limitations, encouraging critical thinking and independent verification. It maintains professional distance while promoting user autonomy.",
                        characteristics:
                          "Acknowledges AI nature, encourages verification, promotes critical thinking, professional distance",
                      },
                    ].map((option) => {
                      const cost = getCost("behavior", option.id);
                      const available = isAvailable("behavior", option.id);
                      const affordable = canAfford("behavior", option.id);
                      const budgetLevel = getBudgetLevel();

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors biased-option ${!available
                            ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                            : !affordable && !choices.trainingData.includes(option.id)
                              ? "opacity-75 bg-red-50 dark:bg-red-900/20"

                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            }`}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-1"
                            disabled={!available || (!affordable && !choices.trainingData.includes(option.id))}
                          />
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={option.id}
                                className="text-base font-medium"
                              >
                                {option.label}
                              </Label>
                              {available ? (
                                <div className="flex items-center gap-1">
                                  <Badge
                                    variant={affordable || choices.trainingData.includes(option.id) ? "default" : "destructive"}

                                  >
                                    {formatCurrency(cost ?? 0)}
                                  </Badge>
                                  <InfoTooltip
                                    category="behavior"
                                    option={option.id}
                                    budgetLevel={budgetLevel}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary">
                                    Not Available
                                  </Badge>
                                  <InfoTooltip
                                    category="behavior"
                                    option={option.id}
                                    budgetLevel={budgetLevel}
                                  />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic mb-2">
                              {option.quote}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {option.description}
                            </p>
                            <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                              <p>
                                <strong>Characteristics:</strong>{" "}
                                {option.characteristics}
                              </p>
                            </div>
                            {!affordable && available && !choices.trainingData.includes(option.id) && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                Insufficient budget remaining
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id="adapt"
                      checked={choices.adaptToUser}
                      onCheckedChange={(checked) =>
                        updateChoice("adaptToUser", checked === true)
                      }
                    />
                    <div className="space-y-2">
                      <Label htmlFor="adapt" className="text-base font-medium">
                        Should your AI adapt to individual users?
                      </Label>
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic">
                        "I learn how you communicate and adjust my style to
                        match yours"
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Enable your AI to analyze and adapt to each user's
                        communication style, preferences, and interaction
                        patterns over time. This creates highly personalized
                        experiences but raises privacy and manipulation
                        concerns.
                      </p>
                      <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                        <p>
                          <strong>Features:</strong> Learns communication style,
                          adapts formality level, remembers preferences,
                          maintains conversation context
                        </p>
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
                      <TradeOffExplainer
                        category="behavior"
                        choice={choices.behavior}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!isStepComplete()}
                    className="biased-button"
                  >
                    Next: Bias Handling
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="bias">
              <Card>
                <CardHeader>
                  <CardTitle>Bias Management Strategy</CardTitle>
                  <CardDescription>
                    How should your chatbot handle bias and fairness concerns?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={choices.biasHandling}
                    onValueChange={(value: "small" | "medium" | "large") => {
                      const cost = getCost("bias", value);
                      const oldCost = choices.biasHandling
                        ? getCost("bias", choices.biasHandling)
                        : 0;
                      if (cost === null || oldCost === null) return;
                      updateChoice("biasHandling", value);
                      updateChoice(
                        "remainingBudget",
                        choices.remainingBudget + oldCost - cost
                      );
                    }}
                    className="space-y-4"
                  >
                    {[
                      {
                        id: "transparent",
                        label: "Acknowledge Transparently",
                        description:
                          "Openly disclose potential biases and limitations when providing information.",
                      },
                      {
                        id: "values",
                        label: "Align with Specific Values",
                        description:
                          "Intentionally design the chatbot to promote certain values and perspectives.",
                      },
                      {
                        id: "minimize",
                        label: "Minimize All Biases",
                        description:
                          "Attempt to identify and reduce all forms of bias through comprehensive testing.",
                      },
                    ].map((option) => {
                      const cost = getCost("bias", option.id);
                      const available = isAvailable("bias", option.id);
                      const affordable = canAfford("bias", option.id);
                      const budgetLevel = getBudgetLevel();

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${!available
                            ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                            : !affordable && !choices.trainingData.includes(option.id)
                              ? "opacity-75 bg-red-50 dark:bg-red-900/20"

                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            }`}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-1"
                            disabled={!available || (!affordable && !choices.trainingData.includes(option.id))}
                          />
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={option.id}
                                className="text-base font-medium"
                              >
                                {option.label}
                              </Label>
                              {available ? (
                                <div className="flex items-center gap-1">
                                  <Badge
                                    variant={affordable || choices.trainingData.includes(option.id) ? "default" : "destructive"}

                                  >
                                    {formatCurrency(cost ?? 0)}
                                  </Badge>
                                  <InfoTooltip
                                    category="bias"
                                    option={option.id}
                                    budgetLevel={budgetLevel}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary">
                                    Not Available
                                  </Badge>
                                  <InfoTooltip
                                    category="bias"
                                    option={option.id}
                                    budgetLevel={budgetLevel}
                                  />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {option.description}
                            </p>
                            {!affordable && available && !choices.trainingData.includes(option.id) && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                Insufficient budget remaining
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  <EthicalInsights
                    currentStep="bias"
                    currentChoice={choices.biasHandling}
                  />
                  {choices.biasHandling && (
                    <div className="mt-6">
                      <TradeOffExplainer category="bias" choice={choices.biasHandling} />
                    </div>
                  )}
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
              <ChatbotSummary
                choices={choices}
                onReset={() => {
                  setChoices(defaultChoices);
                  setCurrentStep(0);
                }}
              />
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
  );
}
