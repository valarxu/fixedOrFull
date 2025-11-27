import type { TradeRecord, TradingData } from '../types/trading'

export function calculateStatistics(trades: TradeRecord[]): TradingData['statistics'] {
  if (!trades || trades.length === 0) {
    return {
      totalReturn: 0,
      totalPnl: 0,
      maxDrawdown: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      maxWin: 0,
      maxLoss: 0,
      longWinRate: 0,
      shortWinRate: 0,
      longPnl: 0,
      shortPnl: 0
    }
  }

  const sortedTrades = [...trades].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

  let peak = 0
  let maxDrawdown = 0
  for (const t of sortedTrades) {
    if (t.cumulativePnl > peak) peak = t.cumulativePnl
    const dd = peak - t.cumulativePnl
    if (dd > maxDrawdown) maxDrawdown = dd
  }

  const profitableTrades = trades.filter(t => t.netPnl > 0)
  const losingTrades = trades.filter(t => t.netPnl < 0)

  const longTrades = trades.filter(t => t.type.includes('多头'))
  const shortTrades = trades.filter(t => t.type.includes('空头'))

  const profitableLong = longTrades.filter(t => t.netPnl > 0)
  const profitableShort = shortTrades.filter(t => t.netPnl > 0)

  const totalLongPnl = longTrades.reduce((s, t) => s + t.netPnl, 0)
  const totalShortPnl = shortTrades.reduce((s, t) => s + t.netPnl, 0)

  const first = sortedTrades[0]
  const last = sortedTrades[sortedTrades.length - 1]
  const baselineCumulativePnl = first.cumulativePnl - first.netPnl
  const endCumulativePnl = last.cumulativePnl
  const periodPnl = endCumulativePnl - baselineCumulativePnl
  const baselineEquity = 10000 + baselineCumulativePnl

  return {
    totalReturn: baselineEquity > 0 ? (periodPnl / baselineEquity) * 100 : 0,
    totalPnl: periodPnl,
    maxDrawdown,
    winRate: trades.length > 0 ? (profitableTrades.length / trades.length) * 100 : 0,
    avgWin: profitableTrades.length > 0 ? profitableTrades.reduce((s, t) => s + t.netPnl, 0) / profitableTrades.length : 0,
    avgLoss: losingTrades.length > 0 ? losingTrades.reduce((s, t) => s + t.netPnl, 0) / losingTrades.length : 0,
    maxWin: Math.max(...trades.map(t => t.netPnl)),
    maxLoss: Math.min(...trades.map(t => t.netPnl)),
    longWinRate: longTrades.length > 0 ? (profitableLong.length / longTrades.length) * 100 : 0,
    shortWinRate: shortTrades.length > 0 ? (profitableShort.length / shortTrades.length) * 100 : 0,
    longPnl: totalLongPnl,
    shortPnl: totalShortPnl
  }
}

