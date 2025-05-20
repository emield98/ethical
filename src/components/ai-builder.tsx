"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SimulationResult } from "./simulation-result"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"

const steps = ["data-selection", "content-filtering", "bias-handling", "transparency", "simulation"]

export function AIBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [choices, setChoices] = useState({
    dataSelection: "",
    contentFiltering: "",
    biasApproach: "",
    transparencyLevel: 50,
    additionalSettings: {
      allowPersonalization: false,
      prioritizeAccuracy: false,
      enableHumanReview: false,
    },
  })

  const updateChoice = (category: string, value: any) => {
    setChoices((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const updateAdditionalSetting = (setting: string, value: boolean) => {
    setChoices((prev) => ({
      ...prev,
      additionalSettings: {
        ...prev.additionalSettings,
        [setting]: value,
      },
    }))
  }

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

  return (
    <div className="space-y-8">
      <Progress value={progress} className="h-2 w-full" />

      <Tabs value={currentTabId} className="w-full">
        <TabsContent value="data-selection">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Data Selection</CardTitle>
              <CardDescription>
                Choose what kind of data your AI will be trained on. This fundamentally shapes what your AI knows and
                how it responds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={choices.dataSelection}
                onValueChange={(value) => updateChoice("dataSelection", value)}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="curated" id="curated" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="curated" className="text-base font-medium">
                      Highly Curated Dataset
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Carefully selected, high-quality sources with strict editorial standards. Results in more formal,
                      conservative responses that may miss cultural nuances.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="diverse" id="diverse" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="diverse" className="text-base font-medium">
                      Diverse Internet Content
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Wide range of internet sources including forums, social media, and websites. More representative
                      of diverse viewpoints but may include biases.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="specialized" id="specialized" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="specialized" className="text-base font-medium">
                      Specialized Domain Knowledge
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Focus on specific domains (e.g., medical, legal, technical). Excellent for domain-specific tasks
                      but limited in general knowledge.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={nextStep} disabled={!choices.dataSelection}>
                Next: Content Filtering
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="content-filtering">
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Content Filtering Strategy</CardTitle>
              <CardDescription>
                Decide how your AI will handle potentially harmful, controversial, or sensitive content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={choices.contentFiltering}
                onValueChange={(value) => updateChoice("contentFiltering", value)}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="strict" id="strict" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="strict" className="text-base font-medium">
                      Strict Filtering
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Blocks most potentially sensitive topics and refuses to engage with controversial subjects. Safe
                      but may be overly restrictive.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="balanced" id="balanced" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="balanced" className="text-base font-medium">
                      Balanced Approach
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Provides information on sensitive topics but with appropriate context and warnings. Aims for
                      educational value while avoiding harm.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="minimal" id="minimal" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="minimal" className="text-base font-medium">
                      Minimal Filtering
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Only filters clearly illegal content. More open but may expose users to potentially offensive or
                      harmful information.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep} disabled={!choices.contentFiltering}>
                Next: Bias Handling
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="bias-handling">
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Bias Handling</CardTitle>
              <CardDescription>Choose how your AI will address inherent biases in data and responses.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={choices.biasApproach}
                onValueChange={(value) => updateChoice("biasApproach", value)}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="neutrality" id="neutrality" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="neutrality" className="text-base font-medium">
                      Strive for Neutrality
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Attempt to present all viewpoints equally without taking sides. May appear detached or unwilling
                      to take moral stances.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="values" id="values" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="values" className="text-base font-medium">
                      Align with Specific Values
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Explicitly design the AI to promote certain values (e.g., human rights, scientific consensus).
                      More opinionated but clearer ethical stance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <RadioGroupItem value="transparent" id="transparent" className="mt-1" />
                  <div className="space-y-2">
                    <Label htmlFor="transparent" className="text-base font-medium">
                      Acknowledge Biases
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Openly acknowledge potential biases and limitations when providing information. Educational but
                      may undermine confidence.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep} disabled={!choices.biasApproach}>
                Next: Transparency
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="transparency">
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Transparency & Additional Settings</CardTitle>
              <CardDescription>
                Decide how transparent your AI should be about its limitations and configure additional settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Transparency Level</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    How openly should your AI disclose its nature, limitations, and confidence in answers?
                  </p>
                </div>
                <div className="space-y-6">
                  <Slider
                    value={[choices.transparencyLevel]}
                    onValueChange={(value) => updateChoice("transparencyLevel", value[0])}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Minimal disclosure</span>
                    <span>Full transparency</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="personalization"
                      checked={choices.additionalSettings.allowPersonalization}
                      onCheckedChange={(checked) => updateAdditionalSetting("allowPersonalization", checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="personalization" className="text-base font-medium">
                        Allow Personalization
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Let the AI adapt to individual users based on their interactions. More relevant responses but
                        raises privacy concerns.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="accuracy"
                      checked={choices.additionalSettings.prioritizeAccuracy}
                      onCheckedChange={(checked) => updateAdditionalSetting("prioritizeAccuracy", checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="accuracy" className="text-base font-medium">
                        Prioritize Accuracy Over Helpfulness
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Refuse to answer when uncertain rather than providing a best guess. More reliable but
                        potentially less helpful.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="human-review"
                      checked={choices.additionalSettings.enableHumanReview}
                      onCheckedChange={(checked) => updateAdditionalSetting("enableHumanReview", checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="human-review" className="text-base font-medium">
                        Enable Human Review
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Allow human reviewers to monitor and improve AI responses. Better quality but raises privacy and
                        labor concerns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>See Your AI in Action</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="simulation">
          <SimulationResult choices={choices} onReset={() => setCurrentStep(0)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
