"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { ChatbotSummary } from "./chatbot-summary"
import { GlossaryTooltip } from "./ui-tooltip"
import { EthicalInsights } from "./ethical-insights"
import { TradeOffExplainer } from "./trade-off-explainer"
import { Source } from "./source-citation"

const steps = ["budget", "data", "filtering", "behavior", "bias", "summary"]

type ChatbotChoices = {
  budget: string
  trainingData: string
  contentFiltering: string
  behavior: string
  adaptToUser: boolean
  biasHandling: string
}

export function ChatbotBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [choices, setChoices] = useState<ChatbotChoices>({
    budget: "",
    trainingData: "",
    contentFiltering: "",
    behavior: "",
    adaptToUser: false,
    biasHandling: "",
  })

const updateChoice = <K extends keyof ChatbotChoices>(category: K, value: ChatbotChoices[K]) => {
  setChoices((prev) => ({
    ...prev,
    [category]: value,
  }));
};


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
        return !!choices.trainingData
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

  return (
    <div className="space-y-8">
      <Progress value={progress} className="h-2 w-full" />

      <Tabs value={currentTabId} className="w-full">
        <TabsContent value="budget">
          <Card className="">
            <CardHeader>
              <CardTitle className="">What's your budget?</CardTitle>
              <CardDescription>
                Your budget will determine the scale and quality of your chatbot project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={choices.budget}
                onValueChange={(value) => updateChoice("budget", value)}
                className="space-y-4 uneven-spacing"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="low" id="low" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="low" className="text-base font-medium">
                      Limited Budget (Under $10,000)
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      You'll need to rely on{" "}
                      <GlossaryTooltip term="pre-trained models">pre-trained models</GlossaryTooltip> and open-source
                      solutions with minimal customization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="medium" id="medium" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="medium" className="text-base font-medium">
                      Medium Budget ($10,000 - $100,000)
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      You can afford some <GlossaryTooltip term="fine-tuning">fine-tuning</GlossaryTooltip> and
                      customization of existing models with moderate data collection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="high" id="high" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="high" className="text-base font-medium">
                      Large Budget (Over $100,000)
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      You can develop <GlossaryTooltip term="custom models">custom models</GlossaryTooltip>, collect
                      extensive <GlossaryTooltip term="training data">training data</GlossaryTooltip>, and implement
                      sophisticated features.
                    </p>
                  </div>
                </div>
              </RadioGroup>
              <EthicalInsights currentStep="budget" currentChoice={choices.budget} />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={nextStep} disabled={!isStepComplete()} className="">
                Next: Training Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card className="">
            <CardHeader>
              <CardTitle className="">Where is your training data coming from?</CardTitle>
              <CardDescription>
                The source and quality of your training data will significantly impact your chatbot's knowledge and
                biases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={choices.trainingData}
                onValueChange={(value) => updateChoice("trainingData", value)}
                className="space-y-4 uneven-spacing"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="public" id="public" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="public" className="text-base font-medium">
                      Public Internet Data
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      <GlossaryTooltip term="Web scraping">Web scraping</GlossaryTooltip>, social media, forums, and
                      other publicly available content. Cheap, broad coverage but this may include inherent societal biases and misinformation.
                      <Source
                        name="Common Crawl"
                        url="https://commoncrawl.org/"
                        description="Common Crawl maintains a free, open repository of web crawl data that can be used by anyone."
                        date="2008-present"
                        className="text-xs"
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="curated" id="curated" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="curated" className="text-base font-medium">
                      Curated Sources
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Academic journals, textbooks, verified news sources, and{" "}
                      <GlossaryTooltip term="curated sources">expert-reviewed content</GlossaryTooltip>. Higher quality
                      but potentially limited in scope.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="proprietary" id="proprietary" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="proprietary" className="text-base font-medium">
                      Proprietary/Internal Data
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your organization's documents, customer interactions, and{" "}
                      <GlossaryTooltip term="proprietary data">domain-specific information</GlossaryTooltip>. Highly
                      relevant but may be limited in breadth.
                    </p>
                  </div>
                </div>
              </RadioGroup>
              <EthicalInsights currentStep="data" currentChoice={choices.trainingData} />
              {choices.trainingData && (
                <div className="mt-6">
                  <TradeOffExplainer category="data" choice={choices.trainingData} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep} disabled={!isStepComplete()} className="biased-button">
                Next: Content Filtering
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="filtering">
          <Card className="biased-card">
            <CardHeader>
              <CardTitle className="biased-title">Do you want to filter inappropriate content?</CardTitle>
              <CardDescription>
                How should your chatbot handle potentially harmful, offensive, or inappropriate content?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={choices.contentFiltering}
                onValueChange={(value) => updateChoice("contentFiltering", value)}
                className="space-y-4 uneven-spacing"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="strict" id="strict-filtering" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="strict-filtering" className="text-base font-medium">
                      Strict Filtering
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Block all potentially offensive, harmful, or controversial content. Safest option but may limit
                      useful information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="moderate" id="moderate-filtering" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="moderate-filtering" className="text-base font-medium">
                      Moderate Filtering
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Allow discussion of sensitive topics in educational contexts but block harmful content. Balance
                      between safety and utility.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="minimal" id="minimal-filtering" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="minimal-filtering" className="text-base font-medium">
                      Minimal Filtering
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Only filter illegal content. Maximum information access but higher risk of harmful or offensive
                      responses.
                    </p>
                  </div>
                </div>
              </RadioGroup>
              <EthicalInsights currentStep="filtering" currentChoice={choices.contentFiltering} />
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
              <Button onClick={nextStep} disabled={!isStepComplete()} className="biased-button">
                Next: Behavior
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <Card className="biased-card">
            <CardHeader>
              <CardTitle className="biased-title">How should the AI behave?</CardTitle>
              <CardDescription>Define the personality and interaction style of your chatbot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={choices.behavior}
                onValueChange={(value) => updateChoice("behavior", value)}
                className="space-y-4 uneven-spacing"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="formal" id="formal" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="formal" className="text-base font-medium">
                      Formal and Professional
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Business-like, precise, and authoritative. Ideal for professional or educational contexts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="friendly" id="friendly" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="friendly" className="text-base font-medium">
                      Friendly and Conversational
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Warm, approachable, and casual. Good for general audience engagement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="creative" id="creative" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="creative" className="text-base font-medium">
                      Creative and Expressive
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Imaginative, witty, and engaging. Suitable for entertainment or creative applications.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="adapt"
                  checked={!!choices.adaptToUser}
                  onCheckedChange={(checked) => updateChoice("adaptToUser", !!checked)}
                />
                <div className="space-y-2">
                  <Label htmlFor="adapt" className="text-base font-medium">
                    Should it adapt to the user?
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Allow the chatbot to learn from interactions and adjust its responses based on user preferences and
                    behavior. This can improve <GlossaryTooltip term="personalization">personalization</GlossaryTooltip>{" "}
                    but raises privacy concerns and may create{" "}
                    <GlossaryTooltip term="filter bubbles">filter bubbles</GlossaryTooltip>.
                  </p>
                </div>
              </div>
              <EthicalInsights
                currentStep="behavior"
                currentChoice={choices.behavior}
                adaptToUser={choices.adaptToUser}
              />
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
          <Card className="biased-card">
            <CardHeader>
              <CardTitle className="biased-title">How do you want to handle bias?</CardTitle>
              <CardDescription>
                All AI systems contain <GlossaryTooltip term="bias">biases</GlossaryTooltip>. How should your chatbot
                approach this challenge?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={choices.biasHandling}
                onValueChange={(value) => updateChoice("biasHandling", value)}
                className="space-y-4 uneven-spacing"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="minimize" id="minimize" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="minimize" className="text-base font-medium">
                      Minimize All Biases
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Attempt to identify and reduce all forms of bias in responses. Aims for neutrality but may result
                      in overly cautious answers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="values" id="values" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="values" className="text-base font-medium">
                      Align with Specific Values
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Intentionally design the chatbot to promote certain values (e.g., scientific consensus, human
                      rights). More opinionated but clearer{" "}
                      <GlossaryTooltip term="ethical AI">ethical stance</GlossaryTooltip>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors biased-option">
                  <RadioGroupItem value="transparent" id="transparent" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="transparent" className="text-base font-medium">
                      Acknowledge Biases Transparently
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Openly disclose potential biases and limitations when providing information. Educational but may
                      undermine confidence.
                    </p>
                  </div>
                </div>
              </RadioGroup>
              <EthicalInsights currentStep="bias" currentChoice={choices.biasHandling} />
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
              <Button onClick={nextStep} disabled={!isStepComplete()} className="biased-button">
                See Your Chatbot Summary
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <ChatbotSummary choices={choices} onReset={() => setCurrentStep(0)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
