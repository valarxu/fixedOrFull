export interface TradeRecord {
  tradeNumber: number;
  type: string;
  datetime: string;
  signal: string;
  price: number;
  positionSize: number;
  positionValue: number;
  netPnl: number;
  netPnlPercent: number;
  maxProfit: number;
  maxProfitPercent: number;
  maxLoss: number;
  maxLossPercent: number;
  cumulativePnl: number;
  cumulativePnlPercent: number;
  year: number;
}

export interface TradingData {
  coin: string;
  emaPeriod: string;
  mode: string;
  trades: TradeRecord[];
  statistics: {
    totalReturn: number;
    totalPnl: number;
    maxDrawdown: number;
    winRate: number;
    avgWin: number;
    avgLoss: number;
    maxWin: number;
    maxLoss: number;
    longWinRate: number;
    shortWinRate: number;
    longPnl: number;
    shortPnl: number;
  };
}

export interface FilterOptions {
  coin: string;
  emaPeriod: string;
  year: string;
  mode: string;
}

export const COINS = ['BTC', 'ETH', 'SOL', 'ADA'] as const;
export const EMA_PERIODS = ['120', '200'] as const;
export const MODES = ['full', 'fixed'] as const;
export const YEARS = ['全部', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'] as const;

export type Coin = typeof COINS[number];
export type EmaPeriod = typeof EMA_PERIODS[number];
export type Mode = typeof MODES[number];
export type Year = typeof YEARS[number];