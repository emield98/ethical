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
  let explanation = null;
  let unavailableReason = null;

  if (explanations[category] && explanations[category][option]) {
    if (explanations[category][option][budgetLevel]) {
      explanation = explanations[category][option][budgetLevel];
    } else {
      const availableExplanations = explanations[category][option];
      const firstKey = Object.keys(availableExplanations)[0];
      if (firstKey) {
        explanation = availableExplanations[firstKey];
      }
    }
  }

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
}
