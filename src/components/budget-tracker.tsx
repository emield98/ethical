"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingDown, AlertTriangle } from "lucide-react"

interface BudgetTrackerProps {
  totalBudget: number
  remainingBudget: number
  currentStep: number
}

export function BudgetTracker({ totalBudget, remainingBudget, currentStep }: BudgetTrackerProps) {
  const spentBudget = totalBudget - remainingBudget
  const spentPercentage = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0
  const remainingPercentage = 100 - spentPercentage

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getBudgetStatus = () => {
    if (remainingPercentage > 50) return { color: "text-green-600", icon: DollarSign }
    if (remainingPercentage > 20) return { color: "text-yellow-600", icon: TrendingDown }
    return { color: "text-red-600", icon: AlertTriangle }
  }

  const status = getBudgetStatus()
  const StatusIcon = status.icon

  if (currentStep === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select your budget to start tracking your spending.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className={`h-5 w-5 ${status.color}`} />
          Budget Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Budget</span>
            <span className="font-medium">{formatCurrency(totalBudget)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Spent</span>
            <span className="font-medium text-red-600">{formatCurrency(spentBudget)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining</span>
            <span className={`font-medium ${status.color}`}>{formatCurrency(remainingBudget)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={spentPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{spentPercentage.toFixed(1)}% spent</span>
            <span>{remainingPercentage.toFixed(1)}% remaining</span>
          </div>
        </div>

        {remainingPercentage < 20 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">Low Budget Warning</span>
            </div>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
              You're running low on budget. Choose carefully!
            </p>
          </div>
        )}

        {remainingPercentage < 50 && remainingPercentage >= 20 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Budget Alert</span>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              You've spent over half your budget. Plan remaining choices wisely.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
