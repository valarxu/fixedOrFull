import React, { useState } from 'react';
import { FilterTabs } from './components/FilterTabs';
import { TradingChart } from './components/TradingChart';
import { StatisticsPanel } from './components/StatisticsPanel';
import { TradeHistory } from './components/TradeHistory';
import { useTradingData } from './hooks/useTradingData';
import type { FilterOptions } from './types/trading';

function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    coin: 'BTC',
    emaPeriod: '120',
    year: '全部',
    mode: 'full'
  });

  const { loading, error, getFilteredData } = useTradingData();
  const filteredData = getFilteredData(filters);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">加载失败</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            阿吉EMA-ATR策略回测分析
          </h1>
          <p className="text-gray-600">
            可视化查看BTC、ETH、SOL、ADA四个币种的EMA策略回测结果
          </p>
        </div>

        <FilterTabs filters={filters} onFilterChange={setFilters} />

        <div className="space-y-6">
          <TradingChart trades={filteredData?.trades || []} />
          <StatisticsPanel data={filteredData} />
          <TradeHistory trades={filteredData?.trades || []} />
        </div>

        {!filteredData && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              暂无符合条件的交易数据
            </div>
            <p className="text-gray-400 mt-2">
              请尝试调整筛选条件
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;