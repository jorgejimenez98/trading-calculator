"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Calculator,
  DollarSign,
  AlertCircle,
  CreditCard,
  Building2,
  Wallet,
  ArrowRightLeft,
  PiggyBank,
  TrendingDown,
} from "lucide-react"
import type { WithdrawalMethod } from "@/types/trading"

const withdrawalMethods: WithdrawalMethod[] = [
  {
    id: "ach",
    name: "ACH Transfer",
    icon: <Building2 className="h-4 w-4" />,
    feeType: "free",
    feeValue: 0,
    description: "Free bank transfer (3-5 business days)",
  },
  {
    id: "wire",
    name: "Wire Transfer",
    icon: <ArrowRightLeft className="h-4 w-4" />,
    feeType: "fixed",
    feeValue: 25,
    description: "Fast bank transfer ($25 fee)",
  },
  {
    id: "debit",
    name: "Instant Debit Card",
    icon: <CreditCard className="h-4 w-4" />,
    feeType: "percentage",
    feeValue: 1.5,
    minFee: 0.55,
    description: "Instant to debit card (1.5%, min $0.55)",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <Wallet className="h-4 w-4" />,
    feeType: "percentage",
    feeValue: 2.5,
    description: "PayPal transfer (2.5% estimated)",
  },
]

interface FeeCalculatorTabProps {
  desiredNetAmount: string
  setDesiredNetAmount: (value: string) => void
  selectedWithdrawalMethod: string
  setSelectedWithdrawalMethod: (value: string) => void
  currentBalance: string
  setCurrentBalance: (value: string) => void
  payFeesFromLwex: boolean
  setPayFeesFromLwex: (value: boolean) => void
}

