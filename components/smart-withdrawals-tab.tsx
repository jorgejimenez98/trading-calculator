"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  TrendingUp,
  Calendar,
  AlertCircle,
  Lightbulb,
  Target,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
} from "lucide-react"
import type { WithdrawalFrequency, WithdrawalFrequencyOption } from "@/types/trading"

const withdrawalFrequencyOptions: WithdrawalFrequencyOption[] = [
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

interface SmartWithdrawalsTabProps {
  initialAmount: string
  numberOfSignals: string
  percentageRate: string
  smartWithdrawalFrequency: WithdrawalFrequency
  setSmartWithdrawalFrequency: (frequency: WithdrawalFrequency) => void
  withdrawalStrategy: any
  setWithdrawalStrategy: any
  fixedWithdrawalAmount: any
  setFixedWithdrawalAmount: any
  withdrawalPercentage: any
  setWithdrawalPercentage: any
  projectionPeriods: any
  setProjectionPeriods: any
}

export function SmartWithdrawalsTab({
  initialAmount,
  numberOfSignals,
  percentageRate,
  smartWithdrawalFrequency,
  setSmartWithdrawalFrequency,
}: SmartWithdrawalsTabProps) {
  // Calculate smart recommendations
  const smartRecommendation = () => {
    const initial = Number.parseFloat(initialAmount || "0")
    const signals = Number.parseInt(numberOfSignals || "0")
    const percentage = Number.parseFloat(percentageRate || "0") / 100

    if (initial <= 0 || signals < 1 || percentage <= 0) return null

    const dailyGrowthRate = 0.01 * percentage * signals
    const frequencyDays = withdrawalFrequencyOptions.find((f) => f.value === smartWithdrawalFrequency)?.days || 7
    const periodGrowthRate = Math.pow(1 + dailyGrowthRate, frequencyDays) - 1

    // Calculate optimal withdrawal percentage (conservative approach)
    // We want to withdraw less than the growth to ensure continuous growth
    const maxSafeWithdrawal = periodGrowthRate * 0.8 // 80% of growth to maintain buffer
    const recommendedPercentage = Math.min(maxSafeWithdrawal * 100, 15) // Cap at 15%

    // Calculate when to start (when balance reaches a minimum threshold)
    const minimumBalanceMultiplier = 2 // Start when balance is at least 2x initial
    const minimumBalance = initial * minimumBalanceMultiplier

    let currentBalance = initial
    let daysToStart = 0

    // Calculate days until we reach minimum balance
    while (currentBalance < minimumBalance && daysToStart < 365) {
      currentBalance = currentBalance * (1 + dailyGrowthRate)
      daysToStart++
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() + daysToStart)

    // Calculate projections
    const withdrawalAmount = currentBalance * (recommendedPercentage / 100)
    const netGrowthAfterWithdrawal = currentBalance * periodGrowthRate - withdrawalAmount
    const monthlyIncome = (withdrawalAmount * 30) / frequencyDays

    return {
      recommendedPercentage: Math.max(recommendedPercentage, 1), // Minimum 1%
      daysToStart,
      startDate,
      startBalance: currentBalance,
      withdrawalAmount,
      netGrowthAfterWithdrawal,
      monthlyIncome,
      periodGrowthRate: periodGrowthRate * 100,
      isReadyNow: daysToStart === 0,
      frequencyLabel: withdrawalFrequencyOptions.find((f) => f.value === smartWithdrawalFrequency)?.label || "Weekly",
    }
  }

  const recommendation = smartRecommendation()
  const selectedFrequencyOption = withdrawalFrequencyOptions.find((f) => f.value === smartWithdrawalFrequency)

  return (
    <div className="space-y-4 mt-4">
      {/* Compact Configuration */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-lg text-purple-900 dark:text-purple-100">Smart Withdrawal Strategy</CardTitle>
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200"
            >
              AI Recommended
            </Badge>
          </div>
          <CardDescription className="text-purple-700 dark:text-purple-300 text-sm">
            Get personalized recommendations for sustainable withdrawals based on your growth parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="smart-frequency" className="text-purple-800 dark:text-purple-300 text-sm font-medium">
                Preferred Withdrawal Frequency
              </Label>
              <Select value={smartWithdrawalFrequency} onValueChange={setSmartWithdrawalFrequency}>
                <SelectTrigger
                  id="smart-frequency"
                  className="mt-1 border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      {!recommendation ? (
        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">Complete Investment Parameters</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-500">
            Please fill in the initial investment parameters to get personalized withdrawal recommendations.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Main Recommendation Card */}
          <Card
            className={`border-2 ${recommendation.isReadyNow ? "border-green-300 dark:border-green-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" : "border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"}`}
          >
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  {recommendation.isReadyNow ? (
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  )}
                  <h3
                    className={`text-2xl font-bold ${recommendation.isReadyNow ? "text-green-800 dark:text-green-400" : "text-blue-800 dark:text-blue-400"}`}
                  >
                    {recommendation.isReadyNow ? "Start Now!" : `Wait ${recommendation.daysToStart} Days`}
                  </h3>
                </div>

                <div className="space-y-2">
                  <p
                    className={`text-lg ${recommendation.isReadyNow ? "text-green-700 dark:text-green-300" : "text-blue-700 dark:text-blue-300"}`}
                  >
                    {recommendation.isReadyNow
                      ? `Start withdrawing ${recommendation.recommendedPercentage.toFixed(1)}% ${selectedFrequencyOption?.label.toLowerCase()} now!`
                      : `Start withdrawing ${recommendation.recommendedPercentage.toFixed(1)}% ${selectedFrequencyOption?.label.toLowerCase()} on:`}
                  </p>

                  {!recommendation.isReadyNow && (
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xl font-semibold text-blue-800 dark:text-blue-400">
                        {recommendation.startDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${recommendation.withdrawalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Per {selectedFrequencyOption?.label.toLowerCase()}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${recommendation.monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Income</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-400">Safe Rate</span>
                </div>
                <div className="text-2xl font-bold text-green-800 dark:text-green-400">
                  {recommendation.recommendedPercentage.toFixed(1)}%
                </div>
                <p className="text-xs text-green-600 dark:text-green-500">Withdrawal percentage</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Growth Rate</span>
                </div>
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                  {recommendation.periodGrowthRate.toFixed(1)}%
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-500">
                  Per {selectedFrequencyOption?.label.toLowerCase()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-400">Start Balance</span>
                </div>
                <div className="text-2xl font-bold text-purple-800 dark:text-purple-400">
                  ${recommendation.startBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-500">Required to start</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-400">Net Growth</span>
                </div>
                <div className="text-2xl font-bold text-orange-800 dark:text-orange-400">
                  ${recommendation.netGrowthAfterWithdrawal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-500">After withdrawal</p>
              </CardContent>
            </Card>
          </div>

          {/* Smart Insights */}
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Smart Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-400">Optimal Timing</p>
                    <p className="text-xs text-green-700 dark:text-green-500 mt-1">
                      {recommendation.isReadyNow
                        ? "Your balance is already sufficient to start sustainable withdrawals."
                        : `Wait ${recommendation.daysToStart} days for your balance to grow to $${recommendation.startBalance.toLocaleString()} for optimal sustainability.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Conservative Approach</p>
                    <p className="text-xs text-blue-700 dark:text-blue-500 mt-1">
                      The recommended {recommendation.recommendedPercentage.toFixed(1)}% withdrawal rate is 80% of your{" "}
                      {selectedFrequencyOption?.label.toLowerCase()} growth rate, ensuring your capital continues
                      growing even after withdrawals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-400">Sustainable Forever</p>
                    <p className="text-xs text-purple-700 dark:text-purple-500 mt-1">
                      With this strategy, you'll have ${recommendation.netGrowthAfterWithdrawal.toLocaleString()} net
                      growth per {selectedFrequencyOption?.label.toLowerCase()}, meaning your wealth keeps increasing
                      while providing regular income.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
