"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SustainableWithdrawal } from "@/types/trading"

interface FormulaExplanationProps {
  numberOfSignals: string
  percentageRate: string
  sustainableWithdrawal: SustainableWithdrawal | null
}

export function FormulaExplanation({
  numberOfSignals,
  percentageRate,
  sustainableWithdrawal,
}: FormulaExplanationProps) {
  return (
    <Card className="shadow-lg border-gray-200 dark:border-gray-700">
      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-gray-900 dark:text-white text-lg sm:text-xl">Calculation Formula</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-1 sm:space-y-2">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          <strong>Daily Increase Formula:</strong> Current Amount × 1% × {percentageRate}% × Number of Signals
        </p>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          <strong>Example:</strong> If you have $1,000 with {numberOfSignals} signals at {percentageRate}%: $1,000 ×
          0.01 × {Number.parseFloat(percentageRate) / 100} × {numberOfSignals} = $
          {(1000 * 0.01 * (Number.parseFloat(percentageRate) / 100) * Number.parseInt(numberOfSignals)).toFixed(2)}{" "}
          daily increase
        </p>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          The calculation compounds daily, meaning each day's increase is added to the total before calculating the next
          day's increase.
        </p>
      </CardContent>
    </Card>
  )
}
