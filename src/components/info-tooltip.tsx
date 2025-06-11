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

  // Prefer unavailableReason when explanation is missing
  const content = explanation ?? unavailableReason;

  // If explanation is missing but unavailableReason exists, show that
  if (!explanation && unavailableReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-red-400 hover:text-red-600 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-3">
            <p className="text-sm">{unavailableReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

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

