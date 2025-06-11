"use client"

import React, { useState, useRef, useEffect } from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GlossaryTooltipProps {
  term: string
  children: React.ReactNode
}

// Glossary of AI and chatbot-related terms
const glossary: Record<string, string> = {
  // Data-related terms
  "training data": "Information used to teach AI models patterns, relationships, and how to generate responses.",
  "web scraping": "Automated collection of data from websites, often used to gather training data for AI models.",
  "proprietary data": "Information owned exclusively by an organization, often containing valuable internal knowledge.",
  "curated sources":
    "Carefully selected, high-quality information sources that have been vetted for accuracy and relevance.",
  "data cleaning": "Process of detecting and correcting errors, inconsistencies, and inaccuracies in datasets.",
  "data governance": "Framework for managing the availability, usability, integrity, and security of data.",

  // Model-related terms
  "fine-tuning":
    "Process of further training an existing AI model on specific data to improve performance for particular tasks.",
  "pre-trained models":
    "AI models that have already been trained on large datasets and can be used as-is or fine-tuned.",
  "custom models": "AI models built specifically for a particular use case or organization.",
  "model training": "Process of teaching an AI algorithm to make predictions or decisions based on data.",
  hallucination: "When AI generates information that appears plausible but is factually incorrect or made up.",

  // Content moderation terms
  "content filtering": "Process of screening and excluding inappropriate or harmful content from AI responses.",
  "content moderation": "Human or automated review of content to ensure it meets guidelines and policies.",
  "filter bubbles":
    "Intellectual isolation that can occur when algorithms selectively show content based on user history.",

  // Ethics-related terms
  bias: "Systematic errors in AI that can lead to unfair or prejudiced outcomes for certain groups.",
  transparency: "Openness about how AI works, its limitations, and how decisions are made.",
  personalization: "Tailoring AI responses based on individual user preferences, history, or characteristics.",
  "ethical AI": "Development and use of AI that aligns with moral principles and societal values.",

  // Technical terms
  infrastructure: "Hardware, software, and network resources required to run AI systems.",
  API: "Application Programming Interface; allows different software applications to communicate with each other.",
  "cloud services": "Computing services delivered over the internet, often used to host and run AI models.",
  latency: "Time delay between a user request and the AI system's response.",

  // Business terms
  ROI: "Return on Investment; measures the profitability of an investment relative to its cost.",
  scalability: "Ability of a system to handle growing amounts of work or expand to accommodate growth.",
  maintenance: "Ongoing work to keep AI systems functioning correctly and up to date.",
  deployment: "Process of making an AI system available for use in a production environment.",
}

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const normalizedTerm = term.toLowerCase()
  const definition = glossary[normalizedTerm]
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  // Detect touch device (move outside render to avoid conditional hook call)
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  // Always call useEffect, but only add/remove event if needed
  useEffect(() => {
    if (!open || !isTouch) return
    const handleClick = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, isTouch])

  if (!definition) {
    return <>{children}</>
  }

  const handleTouch = (e: React.TouchEvent) => {
    if (isTouch) {
      e.preventDefault()
      setOpen((prev) => !prev)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300} open={isTouch ? open : undefined} onOpenChange={isTouch ? setOpen : undefined}>
        <TooltipTrigger asChild>
          <span
            ref={triggerRef}
            className="border-dotted border-b border-slate-400 cursor-help"
            onTouchStart={handleTouch}
            tabIndex={0}
            role="button"
            aria-label={definition}
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-3">
          <div className="text-sm">{definition}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
