"use client"

import React, { useState } from "react"
import { Info, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SourceProps {
  name: string
  url?: string
  description?: string
  date?: string
  className?: string
  tooltipSide?: "top" | "right" | "bottom" | "left"
  compact?: boolean
}

export function Source({
  name,
  url,
  description,
  date,
  className,
  tooltipSide = "bottom",
  compact = false,
}: SourceProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!url) return
    
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <span 
              className={cn(
                "inline-flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 cursor-help",
                className
              )}
            >
              <Info className="h-3 w-3 mr-1" />Source
            </span>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide} className="p-3 max-w-xs">
            <div className="space-y-1.5">
              <span className="font-medium block">{name}</span>
              {description && <span className="text-xs opacity-90 block">{description}</span>}
              {date && <span className="text-xs opacity-75 block">Published: {date}</span>}
              {url && (
                <div className="flex items-center gap-2 pt-1">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> View source
                  </a>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <span className={cn("flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 p-2 border border-slate-200 dark:border-slate-800 rounded-md bg-slate-50 dark:bg-slate-900/50 mt-2 block", className)}>
      <Info className="h-4 w-4 mt-0.5 text-slate-400 dark:text-slate-500" />
      <span className="space-y-1 flex-1 block">
        <span className="font-medium text-slate-700 dark:text-slate-300 block">{name}</span>
        {description && <span className="text-xs block">{description}</span>}
        {date && <span className="text-xs opacity-75 block">Published: {date}</span>}
        {url && (
          <span className="flex items-center gap-2 pt-1 block">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> View source
            </a>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </span>
        )}
      </span>
    </span>
  )
}