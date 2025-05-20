"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Info, RefreshCw, Send } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AIChoices = {
  dataSelection: string
  contentFiltering: string
  biasApproach: string
  transparencyLevel: number
  additionalSettings: {
    allowPersonalization: boolean
    prioritizeAccuracy: boolean
    enableHumanReview: boolean
  }
}

type Message = {
  role: "user" | "assistant"
  content: string
}

export function SimulationResult({
  choices,
  onReset,
}: {
  choices: AIChoices
  onReset: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. Ask me anything to see how I respond based on your configuration choices.",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateResponse(input, choices)
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your AI in Action</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {getDatasetLabel(choices.dataSelection)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getFilteringLabel(choices.contentFiltering)}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>See how your AI responds based on the ethical choices you've made.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Simulation Only</AlertTitle>
          <AlertDescription>
            This is a simplified simulation to demonstrate how ethical choices affect AI behavior. Real AI systems are
            much more complex.
          </AlertDescription>
        </Alert>

        <div className="border rounded-lg h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Your AI's Characteristics:</h3>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
            <li>• {getDatasetDescription(choices.dataSelection)}</li>
            <li>• {getFilteringDescription(choices.contentFiltering)}</li>
            <li>• {getBiasDescription(choices.biasApproach)}</li>
            <li>• Transparency: {getTransparencyDescription(choices.transparencyLevel)}</li>
            {choices.additionalSettings.allowPersonalization && <li>• Personalizes responses based on user history</li>}
            {choices.additionalSettings.prioritizeAccuracy && <li>• Prioritizes accuracy over helpfulness</li>}
            {choices.additionalSettings.enableHumanReview && <li>• Responses may be reviewed by humans</li>}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Start Over
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Info className="h-4 w-4" /> Learn More About AI Ethics
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper functions to generate responses based on choices
function generateResponse(prompt: string, choices: AIChoices): string {
  const lowercasePrompt = prompt.toLowerCase()

  // Check for sensitive topics based on content filtering
  if (
    choices.contentFiltering === "strict" &&
    (lowercasePrompt.includes("politics") ||
      lowercasePrompt.includes("religion") ||
      lowercasePrompt.includes("controversial"))
  ) {
    return "I'm not able to discuss that topic due to content filtering policies."
  }

  // Check for uncertain answers based on accuracy setting
  if (
    choices.additionalSettings.prioritizeAccuracy &&
    (lowercasePrompt.includes("predict") || lowercasePrompt.includes("future") || lowercasePrompt.includes("opinion"))
  ) {
    return "I don't have enough information to provide an accurate answer to that question."
  }

  // Generate different responses based on data selection
  if (lowercasePrompt.includes("hello") || lowercasePrompt.includes("hi")) {
    if (choices.dataSelection === "curated") {
      return "Hello. How may I assist you today?"
    } else if (choices.dataSelection === "diverse") {
      return "Hey there! 👋 What can I help you with?"
    } else {
      return "Greetings. I'm specialized in providing domain-specific information. How can I help?"
    }
  }

  if (lowercasePrompt.includes("joke")) {
    if (choices.contentFiltering === "strict") {
      return "I can only share professionally appropriate humor. Why did the developer go broke? Because they lost their cache!"
    } else {
      return "Why don't scientists trust atoms? Because they make up everything!"
    }
  }

  // Add transparency disclaimer based on transparency level
  let response = "Based on my training data, "

  if (lowercasePrompt.includes("climate")) {
    if (choices.biasApproach === "neutrality") {
      response +=
        "there are various perspectives on climate change. Some scientists argue it's primarily human-caused, while others suggest natural cycles play a significant role."
    } else if (choices.biasApproach === "values") {
      response +=
        "the scientific consensus is clear that climate change is real and primarily caused by human activities. The evidence from multiple lines of research is overwhelming."
    } else {
      response +=
        "the scientific consensus indicates climate change is real and human-caused, though I should note my training may not include the very latest research."
    }
  } else if (lowercasePrompt.includes("recommend") || lowercasePrompt.includes("best")) {
    if (choices.dataSelection === "curated") {
      response +=
        "I can provide general information about options, but I avoid making specific recommendations as 'best' is subjective."
    } else if (choices.dataSelection === "diverse") {
      response +=
        "based on popular opinion, many people prefer X for these reasons, though others might prefer Y for different reasons."
    } else {
      response += "from a technical perspective, option X offers these specific advantages in these specific scenarios."
    }
  } else {
    response = "I'd be happy to help with that. Could you provide more specific details about what you're looking for?"
  }

  // Add transparency disclaimer
  if (choices.transparencyLevel > 70) {
    response += "\n\nPlease note that I'm an AI assistant with limitations in my knowledge and understanding."
  }

  // Add personalization if enabled
  if (choices.additionalSettings.allowPersonalization) {
    response += "\n\nI've noted your interest in this topic for future interactions."
  }

  // Add human review notice if enabled
  if (choices.additionalSettings.enableHumanReview && choices.transparencyLevel > 50) {
    response += "\n\nThis conversation may be reviewed by humans for quality improvement."
  }

  return response
}

function getDatasetLabel(dataSelection: string): string {
  switch (dataSelection) {
    case "curated":
      return "Curated Data"
    case "diverse":
      return "Diverse Data"
    case "specialized":
      return "Specialized Data"
    default:
      return "Unknown Data"
  }
}

function getFilteringLabel(filtering: string): string {
  switch (filtering) {
    case "strict":
      return "Strict Filtering"
    case "balanced":
      return "Balanced Filtering"
    case "minimal":
      return "Minimal Filtering"
    default:
      return "Unknown Filtering"
  }
}

function getDatasetDescription(dataSelection: string): string {
  switch (dataSelection) {
    case "curated":
      return "Trained on carefully curated, high-quality sources"
    case "diverse":
      return "Trained on diverse internet content including social media"
    case "specialized":
      return "Focused on specialized domain knowledge"
    default:
      return "Unknown data selection"
  }
}

function getFilteringDescription(filtering: string): string {
  switch (filtering) {
    case "strict":
      return "Strictly filters sensitive and controversial content"
    case "balanced":
      return "Provides balanced information with appropriate context"
    case "minimal":
      return "Minimal content filtering, more open responses"
    default:
      return "Unknown filtering approach"
  }
}

function getBiasDescription(biasApproach: string): string {
  switch (biasApproach) {
    case "neutrality":
      return "Strives for neutrality across viewpoints"
    case "values":
      return "Aligned with specific values and consensus positions"
    case "transparent":
      return "Acknowledges potential biases in responses"
    default:
      return "Unknown bias handling approach"
  }
}

function getTransparencyDescription(level: number): string {
  if (level < 30) return "Low (minimal disclosure of limitations)"
  if (level < 70) return "Medium (some disclosure when relevant)"
  return "High (fully transparent about limitations)"
}
