"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PiggyBank, AlertCircle, Clock, DollarSign, ArrowDownToLine, Calendar } from "lucide-react"
import type { SustainableWithdrawal, WithdrawalFrequency, WithdrawalFrequencyOption } from "@/types/trading"

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

interface WithdrawalsTabProps {
  withdrawalAmount: string
  setWithdrawalAmount: (value: string) => void
  withdrawalFrequency: WithdrawalFrequency
  setWithdrawalFrequency: (value: WithdrawalFrequency) => void
  sustainableWithdrawal: SustainableWithdrawal | null
}

export function WithdrawalsTab({
  withdrawalAmount,
  setWithdrawalAmount,
  withdrawalFrequency,
  setWithdrawalFrequency,
  sustainableWithdrawal,
}: WithdrawalsTabProps) {
  const selectedFrequencyOption = withdrawalFrequencyOptions.find((option) => option.value === withdrawalFrequency)
  const frequencyLabel = selectedFrequencyOption?.label.toLowerCase() || "weekly"

  // Helper function to format currency and handle negative zero
  const formatCurrency = (amount: number): string => {
    // Fix negative zero issue
    const fixedAmount = amount === 0 ? 0 : amount
    return fixedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  return (
    <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
      {/* Sustainable Withdrawal Analysis Input Section */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">
                Sustainable Withdrawal Analysis
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="withdrawal-amount" className="text-gray-700 dark:text-gray-300 text-sm">
                  Target {selectedFrequencyOption?.label} Withdrawal Amount (USD)
                </Label>
                <Input
                  id="withdrawal-amount"
                  type="number"
                  placeholder="2000"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="withdrawal-frequency" className="text-gray-700 dark:text-gray-300 text-sm">
                  Withdrawal Frequency
                </Label>
                <Select value={withdrawalFrequency} onValueChange={setWithdrawalFrequency}>
                  <SelectTrigger
                    id="withdrawal-frequency"
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              The app will calculate when you can start withdrawing this amount {frequencyLabel} forever
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sustainable Withdrawal Analysis Section */}
      {!withdrawalAmount || withdrawalAmount === "0" ? (
        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">Enter a withdrawal amount</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-500">
            Please enter a target {frequencyLabel} withdrawal amount to see when you can start withdrawing.
          </AlertDescription>
        </Alert>
      ) : !sustainableWithdrawal ? (
        <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-400">Sustainable withdrawal not possible</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-500">
            With your current parameters, sustainable {frequencyLabel} withdrawals of $
            {Number.parseFloat(withdrawalAmount).toLocaleString()} are not achievable within 10 years. Try reducing the
            withdrawal amount or increasing your initial investment.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-400">Sustainable Withdrawal Analysis</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-500">
              {sustainableWithdrawal.daysToReach === 0
                ? `You can start withdrawing $${Number.parseFloat(withdrawalAmount).toLocaleString()} ${frequencyLabel} immediately!`
                : `You can start withdrawing $${Number.parseFloat(withdrawalAmount).toLocaleString()} ${frequencyLabel} starting ${sustainableWithdrawal.startDate.toLocaleDateString()} (in ${sustainableWithdrawal.daysToReach} days).`}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Card className="border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-3 sm:p-4">
                <h4 className="text-sm sm:text-base font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Analysis
                </h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-500">Required balance:</span>
                    <span className="font-medium text-blue-800 dark:text-blue-400">
                      ${formatCurrency(sustainableWithdrawal.balanceAtStart)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-500">{selectedFrequencyOption?.label} growth:</span>
                    <span className="font-medium text-blue-800 dark:text-blue-400">
                      ${formatCurrency(sustainableWithdrawal.periodGrowth)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-500">
                      {selectedFrequencyOption?.label} withdrawal:
                    </span>
                    <span className="font-medium text-blue-800 dark:text-blue-400">
                      ${formatCurrency(sustainableWithdrawal.periodWithdrawal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-500">Net {frequencyLabel} growth:</span>
                    <span className="font-medium text-blue-800 dark:text-blue-400">
                      ${formatCurrency(sustainableWithdrawal.netPeriodGrowth)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-3 sm:p-4">
                <h4 className="text-sm sm:text-base font-medium text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                  <ArrowDownToLine className="h-4 w-4" />
                  Withdrawal Strategy
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-green-700 dark:text-green-500">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Your account will generate ${formatCurrency(sustainableWithdrawal.periodGrowth)} {frequencyLabel},
                      allowing you to withdraw ${formatCurrency(sustainableWithdrawal.periodWithdrawal)} forever.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Your balance will continue growing by ${formatCurrency(sustainableWithdrawal.netPeriodGrowth)} net
                      per{" "}
                      {withdrawalFrequency === "biweekly" ? "bi-weekly period" : withdrawalFrequency.replace("ly", "")}{" "}
                      even after withdrawals.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      This strategy ensures your withdrawals are completely sustainable and your capital keeps growing.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">
                Sustainable Withdrawal Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Start Date</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {sustainableWithdrawal.startDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {sustainableWithdrawal.daysToReach === 0
                        ? "Ready Now"
                        : `${sustainableWithdrawal.daysToReach} Days`}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {sustainableWithdrawal.daysToReach === 0 ? "You can start immediately" : "Time to reach target"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-400">
                      {selectedFrequencyOption?.label} Income
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500">Sustainable forever</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-800 dark:text-green-400">
                      ${formatCurrency(sustainableWithdrawal.periodWithdrawal)}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500">Withdrawal amount</p>
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
