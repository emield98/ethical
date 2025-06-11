import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { explanations, unavailableReasons } from "./chatbot-options";

interface InfoTooltipProps {
  category: string;
  option: string;
  budgetLevel: string;
}

export function InfoTooltip({ category, option, budgetLevel }: InfoTooltipProps) {
  const explanation =
    explanations[category]?.[option]?.[budgetLevel] ??
    null;

  const unavailableReason =
    unavailableReasons[category]?.[option]?.[budgetLevel] ?? null;

  const content = explanation ?? unavailableReason;

  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  // Close tooltip on click outside
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

  if (!content) return null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300} open={isTouch ? open : undefined} onOpenChange={isTouch ? setOpen : undefined}>
        <TooltipTrigger asChild>
          <span
            ref={triggerRef}
            className="inline-flex"
            onTouchStart={isTouch ? (e) => { e.preventDefault(); setOpen((prev) => !prev) } : undefined}
            tabIndex={0}
            role="button"
            aria-label={content}
          >
            <Info className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-help" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

