"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Target,
  ArrowRight,
  PiggyBank,
  Zap,
} from "lucide-react"
import type { WithdrawalFrequency, WithdrawalFrequencyOption, SustainableWithdrawal } from "@/types/trading"

const withdrawalFrequencyOptions: WithdrawalFrequencyOption[] = [
  {
    value: "daily",
    label: "Daily",
    days: 1,
    description: "Withdraw every day",
  },
  {
    value: "weekly",
    label: "Weekly",
    days: 7,
    description: "Withdraw every week",
  },
  {
    value: "biweekly",
    label: "Bi-weekly",
    days: 14,
    description: "Withdraw every 2 weeks",
  },
  {
    value: "monthly",
    label: "Monthly",
    days: 30,
    description: "Withdraw every month",
  },
]

interface SustainableWithdrawalTabProps {
  initialAmount: string
  numberOfSignals: string
  percentageRate: string
  withdrawalAmount: string
  setWithdrawalAmount: (value: string) => void
  withdrawalFrequency: WithdrawalFrequency
  setWithdrawalFrequency: (value: WithdrawalFrequency) => void
  sustainableWithdrawal: SustainableWithdrawal | null
}

export function SustainableWithdrawalTab({
  initialAmount,
  numberOfSignals,
  percentageRate,
  withdrawalAmount,
  setWithdrawalAmount,
  withdrawalFrequency,
  setWithdrawalFrequency,
  sustainableWithdrawal,
}: SustainableWithdrawalTabProps) {
  const selectedFrequencyOption = withdrawalFrequencyOptions.find((option) => option.value === withdrawalFrequency)
  const frequencyLabel = selectedFrequencyOption?.label.toLowerCase() || "weekly"

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    const fixedAmount = amount === 0 ? 0 : amount
    return fixedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  // Calculate current parameters for advice
  const currentParams = {
    initial: Number.parseFloat(initialAmount || "0"),
    signals: Number.parseInt(numberOfSignals || "0"),
    percentage: Number.parseFloat(percentageRate || "0"),
    targetWithdrawal: Number.parseFloat(withdrawalAmount || "0"),
  }

  const dailyGrowthRate =
    currentParams.initial > 0 ? 0.01 * (currentParams.percentage / 100) * currentParams.signals : 0
  const currentDailyIncome = currentParams.initial * dailyGrowthRate

  // Generate advice based on current situation
  const generateAdvice = () => {
    const advice = []

    if (!sustainableWithdrawal && currentParams.targetWithdrawal > 0) {
      // Withdrawal not possible
      const requiredBalance =
        currentParams.targetWithdrawal / (Math.pow(1 + dailyGrowthRate, selectedFrequencyOption?.days || 7) - 1)
      const multiplier = requiredBalance / currentParams.initial

      advice.push({
        type: "warning",
        icon: <AlertCircle className="h-4 w-4" />,
        title: "Withdrawal Too High",
        message: `Your target ${frequencyLabel} withdrawal of $${formatCurrency(currentParams.targetWithdrawal)} requires a balance of $${formatCurrency(requiredBalance)} (${multiplier.toFixed(1)}x your current amount).`,
        suggestion: `Try reducing your withdrawal to $${formatCurrency(currentParams.initial * (Math.pow(1 + dailyGrowthRate, selectedFrequencyOption?.days || 7) - 1))} or less.`,
      })
    }

    if (sustainableWithdrawal && sustainableWithdrawal.daysToReach > 0) {
      // Need to wait
      advice.push({
        type: "info",
        icon: <Clock className="h-4 w-4" />,
        title: "Patience Pays Off",
        message: `In just ${sustainableWithdrawal.daysToReach} days, you'll be able to withdraw $${formatCurrency(currentParams.targetWithdrawal)} ${frequencyLabel} forever.`,
        suggestion: `Your balance will grow from $${formatCurrency(currentParams.initial)} to $${formatCurrency(sustainableWithdrawal.balanceAtStart)} by ${sustainableWithdrawal.startDate.toLocaleDateString()}.`,
      })
    }

    if (sustainableWithdrawal && sustainableWithdrawal.daysToReach === 0) {
      // Can start immediately
      advice.push({
        type: "success",
        icon: <CheckCircle className="h-4 w-4" />,
        title: "Ready to Withdraw!",
        message: `You can start withdrawing $${formatCurrency(currentParams.targetWithdrawal)} ${frequencyLabel} immediately!`,
        suggestion: `Your account generates $${formatCurrency(sustainableWithdrawal.periodGrowth)} ${frequencyLabel}, so you'll have $${formatCurrency(sustainableWithdrawal.netPeriodGrowth)} left over for growth.`,
      })
    }

    // Growth rate advice
    if (dailyGrowthRate > 0) {
      const monthlyGrowthRate = Math.pow(1 + dailyGrowthRate, 30) - 1
      advice.push({
        type: "tip",
        icon: <TrendingUp className="h-4 w-4" />,
        title: "Your Growth Power",
        message: `With ${currentParams.signals} signals at ${currentParams.percentage}%, you're earning ${(dailyGrowthRate * 100).toFixed(2)}% daily.`,
        suggestion: `This compounds to ${(monthlyGrowthRate * 100).toFixed(1)}% monthly growth - that's $${formatCurrency(currentParams.initial * monthlyGrowthRate)} per month on your current balance!`,
      })
    }

    // Frequency optimization advice
    if (currentParams.targetWithdrawal > 0) {
      const dailyEquivalent = currentParams.targetWithdrawal / (selectedFrequencyOption?.days || 7)
      if (dailyEquivalent < currentDailyIncome) {
        advice.push({
          type: "tip",
          icon: <Zap className="h-4 w-4" />,
          title: "Frequency Optimization",
          message: `You could withdraw $${formatCurrency(dailyEquivalent)} daily instead of $${formatCurrency(currentParams.targetWithdrawal)} ${frequencyLabel}.`,
          suggestion: `Daily withdrawals give you more flexibility and faster access to your profits!`,
        })
      }
    }

    return advice
  }

  const advice = generateAdvice()

  return (
    <div className="space-y-4 mt-4">
      {/* Main Question Card */}
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle className="text-lg text-purple-900 dark:text-purple-100">
              How Much Do You Want to Withdraw Forever?
            </CardTitle>
          </div>
          <CardDescription className="text-purple-700 dark:text-purple-300 text-sm">
            Tell us your desired withdrawal amount and frequency, and we'll calculate exactly when you can start
            withdrawing without ever touching your growing capital.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-withdrawal" className="text-purple-800 dark:text-purple-300 text-sm font-medium">
                Target Withdrawal Amount (USD)
              </Label>
              <Input
                id="target-withdrawal"
                type="number"
                placeholder="2000"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                min="1"
                step="0.01"
                className="border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:bg-gray-800 dark:text-white text-lg font-semibold"
              />
              <p className="text-xs text-purple-600 dark:text-purple-400">
                How much do you want to withdraw each time?
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="withdrawal-frequency"
                className="text-purple-800 dark:text-purple-300 text-sm font-medium"
              >
                Withdrawal Frequency
              </Label>
              <Select value={withdrawalFrequency} onValueChange={setWithdrawalFrequency}>
                <SelectTrigger
                  id="withdrawal-frequency"
                  className="border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                >
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                  {withdrawalFrequencyOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="dark:text-white dark:focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-purple-600 dark:text-purple-400">How often do you want to withdraw?</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {!withdrawalAmount || withdrawalAmount === "0" ? (
        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">Enter Your Target Amount</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-500">
            Please enter how much you want to withdraw {frequencyLabel} to see when you can start your sustainable
            withdrawal strategy.
          </AlertDescription>
        </Alert>
      ) : !sustainableWithdrawal ? (
        <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-400">Target Too High</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-500">
            Your target {frequencyLabel} withdrawal of ${Number.parseFloat(withdrawalAmount).toLocaleString()} is too
            high for your current parameters. Try reducing the amount or check the advice below for suggestions.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Main Result */}
          <Card className="border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-400">
                    {sustainableWithdrawal.daysToReach === 0
                      ? "Ready Now!"
                      : `${sustainableWithdrawal.daysToReach} Days`}
                  </h3>
                </div>

                <div className="space-y-2">
                  <p className="text-lg text-green-700 dark:text-green-300">
                    {sustainableWithdrawal.daysToReach === 0
                      ? `You can start withdrawing $${formatCurrency(currentParams.targetWithdrawal)} ${frequencyLabel} immediately!`
                      : `You'll be able to withdraw $${formatCurrency(currentParams.targetWithdrawal)} ${frequencyLabel} starting on:`}
                  </p>

                  {sustainableWithdrawal.daysToReach > 0 && (
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-xl font-semibold text-green-800 dark:text-green-400">
                        {sustainableWithdrawal.startDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4 pt-4 border-t border-green-200 dark:border-green-700">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                  >
                    <PiggyBank className="h-3 w-3 mr-1" />
                    Forever Sustainable
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Capital Keeps Growing
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-base text-blue-800 dark:text-blue-400 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Required Balance:</span>
                  <span className="font-semibold text-blue-800 dark:text-blue-400">
                    ${formatCurrency(sustainableWithdrawal.balanceAtStart)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedFrequencyOption?.label} Growth:
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    +${formatCurrency(sustainableWithdrawal.periodGrowth)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedFrequencyOption?.label} Withdrawal:
                  </span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    -${formatCurrency(sustainableWithdrawal.periodWithdrawal)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200 dark:border-blue-700">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Net Growth:</span>
                  <span className="font-bold text-blue-800 dark:text-blue-400">
                    +${formatCurrency(sustainableWithdrawal.netPeriodGrowth)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-base text-purple-800 dark:text-purple-400 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Growth Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700 dark:text-purple-300">Current Balance:</span>
                  <span className="font-semibold text-purple-800 dark:text-purple-400">
                    ${formatCurrency(currentParams.initial)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700 dark:text-purple-300">Daily Growth Rate:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {(dailyGrowthRate * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700 dark:text-purple-300">Daily Income:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    +${formatCurrency(currentDailyIncome)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-purple-200 dark:border-purple-700">
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-400">Time to Target:</span>
                  <span className="font-bold text-purple-800 dark:text-purple-400">
                    {sustainableWithdrawal.daysToReach === 0 ? "Now" : `${sustainableWithdrawal.daysToReach} days`}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Advice Section */}
      {advice.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-lg text-orange-800 dark:text-orange-400 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Smart Advice & Tips
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Personalized recommendations based on your parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {advice.map((tip, index) => (
              <Alert
                key={index}
                className={`${
                  tip.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : tip.type === "warning"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      : tip.type === "info"
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                }`}
              >
                <div
                  className={`${
                    tip.type === "success"
                      ? "text-green-600 dark:text-green-400"
                      : tip.type === "warning"
                        ? "text-red-600 dark:text-red-400"
                        : tip.type === "info"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {tip.icon}
                </div>
                <AlertTitle
                  className={`${
                    tip.type === "success"
                      ? "text-green-800 dark:text-green-400"
                      : tip.type === "warning"
                        ? "text-red-800 dark:text-red-400"
                        : tip.type === "info"
                          ? "text-blue-800 dark:text-blue-400"
                          : "text-amber-800 dark:text-amber-400"
                  }`}
                >
                  {tip.title}
                </AlertTitle>
                <AlertDescription
                  className={`${
                    tip.type === "success"
                      ? "text-green-700 dark:text-green-500"
                      : tip.type === "warning"
                        ? "text-red-700 dark:text-red-500"
                        : tip.type === "info"
                          ? "text-blue-700 dark:text-blue-500"
                          : "text-amber-700 dark:text-amber-500"
                  }`}
                >
                  <div className="space-y-1">
                    <p>{tip.message}</p>
                    <p className="text-xs font-medium">{tip.suggestion}</p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
