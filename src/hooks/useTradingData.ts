import { useState, useEffect } from 'react';
import type { TradingData, FilterOptions } from '../types/trading';
import { loadTradingData } from '../data/dataLoader';
import { calculateStatistics } from '../lib/stats';

export function useTradingData() {
  const [data, setData] = useState<Record<string, TradingData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const tradingData = loadTradingData();
      setData(tradingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const getFilteredData = (filters: FilterOptions): TradingData | null => {
    const key = `${filters.coin}-${filters.emaPeriod}-${filters.mode}`;
    const tradingData = data[key];
    
    if (!tradingData) return null;

    if (filters.year !== '全部') {
      const selectedYear = parseInt(filters.year);
      // 以平仓时间归类，仅保留平仓记录并按所选年份筛选
      const filteredTrades = tradingData.trades
        .filter(trade => trade.type.includes('出场') && trade.year === selectedYear);
      return {
        ...tradingData,
        trades: filteredTrades,
        statistics: calculateStatistics(filteredTrades)
      };
    }

    return tradingData;
  };

  return {
    data,
    loading,
    error,
    getFilteredData
  };
}
