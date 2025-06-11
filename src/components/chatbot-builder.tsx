"use client";

import { useState } from "react";
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
import { RefreshCw } from "lucide-react";
import { GlossaryTooltip } from "./ui-tooltip";
import { filteringOptions, costs, explanations, unavailableReasons } from "./chatbot-options";
import { formatCurrency } from "@/lib/utils";
import { InfoTooltip } from "./info-tooltip";

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
                    {[
                      {
                        id: "small",
                        label: "Small Budget",
                        description:
                          "Perfect for startups and small projects. You'll need to make careful choices and focus on essential features.",
                        amount: 50000,
                      },
                      {
                        id: "medium",
                        label: "Medium Budget",
                        description:
                          "Good for established companies. You can afford quality features but still need to prioritize.",
                        amount: 500000,
                      },
                      {
                        id: "large",
                        label: "Large Budget",
                        description:
                          "Enterprise-level budget. You can afford premium features and comprehensive solutions.",
                        amount: 5000000,
                      },
                    ].map((option) => (
                      <div
                        key={option.id}
                        className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="mt-1"
                        />
                        <div className="space-y-2 flex-1">
                          <Label
                            htmlFor={option.id}
                            className="text-base font-medium"
                          >
                            {option.label} -{" "}
                            {formatCurrency(option.amount)}
                          </Label>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                  <EthicalInsights currentStep="budget" currentChoice={choices.budget} />
                  {choices.trainingData && (
                    <div className="mt-6">
                      <TradeOffExplainer category="data" choice={choices.trainingData.join(",")} />
                    </div>
                  )}
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
                      const selected = choices.trainingData.includes(option.id);

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${!available
                            ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                            : !affordable && !selected
                              ? "opacity-75 bg-red-50 dark:bg-red-900/20"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            }`}
                        >
                          <Checkbox
                            id={option.id}
                            checked={selected}
                            disabled={!available || (!affordable && !selected)}
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
                                    variant={affordable || selected ? "default" : "destructive"}
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
                            {!affordable && available && !selected && (
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
                  <Button variant="outline" onClick={() => {
                    setChoices(defaultChoices);
                    setCurrentStep(0);
                  }}>
                    <RefreshCw className="h-4 w-4" /> Start Over
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
                    {filteringOptions.map((option) => {
                      const cost = getCost("filtering", option.id);
                      const available = isAvailable("filtering", option.id);
                      const affordable = canAfford("filtering", option.id);
                      const budgetLevel = getBudgetLevel();
                      const selected = choices.contentFiltering === option.id;

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${!available
                            ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                            : !affordable && !selected
                              ? "opacity-75 bg-red-50 dark:bg-red-900/20"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            }`}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-1"
                            disabled={!available || (!affordable && !selected)}
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
                                    variant={affordable || selected ? "default" : "destructive"}
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
                            {!affordable && available && !selected && (
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
                  <Button variant="outline" onClick={() => {
                    setChoices(defaultChoices);
                    setCurrentStep(0);
                  }}>
                    <RefreshCw className="h-4 w-4" /> Start Over
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
                      const selected = choices.behavior === option.id;

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors biased-option ${!available
                            ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                            : !affordable && !selected
                              ? "opacity-75 bg-red-50 dark:bg-red-900/20"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            }`}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-1"
                            disabled={!available || (!affordable && !selected)}
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
                                    variant={affordable || selected ? "default" : "destructive"}
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
                            {!affordable && available && !selected && (
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
                  <Button variant="outline" onClick={() => {
                    setChoices(defaultChoices);
                    setCurrentStep(0);
                  }}>
                    <RefreshCw className="h-4 w-4" /> Start Over
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
                          "No debiasing, instead openly disclose potential biases and limitations when providing information.",
                      },
                      {
                        id: "values",
                        label: "Debiasing the Dataset",
                        description:
                          "Attempting to remove harmful biases in the data before training. Examples of this include balancing the frequency of gender pronouns for neutral occupations, i.e. equal occurences of 'he is a doctor' and 'she is a doctor'",
                      },
                      {
                        id: "minimize",
                        label: "Minimize All Biases",
                        description:
                          "Debiasing at every step of the models training using methods such as GN-Glove and Hard-Debiased.",
                      },
                    ].map((option) => {
                      const cost = getCost("bias", option.id);
                      const available = isAvailable("bias", option.id);
                      const affordable = canAfford("bias", option.id);
                      const budgetLevel = getBudgetLevel();
                      const selected = choices.biasHandling === option.id;

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${!available
                            ? "opacity-50 bg-slate-100 dark:bg-slate-800"
                            : !affordable && !selected
                              ? "opacity-75 bg-red-50 dark:bg-red-900/20"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            }`}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-1"
                            disabled={!available || (!affordable && !selected)}
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
                                    variant={affordable || selected ? "default" : "destructive"}
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
                            {!affordable && available && !selected && (
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
                  <Button variant="outline" onClick={() => {
                    setChoices(defaultChoices);
                    setCurrentStep(0);
                  }}>
                    <RefreshCw className="h-4 w-4" /> Start Over
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
