"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { SustainableWithdrawal } from "@/types/trading"

interface SummaryCardsProps {
  initialAmount: string
  finalAmount: number
  totalGain: number
  totalDays: number
  sustainableWithdrawal: SustainableWithdrawal | null
}

export function SummaryCards({
  initialAmount,
  finalAmount,
  totalGain,
  totalDays,
  sustainableWithdrawal,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
            ${Number.parseFloat(initialAmount).toLocaleString()}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Initial Amount</p>
        </CardContent>
      </Card>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Final Amount</p>
        </CardContent>
      </Card>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
            ${totalGain.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Gain</p>
        </CardContent>
      </Card>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-3 sm:p-4">
          <div className="text-lg sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{totalDays}</div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Days</p>
        </CardContent>
      </Card>
    </div>
  )
}
