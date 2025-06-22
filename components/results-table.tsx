"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3 } from "lucide-react"
import { FeeCalculatorTab } from "@/components/fee-calculator-tab"
import { SustainableWithdrawalsTab } from "@/components/sustainable-withdrawals-tab"
import type {
  CalculationRow,
  GroupedData,
  ViewMode,
  ResultsViewMode,
  SustainableWithdrawal,
  WithdrawalFrequency,
  ResultsViewOption,
  WithdrawalStrategy,
} from "@/types/trading"

const resultsViewOptions: ResultsViewOption[] = [
  {
    value: "daily",
    label: "Daily View",
    description: "Show daily calculations",
  },
  {
    value: "biweekly",
    label: "Bi-weekly View",
    description: "Show bi-weekly summaries",
  },
  {
    value: "monthly",
    label: "Monthly View",
    description: "Show monthly summaries",
  },
]

interface ResultsTableProps {
  results: CalculationRow[]
  groupedData: GroupedData[] | null
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  resultsViewMode: ResultsViewMode
  setResultsViewMode: (mode: ResultsViewMode) => void
  numberOfSignals: string
  percentageRate: string
  initialAmount: string
  withdrawalAmount: string
  setWithdrawalAmount: (value: string) => void
  withdrawalFrequency: WithdrawalFrequency
  setWithdrawalFrequency: (value: WithdrawalFrequency) => void
  sustainableWithdrawal: SustainableWithdrawal | null
  desiredNetAmount: string
  setDesiredNetAmount: (value: string) => void
  selectedWithdrawalMethod: string
  setSelectedWithdrawalMethod: (value: string) => void
  currentBalance: string
  setCurrentBalance: (value: string) => void
  payFeesFromLwex: boolean
  setPayFeesFromLwex: (value: boolean) => void
  withdrawalStrategy: WithdrawalStrategy
  setWithdrawalStrategy: (strategy: WithdrawalStrategy) => void
  fixedWithdrawalAmount: string
  setFixedWithdrawalAmount: (amount: string) => void
  withdrawalPercentage: number
  setWithdrawalPercentage: (percentage: number) => void
  smartWithdrawalFrequency: WithdrawalFrequency
  setSmartWithdrawalFrequency: (frequency: WithdrawalFrequency) => void
  projectionPeriods: number
  setProjectionPeriods: (periods: number) => void
}

