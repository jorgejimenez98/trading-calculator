import type React from "react"

export interface CalculationRow {
  date: Date
  day: number
  month: string
  biWeeklyPeriod: number
  totalAmount: number
  dailyIncrease: number
}

export interface GroupedData {
  period: string
  startDate: Date
  endDate: Date
  startAmount: number
  endAmount: number
  totalIncrease: number
  days: number
}

export interface SustainableWithdrawal {
  startDate: Date
  daysToReach: number
  balanceAtStart: number
  periodGrowth: number
  periodWithdrawal: number
  netPeriodGrowth: number
  canSustainForever: boolean
  withdrawalFrequency: WithdrawalFrequency
}

export interface WithdrawalMethod {
  id: string
  name: string
  icon: React.ReactNode
  feeType: "fixed" | "percentage" | "free"
  feeValue: number
  minFee?: number
  description: string
}

export interface PercentageWithdrawalRow {
  period: number
  periodLabel: string
  date: Date
  capitalBefore: number
  withdrawalAmount: number
  capitalAfter: number
  cumulativeWithdrawn: number
  netGrowth: number
}

export interface PercentageWithdrawalAnalysis {
  projectionRows: PercentageWithdrawalRow[]
  totalWithdrawn: number
  finalCapital: number
  averageWithdrawal: number
  sustainabilityScore: number
}

export type ViewMode = "results" | "withdrawal-calculator" | "sustainable-withdrawals"

export type ResultsViewMode = "daily" | "biweekly" | "monthly"

export type WithdrawalFrequency = "daily" | "weekly" | "biweekly" | "monthly"

export type WithdrawalStrategy = "fixed" | "percentage"

export interface WithdrawalFrequencyOption {
  value: WithdrawalFrequency
  label: string
  days: number
  description: string
}

export interface ResultsViewOption {
  value: ResultsViewMode
  label: string
  description: string
}
