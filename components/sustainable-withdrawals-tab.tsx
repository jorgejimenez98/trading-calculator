"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  PiggyBank,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  ArrowRight,
  Info,
  Calculator,
  Star,
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

interface SustainableWithdrawalsTabProps {
  initialAmount: string
  numberOfSignals: string
  percentageRate: string
  withdrawalAmount: string
  setWithdrawalAmount: (value: string) => void
  withdrawalFrequency: WithdrawalFrequency
  setWithdrawalFrequency: (value: WithdrawalFrequency) => void
  sustainableWithdrawal: SustainableWithdrawal | null
}

export function SustainableWithdrawalsTab({
  initialAmount,
  numberOfSignals,
  percentageRate,
  withdrawalAmount,
  setWithdrawalAmount,
  withdrawalFrequency,
  setWithdrawalFrequency,
  sustainableWithdrawal,
}: SustainableWithdrawalsTabProps) {
  const selectedFrequencyOption = withdrawalFrequencyOptions.find((option) => option.value === withdrawalFrequency)
  const frequencyLabel = selectedFrequencyOption?.label.toLowerCase() || "weekly"

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    const fixedAmount = amount === 0 ? 0 : amount
    return fixedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  // Calculate current growth metrics for context
  const currentMetrics = () => {
    const initial = Number.parseFloat(initialAmount || "0")
    const signals = Number.parseInt(numberOfSignals || "0")
    const percentage = Number.parseFloat(percentageRate || "0") / 100

    if (initial <= 0 || signals < 1 || percentage <= 0) return null

    const dailyGrowthRate = 0.01 * percentage * signals
    const frequencyDays = selectedFrequencyOption?.days || 7
    const periodGrowthRate = Math.pow(1 + dailyGrowthRate, frequencyDays) - 1
    const currentPeriodIncome = initial * periodGrowthRate

    return {
      dailyGrowthRate: dailyGrowthRate * 100,
      periodGrowthRate: periodGrowthRate * 100,
      currentPeriodIncome,
      frequencyDays,
    }
  }

  const metrics = currentMetrics()

  return (
    <div className="space-y-6 mt-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Withdrawal Parameters */}
        <div>
          <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    Withdrawal Parameters
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">
                    Set your target withdrawal amount and frequency
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-amount" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Withdrawal Amount (USD)
                  </Label>
                  <Input
                    id="withdrawal-amount"
                    type="number"
                    placeholder="8000"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    min="1"
                    step="0.01"
                    className="h-11 text-base font-medium dark:bg-slate-800 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Amount you want to withdraw each {frequencyLabel}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="withdrawal-frequency"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Withdrawal Frequency
                  </Label>
                  <Select value={withdrawalFrequency} onValueChange={setWithdrawalFrequency}>
                    <SelectTrigger
                      id="withdrawal-frequency"
                      className="h-11 dark:bg-slate-800 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-600">
                      {withdrawalFrequencyOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="dark:text-white dark:focus:bg-slate-700"
                        >
                          <div className="font-medium">{option.label}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 dark:text-slate-400">How often you want to withdraw</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      {!withdrawalAmount || withdrawalAmount === "0" ? (
        <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-200 font-semibold">Enter withdrawal amount</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            Please enter the amount you want to withdraw {frequencyLabel} to see when you can start sustainable
            withdrawals.
          </AlertDescription>
        </Alert>
      ) : !sustainableWithdrawal ? (
        <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-200 font-semibold">Withdrawal amount too high</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300">
            Your target {frequencyLabel} withdrawal of ${Number.parseFloat(withdrawalAmount).toLocaleString()} is too
            high for sustainable withdrawals with your current parameters. Try reducing the amount or increasing your
            initial investment.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Main Result Card - Compact Version */}
          <Card className="border-slate-200 dark:border-slate-700 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 relative overflow-hidden">
            {/* Result Badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700">
                <Star className="h-3 w-3 mr-1" />
                Final Result
              </Badge>
            </div>

            <CardContent className="p-5">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  {sustainableWithdrawal.daysToReach === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {sustainableWithdrawal.daysToReach === 0
                        ? "Ready Now!"
                        : `${sustainableWithdrawal.daysToReach} Days`}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">
                      {sustainableWithdrawal.daysToReach === 0
                        ? "Start withdrawing today"
                        : "Until sustainable withdrawals"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {sustainableWithdrawal.daysToReach === 0
                      ? `You can start withdrawing $${formatCurrency(Number.parseFloat(withdrawalAmount))} ${frequencyLabel} immediately!`
                      : `You'll be able to withdraw $${formatCurrency(Number.parseFloat(withdrawalAmount))} ${frequencyLabel} starting:`}
                  </p>

                  {sustainableWithdrawal.daysToReach > 0 && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-base font-semibold text-slate-900 dark:text-white">
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

                <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 text-xs"
                  >
                    <Target className="h-3 w-3 mr-1" />
                    Forever Sustainable
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 text-xs"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Capital Keeps Growing
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    Financial Breakdown
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Required Balance:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${formatCurrency(sustainableWithdrawal.balanceAtStart)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm text-green-700 dark:text-green-300">
                      {selectedFrequencyOption?.label} Growth:
                    </span>
                    <span className="font-semibold text-green-800 dark:text-green-200">
                      +${formatCurrency(sustainableWithdrawal.periodGrowth)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm text-red-700 dark:text-red-300">
                      {selectedFrequencyOption?.label} Withdrawal:
                    </span>
                    <span className="font-semibold text-red-800 dark:text-red-200">
                      -${formatCurrency(sustainableWithdrawal.periodWithdrawal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Net Growth:</span>
                    <span className="font-bold text-blue-900 dark:text-blue-100">
                      +${formatCurrency(sustainableWithdrawal.netPeriodGrowth)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    Timeline Details
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Balance:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${formatCurrency(Number.parseFloat(initialAmount || "0"))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Daily Growth Rate:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {metrics ? metrics.dailyGrowthRate.toFixed(2) : "0"}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Growth Needed:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${formatCurrency(sustainableWithdrawal.balanceAtStart - Number.parseFloat(initialAmount || "0"))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Days to Target:</span>
                    <span className="font-bold text-purple-900 dark:text-purple-100">
                      {sustainableWithdrawal.daysToReach === 0 ? "Now" : `${sustainableWithdrawal.daysToReach} days`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works Section */}
          <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Calculator className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">How It Works</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Understanding sustainable withdrawal strategy
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Sustainable Strategy</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    For withdrawals to be sustainable forever, your account must generate enough income each{" "}
                    {frequencyLabel} to cover the withdrawal amount while continuing to grow.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">The Calculation</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Formula: Current Amount × 1% × {percentageRate}% × {numberOfSignals} signals = Daily Growth
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Your {frequencyLabel} growth must equal or exceed $
                    {formatCurrency(Number.parseFloat(withdrawalAmount || "0"))} for sustainability.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">What Happens Next</h4>
                  <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <li>
                      • Generate ${formatCurrency(sustainableWithdrawal.periodGrowth)} every {frequencyLabel}
                    </li>
                    <li>
                      • Withdraw ${formatCurrency(sustainableWithdrawal.periodWithdrawal)} every {frequencyLabel}
                    </li>
                    <li>
                      • Net growth: ${formatCurrency(sustainableWithdrawal.netPeriodGrowth)} per {frequencyLabel}
                    </li>
                    <li>• Process continues indefinitely with growing wealth</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