export function ResultsTable({
  results,
  groupedData,
  viewMode,
  setViewMode,
  resultsViewMode,
  setResultsViewMode,
  numberOfSignals,
  percentageRate,
  initialAmount,
  withdrawalAmount,
  setWithdrawalAmount,
  withdrawalFrequency,
  setWithdrawalFrequency,
  sustainableWithdrawal,
  desiredNetAmount,
  setDesiredNetAmount,
  selectedWithdrawalMethod,
  setSelectedWithdrawalMethod,
  currentBalance,
  setCurrentBalance,
  payFeesFromLwex,
  setPayFeesFromLwex,
  withdrawalStrategy,
  setWithdrawalStrategy,
  fixedWithdrawalAmount,
  setFixedWithdrawalAmount,
  withdrawalPercentage,
  setWithdrawalPercentage,
  smartWithdrawalFrequency,
  setSmartWithdrawalFrequency,
  projectionPeriods,
  setProjectionPeriods,
}: ResultsTableProps) {
  if (results.length === 0) return null

  return (
    <Card className="shadow-lg border-gray-200 dark:border-gray-700">
      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
        <div>
          <CardTitle className="text-gray-900 dark:text-white text-lg sm:text-xl">
            {viewMode === "withdrawal-calculator"
              ? "Withdrawal Calculator"
              : viewMode === "sustainable-withdrawals"
                ? "Sustainable Withdrawals"
                : "Calculation Results"}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
            {viewMode === "withdrawal-calculator"
              ? "Calculate exact withdrawal amounts including all fees"
              : viewMode === "sustainable-withdrawals"
                ? "Calculate when you can start sustainable withdrawals forever"
                : `Daily compound growth with ${numberOfSignals} signal${Number.parseInt(numberOfSignals) > 1 ? "s" : ""} at ${percentageRate}% rate`}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-4 space-y-3 sm:space-y-4">
        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800 h-auto">
            <TabsTrigger
              value="results"
              className="dark:text-white dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2"
            >
              <span className="hidden sm:inline">Results</span>
              <span className="sm:hidden">Results</span>
            </TabsTrigger>
            <TabsTrigger
              value="sustainable-withdrawals"
              className="dark:text-white dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2"
            >
              <span className="hidden sm:inline">Sustainable</span>
              <span className="sm:hidden">Sustainable</span>
            </TabsTrigger>
            <TabsTrigger
              value="withdrawal-calculator"
              className="dark:text-white dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2"
            >
              <span className="hidden sm:inline">Fee Calculator</span>
              <span className="sm:hidden">Fees</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            {/* Results View Selector */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-end">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <Label className="text-gray-700 dark:text-gray-300 text-sm font-medium">View Mode:</Label>
              </div>
              <Select value={resultsViewMode} onValueChange={setResultsViewMode}>
                <SelectTrigger className="w-full sm:w-fit dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select view mode" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                  {resultsViewOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="dark:text-white dark:focus:bg-gray-700"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Table */}
            <div className="overflow-auto border rounded-lg border-gray-200 dark:border-gray-600">
              <div className="max-h-[50vh] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white dark:bg-gray-800">
                    <TableRow className="border-gray-200 dark:border-gray-600">
                      {resultsViewMode === "daily" ? (
                        <>
                          <TableHead className="dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3">Date</TableHead>
                          <TableHead className="dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3">Day</TableHead>
                          <TableHead className="dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3 hidden sm:table-cell">
                            Month
                          </TableHead>
                          <TableHead className="dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3 hidden sm:table-cell">
                            Bi-Weekly
                          </TableHead>
                          <TableHead className="text-right dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3">
                            Daily Inc.
                          </TableHead>
                          <TableHead className="text-right dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3">
                            Total
                          </TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3">
                            {resultsViewMode === "monthly" ? "Month" : "Period"}
                          </TableHead>
                          <TableHead className="dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3 hidden sm:table-cell">
                            Start Date
                          </TableHead>
                          <TableHead className="dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3 hidden sm:table-cell">
                            End Date
                          </TableHead>
                          <TableHead className="dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3">Days</TableHead>
                          <TableHead className="text-right dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3 hidden sm:table-cell">
                            Initial
                          </TableHead>
                          <TableHead className="text-right dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3">
                            Final
                          </TableHead>
                          <TableHead className="text-right dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3">
                            Increase
                          </TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultsViewMode === "daily"
                      ? results.map((row, index) => (
                          <TableRow
                            key={index}
                            className={`border-gray-200 dark:border-gray-600 ${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : "dark:bg-gray-900/50"}`}
                          >
                            <TableCell className="font-medium dark:text-white text-xs sm:text-sm py-1.5 sm:py-3">
                              {row.date.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="dark:text-gray-300 text-xs sm:text-sm py-1.5 sm:py-3">
                              {row.day}
                            </TableCell>
                            <TableCell className="dark:text-gray-300 text-xs sm:text-sm py-1.5 sm:py-3 hidden sm:table-cell">
                              {row.month}
                            </TableCell>
                            <TableCell className="dark:text-gray-300 text-xs sm:text-sm py-1.5 sm:py-3 hidden sm:table-cell">
                              {row.biWeeklyPeriod}
                            </TableCell>
                            <TableCell className="text-right text-green-600 dark:text-green-400 text-xs sm:text-sm py-1.5 sm:py-3">
                              +${row.dailyIncrease.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-semibold dark:text-white text-xs sm:text-sm py-1.5 sm:py-3">
                              ${row.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        ))
                      : groupedData?.map((row, index) => (
                          <TableRow
                            key={index}
                            className={`border-gray-200 dark:border-gray-600 ${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : "dark:bg-gray-900/50"}`}
                          >
                            <TableCell className="font-medium dark:text-white text-xs sm:text-sm py-1.5 sm:py-3">
                              {row.period}
                            </TableCell>
                            <TableCell className="dark:text-gray-300 text-xs sm:text-sm py-1.5 sm:py-3 hidden sm:table-cell">
                              {row.startDate.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="dark:text-gray-300 text-xs sm:text-sm py-1.5 sm:py-3 hidden sm:table-cell">
                              {row.endDate.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="dark:text-gray-300 text-xs sm:text-sm py-1.5 sm:py-3">
                              {row.days}
                            </TableCell>
                            <TableCell className="text-right dark:text-gray-300 text-xs sm:text-sm py-1.5 sm:py-3 hidden sm:table-cell">
                              ${row.startAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right font-semibold dark:text-white text-xs sm:text-sm py-1.5 sm:py-3">
                              ${row.endAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right text-green-600 dark:text-green-400 text-xs sm:text-sm py-1.5 sm:py-3">
                              +${row.totalIncrease.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sustainable-withdrawals">
            <SustainableWithdrawalsTab
              initialAmount={initialAmount}
              numberOfSignals={numberOfSignals}
              percentageRate={percentageRate}
              withdrawalAmount={withdrawalAmount}
              setWithdrawalAmount={setWithdrawalAmount}
              withdrawalFrequency={withdrawalFrequency}
              setWithdrawalFrequency={setWithdrawalFrequency}
              sustainableWithdrawal={sustainableWithdrawal}
            />
          </TabsContent>

          <TabsContent value="withdrawal-calculator">
            <FeeCalculatorTab
              desiredNetAmount={desiredNetAmount}
              setDesiredNetAmount={setDesiredNetAmount}
              selectedWithdrawalMethod={selectedWithdrawalMethod}
              setSelectedWithdrawalMethod={setSelectedWithdrawalMethod}
              currentBalance={currentBalance}
              setCurrentBalance={setCurrentBalance}
              payFeesFromLwex={payFeesFromLwex}
              setPayFeesFromLwex={setPayFeesFromLwex}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