export function FeeCalculatorTab({
  desiredNetAmount,
  setDesiredNetAmount,
  selectedWithdrawalMethod,
  setSelectedWithdrawalMethod,
  currentBalance,
  setCurrentBalance,
  payFeesFromLwex,
  setPayFeesFromLwex,
}: FeeCalculatorTabProps) {
  // Calculate withdrawal fees and total amount
  const withdrawalCalculation = (() => {
    const netAmount = Number.parseFloat(desiredNetAmount || "0")
    if (netAmount <= 0) return null

    const selectedMethod = withdrawalMethods.find((m) => m.id === selectedWithdrawalMethod)
    if (!selectedMethod) return null

    let totalAmount: number
    let coinbaseFee: number
    let lwexFee: number
    let actualNetReceived: number

    if (payFeesFromLwex) {
      // Mode: Pay fees from LWex (subtract from desired amount)
      // User wants to know how much they'll receive after all fees are deducted
      totalAmount = netAmount // This is what we withdraw from LWex

      // Calculate LWex fee
      if (totalAmount < 100) {
        lwexFee = 5
      } else {
        lwexFee = totalAmount * 0.05
      }

      // Amount after LWex fee
      const amountAfterLwexFee = totalAmount - lwexFee

      // Calculate Coinbase fee
      if (selectedMethod.feeType === "free") {
        coinbaseFee = 0
        actualNetReceived = amountAfterLwexFee
      } else if (selectedMethod.feeType === "fixed") {
        coinbaseFee = selectedMethod.feeValue
        actualNetReceived = amountAfterLwexFee - coinbaseFee
      } else {
        // Percentage fee
        const feePercentage = selectedMethod.feeValue / 100
        coinbaseFee = amountAfterLwexFee * feePercentage
        if (selectedMethod.minFee && coinbaseFee < selectedMethod.minFee) {
          coinbaseFee = selectedMethod.minFee
        }
        actualNetReceived = amountAfterLwexFee - coinbaseFee
      }
    } else {
      // Mode: Add fees to desired amount (original behavior)
      // User wants to receive exactly the desired amount after all fees
      if (selectedMethod.feeType === "free") {
        coinbaseFee = 0
        const amountBeforeLwexFee = netAmount

        // Calculate total needed including LWex fee
        if (amountBeforeLwexFee < 95) {
          // 100 - 5 = 95
          totalAmount = amountBeforeLwexFee + 5
          lwexFee = 5
        } else {
          totalAmount = amountBeforeLwexFee / 0.95
          lwexFee = totalAmount * 0.05
        }
      } else if (selectedMethod.feeType === "fixed") {
        coinbaseFee = selectedMethod.feeValue
        const amountBeforeLwexFee = netAmount + coinbaseFee

        if (amountBeforeLwexFee < 95) {
          totalAmount = amountBeforeLwexFee + 5
          lwexFee = 5
        } else {
          totalAmount = amountBeforeLwexFee / 0.95
          lwexFee = totalAmount * 0.05
        }
      } else {
        // Percentage fee - more complex calculation
        const feePercentage = selectedMethod.feeValue / 100

        // We need to solve: totalAmount - lwexFee - coinbaseFee = netAmount
        // Where coinbaseFee = (totalAmount - lwexFee) * feePercentage
        // And lwexFee = totalAmount < 100 ? 5 : totalAmount * 0.05

        // Try with 5% LWex fee first
        const tempTotal = netAmount / (1 - 0.05 - feePercentage)
        if (tempTotal >= 100) {
          totalAmount = tempTotal
          lwexFee = totalAmount * 0.05
        } else {
          // Use $5 fixed fee
          totalAmount = (netAmount + 5) / (1 - feePercentage)
          lwexFee = 5
        }

        coinbaseFee = (totalAmount - lwexFee) * feePercentage
        if (selectedMethod.minFee && coinbaseFee < selectedMethod.minFee) {
          // Recalculate with minimum fee
          coinbaseFee = selectedMethod.minFee
          const amountBeforeLwexFee = netAmount + coinbaseFee

          if (amountBeforeLwexFee < 95) {
            totalAmount = amountBeforeLwexFee + 5
            lwexFee = 5
          } else {
            totalAmount = amountBeforeLwexFee / 0.95
            lwexFee = totalAmount * 0.05
          }
        }
      }

      actualNetReceived = netAmount
    }

    const effectiveRate = ((totalAmount - actualNetReceived) / actualNetReceived) * 100

    return {
      totalAmount,
      lwexFee,
      coinbaseFee,
      actualNetReceived,
      selectedMethod,
      effectiveRate,
      payFeesFromLwex,
    }
  })()

  // Calculate remaining balance after withdrawal
  const balanceCalculation = (() => {
    if (!withdrawalCalculation || !currentBalance) return null

    const balance = Number.parseFloat(currentBalance)
    if (balance <= 0) return null

    const remainingBalance = balance - withdrawalCalculation.totalAmount
    const withdrawalPercentage = (withdrawalCalculation.totalAmount / balance) * 100

    return {
      currentBalance: balance,
      totalWithdrawal: withdrawalCalculation.totalAmount,
      remainingBalance,
      withdrawalPercentage,
      canAfford: remainingBalance >= 0,
    }
  })()

  return (
    <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center px-3 sm:px-0 justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Withdrawal Fee Calculator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Calculate exact withdrawal amounts including all fees
              </p>
            </div>

            {/* Fee Payment Mode Switch - Moved to header */}
            <div className="flex items-center justify-end gap-2">
              <div className="text-right">
                <Label htmlFor="fee-mode-header" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Pay fees from LWex
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {payFeesFromLwex ? "Deduct from withdrawal" : "Add to withdrawal"}
                </p>
              </div>
              <Switch id="fee-mode-header" checked={payFeesFromLwex} onCheckedChange={setPayFeesFromLwex} size="sm" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Input Section */}
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Withdrawal Parameters
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                {payFeesFromLwex
                  ? "Enter how much you want to withdraw from LWex (fees will be deducted)"
                  : "Enter how much you want to receive in your bank account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="net-amount" className="text-gray-700 dark:text-gray-300 text-sm">
                    {payFeesFromLwex ? "Amount to Withdraw from LWex (USD)" : "Desired Net Amount (USD)"}
                  </Label>
                  <Input
                    id="net-amount"
                    type="number"
                    placeholder="1000"
                    value={desiredNetAmount}
                    onChange={(e) => setDesiredNetAmount(e.target.value)}
                    min="1"
                    step="0.01"
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white text-lg font-medium"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {payFeesFromLwex
                      ? "Total amount to withdraw from your LWex account"
                      : "Amount you want to receive after all fees are deducted"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-balance" className="text-gray-700 dark:text-gray-300 text-sm">
                    Current Total Balance (USD) <span className="text-gray-400">(Optional)</span>
                  </Label>
                  <Input
                    id="current-balance"
                    type="number"
                    placeholder="5000"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                    min="0"
                    step="0.01"
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your total balance to see what remains after withdrawal
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 text-sm">Coinbase Withdrawal Method</Label>
                <div className="grid grid-cols-1 gap-2">
                  {withdrawalMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedWithdrawalMethod === method.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                      onClick={() => setSelectedWithdrawalMethod(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-gray-600 dark:text-gray-400">{method.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{method.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{method.description}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedWithdrawalMethod === method.id
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {selectedWithdrawalMethod === method.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {withdrawalCalculation && (
            <div className="space-y-4">
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Fee Breakdown
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    {payFeesFromLwex
                      ? "Amount you'll receive after all fees are deducted"
                      : "Total amount needed to withdraw from LWex"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  {/* Main Result Card */}
                  <div
                    className={`p-4 border rounded-lg ${
                      payFeesFromLwex
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`text-2xl sm:text-3xl font-bold ${
                          payFeesFromLwex ? "text-blue-800 dark:text-blue-400" : "text-green-800 dark:text-green-400"
                        }`}
                      >
                        $
                        {payFeesFromLwex
                          ? withdrawalCalculation.actualNetReceived.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })
                          : withdrawalCalculation.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          payFeesFromLwex ? "text-blue-600 dark:text-blue-500" : "text-green-600 dark:text-green-500"
                        }`}
                      >
                        {payFeesFromLwex ? "Net Amount You'll Receive" : "Total Amount to Withdraw"}
                      </p>
                    </div>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {payFeesFromLwex ? "Withdrawal from LWex" : "Desired Net Amount"}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        $
                        {payFeesFromLwex
                          ? withdrawalCalculation.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })
                          : withdrawalCalculation.actualNetReceived.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        LWex Fee ({withdrawalCalculation.totalAmount < 100 ? "$5 fixed" : "5%"})
                      </span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {payFeesFromLwex ? "-" : "+"}$
                        {withdrawalCalculation.lwexFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {withdrawalCalculation.selectedMethod.name} Fee
                      </span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {withdrawalCalculation.coinbaseFee === 0
                          ? "Free"
                          : `${payFeesFromLwex ? "-" : "+"}$${withdrawalCalculation.coinbaseFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 pt-3 border-t border-gray-300 dark:border-gray-600">
                      <span className="text-gray-900 dark:text-white font-medium">Effective Fee Rate</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        {withdrawalCalculation.effectiveRate.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Method Info */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {withdrawalCalculation.selectedMethod.icon}
                      <span className="font-medium text-blue-800 dark:text-blue-400 text-sm">
                        {withdrawalCalculation.selectedMethod.name}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-500">
                      {withdrawalCalculation.selectedMethod.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Balance Analysis Card */}
              {balanceCalculation && (
                <Card className="border-gray-200 dark:border-gray-700">
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <PiggyBank className="h-4 w-4" />
                      Balance Analysis
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                      Your remaining balance after withdrawal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-4">
                    {/* Remaining Balance Card */}
                    <div
                      className={`p-4 border rounded-lg ${
                        balanceCalculation.canAfford
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`text-2xl sm:text-3xl font-bold ${
                            balanceCalculation.canAfford
                              ? "text-green-800 dark:text-green-400"
                              : "text-red-800 dark:text-red-400"
                          }`}
                        >
                          $
                          {balanceCalculation.remainingBalance.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            balanceCalculation.canAfford
                              ? "text-green-600 dark:text-green-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          {balanceCalculation.canAfford ? "Remaining Balance" : "Insufficient Balance"}
                        </p>
                      </div>
                    </div>

                    {/* Balance Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Current Balance</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          $
                          {balanceCalculation.currentBalance.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Total Withdrawal</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          -$
                          {balanceCalculation.totalWithdrawal.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 pt-3 border-t border-gray-300 dark:border-gray-600">
                        <span className="text-gray-900 dark:text-white font-medium">Withdrawal Percentage</span>
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                          {balanceCalculation.withdrawalPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Warning or Success Message */}
                    {!balanceCalculation.canAfford && (
                      <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertTitle className="text-red-800 dark:text-red-400">Insufficient Balance</AlertTitle>
                        <AlertDescription className="text-red-700 dark:text-red-500">
                          You need an additional $
                          {Math.abs(balanceCalculation.remainingBalance).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}{" "}
                          to complete this withdrawal.
                        </AlertDescription>
                      </Alert>
                    )}

                    {balanceCalculation.canAfford && balanceCalculation.withdrawalPercentage > 50 && (
                      <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                        <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertTitle className="text-amber-800 dark:text-amber-400">Large Withdrawal</AlertTitle>
                        <AlertDescription className="text-amber-700 dark:text-amber-500">
                          This withdrawal represents {balanceCalculation.withdrawalPercentage.toFixed(1)}% of your total
                          balance. Consider if this aligns with your investment strategy.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {!withdrawalCalculation && (
          <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-400">Enter withdrawal amount</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-500">
              Please enter the amount you want to {payFeesFromLwex ? "withdraw" : "receive"} to see the fee calculation.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
