"use client"

import { useState, useEffect, useMemo } from "react"
import { Calculator } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { MarqueeBanner } from "@/components/marquee-banner"
import { InvestmentForm } from "@/components/investment-form"
import { SummaryCards } from "@/components/summary-cards"
import { ResultsTable } from "@/components/results-table"
import { FormulaExplanation } from "@/components/formula-explanation"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type {
  CalculationRow,
  GroupedData,
  ViewMode,
  ResultsViewMode,
  WithdrawalFrequency,
  SustainableWithdrawal,
} from "@/types/trading"

export default function TradingCalculator() {
  // Use localStorage for persistent data
  const [initialAmount, setInitialAmount] = useLocalStorage<string>("trading-calc-initial-amount", "1000")
  const [numberOfSignals, setNumberOfSignals] = useLocalStorage<string>("trading-calc-signals", "2")
  const [percentageRate, setPercentageRate] = useLocalStorage<string>("trading-calc-percentage", "62")
  const [withdrawalAmount, setWithdrawalAmount] = useLocalStorage<string>("trading-calc-withdrawal", "2000")
  const [withdrawalFrequency, setWithdrawalFrequency] = useLocalStorage<WithdrawalFrequency>(
    "trading-calc-withdrawal-frequency",
    "weekly",
  )
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>("trading-calc-view-mode", "results")
  const [resultsViewMode, setResultsViewMode] = useLocalStorage<ResultsViewMode>(
    "trading-calc-results-view-mode",
    "monthly",
  )

  // Withdrawal calculator states
  const [desiredNetAmount, setDesiredNetAmount] = useLocalStorage<string>("trading-calc-net-amount", "1000")
  const [selectedWithdrawalMethod, setSelectedWithdrawalMethod] = useLocalStorage<string>(
    "trading-calc-withdrawal-method",
    "ach",
  )
  const [currentBalance, setCurrentBalance] = useLocalStorage<string>("trading-calc-current-balance", "")
  const [payFeesFromLwex, setPayFeesFromLwex] = useLocalStorage<boolean>("trading-calc-pay-fees-from-lwex", false)

  // Deadline date with localStorage - use empty string as default to detect if there's no stored value
  const [deadlineDateString, setDeadlineDateString] = useLocalStorage<string>("trading-calc-deadline-date", "")

  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>()
  const [isInitialized, setIsInitialized] = useState(false)

  // These don't need localStorage as they're temporary UI state
  const [results, setResults] = useState<CalculationRow[]>([])

  // Initialize deadline date from localStorage or set default
  useEffect(() => {
    if (!isInitialized) {
      if (deadlineDateString) {
        // If there's a stored date, use it
        setDeadlineDate(new Date(deadlineDateString))
      } else {
        // If no stored date, set default to 1 year from now
        const oneYearFromNow = new Date()
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
        setDeadlineDate(oneYearFromNow)
        setDeadlineDateString(oneYearFromNow.toISOString())
      }
      setIsInitialized(true)
    }
  }, [deadlineDateString, setDeadlineDateString, isInitialized])

  // Update localStorage when deadline date changes (but not during initialization)
  const handleDeadlineDateChange = (date: Date | undefined) => {
    setDeadlineDate(date)
    if (date && isInitialized) {
      setDeadlineDateString(date.toISOString())
    }
  }

  // Get max date (2 years from now)
  const maxDate = useMemo(() => {
    const twoYearsFromNow = new Date()
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2)
    return twoYearsFromNow
  }, [])

  // Calculate results
  const calculateResults = useMemo(() => {
    if (!initialAmount || !numberOfSignals || !percentageRate || !deadlineDate) return []

    const initial = Number.parseFloat(initialAmount)
    const signals = Number.parseInt(numberOfSignals)
    const percentage = Number.parseFloat(percentageRate) / 100
    const deadline = new Date(deadlineDate)
    const currentDate = new Date()

    if (initial <= 0 || signals < 1 || signals > 5 || percentage < 0.6 || percentage > 0.65 || deadline <= currentDate)
      return []

    const results: CalculationRow[] = []
    let currentAmount = initial
    const startDate = new Date(currentDate)

    // Calculate for each day from current date to deadline
    for (let date = new Date(startDate); date <= deadline; date.setDate(date.getDate() + 1)) {
      const dayNumber = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

      // Calculate daily increase: percentage of 1% of total amount × number of signals
      const dailyIncrease = currentAmount * 0.01 * percentage * signals
      currentAmount += dailyIncrease

      // Calculate bi-weekly period (every 15 days)
      const biWeeklyPeriod = Math.floor((dayNumber - 1) / 15) + 1

      results.push({
        date: new Date(date),
        day: dayNumber,
        month: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        biWeeklyPeriod,
        totalAmount: currentAmount,
        dailyIncrease,
      })
    }

    return results
  }, [initialAmount, numberOfSignals, percentageRate, deadlineDate])

  useEffect(() => {
    setResults(calculateResults)
  }, [calculateResults])

  // Group data based on results view mode
  const groupedData = useMemo(() => {
    if (resultsViewMode === "daily") return null

    const grouped: GroupedData[] = []
    const data = results

    if (data.length === 0) return grouped

    if (resultsViewMode === "biweekly") {
      const biweeklyGroups = new Map<number, CalculationRow[]>()

      data.forEach((row) => {
        const period = row.biWeeklyPeriod
        if (!biweeklyGroups.has(period)) {
          biweeklyGroups.set(period, [])
        }
        biweeklyGroups.get(period)!.push(row)
      })

      biweeklyGroups.forEach((rows, period) => {
        const sortedRows = rows.sort((a, b) => a.date.getTime() - b.date.getTime())
        const firstRow = sortedRows[0]
        const lastRow = sortedRows[sortedRows.length - 1]

        grouped.push({
          period: `Bi-weekly ${period}`,
          startDate: firstRow.date,
          endDate: lastRow.date,
          startAmount: firstRow.totalAmount - firstRow.dailyIncrease,
          endAmount: lastRow.totalAmount,
          totalIncrease: lastRow.totalAmount - (firstRow.totalAmount - firstRow.dailyIncrease),
          days: sortedRows.length,
        })
      })
    } else if (resultsViewMode === "monthly") {
      const monthlyGroups = new Map<string, CalculationRow[]>()

      data.forEach((row) => {
        const monthKey = row.month
        if (!monthlyGroups.has(monthKey)) {
          monthlyGroups.set(monthKey, [])
        }
        monthlyGroups.get(monthKey)!.push(row)
      })

      monthlyGroups.forEach((rows, monthKey) => {
        const sortedRows = rows.sort((a, b) => a.date.getTime() - b.date.getTime())
        const firstRow = sortedRows[0]
        const lastRow = sortedRows[sortedRows.length - 1]

        grouped.push({
          period: monthKey,
          startDate: firstRow.date,
          endDate: lastRow.date,
          startAmount: firstRow.totalAmount - firstRow.dailyIncrease,
          endAmount: lastRow.totalAmount,
          totalIncrease: lastRow.totalAmount - (firstRow.totalAmount - firstRow.dailyIncrease),
          days: sortedRows.length,
        })
      })
    }

    return grouped.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }, [results, resultsViewMode])

  // Calculate sustainable withdrawal analysis - CORRECTED VERSION
  const sustainableWithdrawal = useMemo((): SustainableWithdrawal | null => {
    if (!withdrawalAmount || !initialAmount || !numberOfSignals || !percentageRate) {
      return null
    }

    const initial = Number.parseFloat(initialAmount)
    const signals = Number.parseInt(numberOfSignals)
    const percentage = Number.parseFloat(percentageRate) / 100
    const targetWithdrawal = Number.parseFloat(withdrawalAmount)

    if (initial <= 0 || signals < 1 || signals > 5 || percentage < 0.6 || percentage > 0.65 || targetWithdrawal <= 0) {
      return null
    }

    // Calculate daily growth rate
    const dailyGrowthRate = 0.01 * percentage * signals

    // Get the number of days for the selected frequency
    const frequencyDays = (() => {
      switch (withdrawalFrequency) {
        case "daily":
          return 1
        case "weekly":
          return 7
        case "biweekly":
          return 14
        case "monthly":
          return 30
        default:
          return 7
      }
    })()

    // CORRECTED LOGIC: For truly sustainable withdrawals forever
    // We need a balance where after withdrawal, the remaining balance can still generate
    // the same withdrawal amount in the next period

    // Let's call the required balance B
    // Period growth = B * (compound growth over frequency days)
    // After withdrawal: remaining = B - targetWithdrawal
    // For sustainability: (B - targetWithdrawal) * periodGrowthRate >= targetWithdrawal

    // This means: B * periodGrowthRate - targetWithdrawal * periodGrowthRate >= targetWithdrawal
    // B * periodGrowthRate >= targetWithdrawal * (1 + periodGrowthRate)
    // B >= targetWithdrawal * (1 + periodGrowthRate) / periodGrowthRate

    const periodGrowthRate = Math.pow(1 + dailyGrowthRate, frequencyDays) - 1

    // Check if the growth rate is sufficient for any sustainable withdrawal
    if (periodGrowthRate <= 0) {
      return null
    }

    const requiredBalance = (targetWithdrawal * (1 + periodGrowthRate)) / periodGrowthRate

    // Now calculate how many days it takes to reach this balance
    let currentAmount = initial
    let days = 0
    const currentDate = new Date()

    // Check if we can already afford the withdrawal
    if (currentAmount >= requiredBalance) {
      const periodGrowth = currentAmount * periodGrowthRate
      return {
        startDate: new Date(currentDate),
        daysToReach: 0,
        balanceAtStart: currentAmount,
        periodGrowth,
        periodWithdrawal: targetWithdrawal,
        netPeriodGrowth: periodGrowth - targetWithdrawal,
        canSustainForever: true,
        withdrawalFrequency,
      }
    }

    // Calculate day by day until we reach the required balance
    while (currentAmount < requiredBalance && days < 3650) {
      // Max 10 years
      currentAmount = currentAmount * (1 + dailyGrowthRate)
      days++
    }

    if (days >= 3650) {
      return null // Takes too long
    }

    const startDate = new Date(currentDate)
    startDate.setDate(startDate.getDate() + days)

    const periodGrowth = requiredBalance * periodGrowthRate

    return {
      startDate,
      daysToReach: days,
      balanceAtStart: requiredBalance,
      periodGrowth,
      periodWithdrawal: targetWithdrawal,
      netPeriodGrowth: periodGrowth - targetWithdrawal,
      canSustainForever: periodGrowth >= targetWithdrawal,
      withdrawalFrequency,
    }
  }, [initialAmount, numberOfSignals, percentageRate, withdrawalAmount, withdrawalFrequency])

  const finalAmount = results.length > 0 ? results[results.length - 1].totalAmount : 0
  const totalGain = finalAmount - Number.parseFloat(initialAmount || "0")
  const totalDays = results.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Marquee Banner */}
      <MarqueeBanner />

      <div className="p-2 sm:p-4">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
            <div className="text-center space-y-1 sm:space-y-2 w-full sm:flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                Trading Calculator
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Calculate your trading returns with compound daily growth
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <ThemeToggle />
            </div>
          </div>

          {/* Investment Form */}
          <InvestmentForm
            initialAmount={initialAmount}
            setInitialAmount={setInitialAmount}
            numberOfSignals={numberOfSignals}
            setNumberOfSignals={setNumberOfSignals}
            percentageRate={percentageRate}
            setPercentageRate={setPercentageRate}
            deadlineDate={deadlineDate}
            setDeadlineDate={handleDeadlineDateChange}
            maxDate={maxDate}
          />

          {/* Summary Cards */}
          {results.length > 0 && (
            <SummaryCards
              initialAmount={initialAmount}
              finalAmount={finalAmount}
              totalGain={totalGain}
              totalDays={totalDays}
              sustainableWithdrawal={sustainableWithdrawal}
            />
          )}

          {/* Results Table */}
          <ResultsTable
            results={results}
            groupedData={groupedData}
            viewMode={viewMode}
            setViewMode={setViewMode}
            resultsViewMode={resultsViewMode}
            setResultsViewMode={setResultsViewMode}
            numberOfSignals={numberOfSignals}
            percentageRate={percentageRate}
            initialAmount={initialAmount}
            withdrawalAmount={withdrawalAmount}
            setWithdrawalAmount={setWithdrawalAmount}
            withdrawalFrequency={withdrawalFrequency}
            setWithdrawalFrequency={setWithdrawalFrequency}
            sustainableWithdrawal={sustainableWithdrawal}
            desiredNetAmount={desiredNetAmount}
            setDesiredNetAmount={setDesiredNetAmount}
            selectedWithdrawalMethod={selectedWithdrawalMethod}
            setSelectedWithdrawalMethod={setSelectedWithdrawalMethod}
            currentBalance={currentBalance}
            setCurrentBalance={setCurrentBalance}
            payFeesFromLwex={payFeesFromLwex}
            setPayFeesFromLwex={setPayFeesFromLwex}
          />

          {/* Formula Explanation */}
          <FormulaExplanation
            numberOfSignals={numberOfSignals}
            percentageRate={percentageRate}
            sustainableWithdrawal={sustainableWithdrawal}
          />

          {/* Footer Banner */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Thanks LWex Commander Anthony</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
