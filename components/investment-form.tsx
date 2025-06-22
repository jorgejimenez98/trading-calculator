"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp } from "lucide-react"

interface InvestmentFormProps {
  initialAmount: string
  setInitialAmount: (value: string) => void
  numberOfSignals: string
  setNumberOfSignals: (value: string) => void
  percentageRate: string
  setPercentageRate: (value: string) => void
  deadlineDate: Date | undefined
  setDeadlineDate: (date: Date | undefined) => void
  maxDate: Date
}

export function InvestmentForm({
  initialAmount,
  setInitialAmount,
  numberOfSignals,
  setNumberOfSignals,
  percentageRate,
  setPercentageRate,
  deadlineDate,
  setDeadlineDate,
  maxDate,
}: InvestmentFormProps) {
  return (
    <Card className="shadow-lg border-gray-200 dark:border-gray-700">
      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg sm:text-xl">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
          Investment Parameters
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
          Enter your initial investment details to calculate potential returns
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="initial-amount" className="text-gray-700 dark:text-gray-300 text-sm">
              Initial Amount (USD)
            </Label>
            <Input
              id="initial-amount"
              type="number"
              placeholder="1000"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              min="1"
              step="0.01"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="signals" className="text-gray-700 dark:text-gray-300 text-sm">
              Number of Signals
            </Label>
            <Select value={numberOfSignals} onValueChange={setNumberOfSignals}>
              <SelectTrigger id="signals" className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select signals" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                <SelectItem value="1" className="dark:text-white dark:focus:bg-gray-700">
                  1 Signal
                </SelectItem>
                <SelectItem value="2" className="dark:text-white dark:focus:bg-gray-700">
                  2 Signals
                </SelectItem>
                <SelectItem value="3" className="dark:text-white dark:focus:bg-gray-700">
                  3 Signals
                </SelectItem>
                <SelectItem value="4" className="dark:text-white dark:focus:bg-gray-700">
                  4 Signals
                </SelectItem>
                <SelectItem value="5" className="dark:text-white dark:focus:bg-gray-700">
                  5 Signals
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="percentage-rate" className="text-gray-700 dark:text-gray-300 text-sm">
              Percentage Rate (%)
            </Label>
            <Input
              id="percentage-rate"
              type="number"
              placeholder="62"
              value={percentageRate}
              onChange={(e) => setPercentageRate(e.target.value)}
              min="60"
              max="65"
              step="0.1"
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="deadline" className="text-gray-700 dark:text-gray-300 text-sm">
              Deadline Date
            </Label>
            <input
              id="deadline"
              type="date"
              value={deadlineDate ? deadlineDate.toISOString().split("T")[0] : ""}
              onChange={(e) => {
                if (e.target.value) {
                  setDeadlineDate(new Date(e.target.value + "T00:00:00"))
                } else {
                  setDeadlineDate(undefined)
                }
              }}
              min={new Date().toISOString().split("T")[0]}
              max={maxDate.toISOString().split("T")[0]}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
