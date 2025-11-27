import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, AlertTriangle } from 'lucide-react';
import type { TradingData } from '../types/trading';

interface StatisticsPanelProps {
  data: TradingData | null;
}

export function StatisticsPanel({ data }: StatisticsPanelProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">统计指标</h3>
        <div className="text-center text-gray-500 py-8">
          请选择筛选条件查看统计数据
        </div>
      </div>
    );
  }

  const { statistics } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const statCards = [
    {
      title: '总收益率',
      value: formatPercent(statistics.totalReturn),
      icon: statistics.totalReturn >= 0 ? TrendingUp : TrendingDown,
      color: statistics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: statistics.totalReturn >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: '累计盈亏',
      value: formatCurrency(statistics.totalPnl),
      icon: DollarSign,
      color: statistics.totalPnl >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: statistics.totalPnl >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: '最大回撤',
      value: formatCurrency(statistics.maxDrawdown),
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: '胜率',
      value: `${statistics.winRate.toFixed(1)}%`,
      icon: Target,
      color: statistics.winRate >= 50 ? 'text-green-600' : 'text-red-600',
      bgColor: statistics.winRate >= 50 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: '平均盈利',
      value: formatCurrency(statistics.avgWin),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '平均亏损',
      value: formatCurrency(statistics.avgLoss),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: '单笔最大盈利',
      value: formatCurrency(statistics.maxWin),
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '单笔最大亏损',
      value: formatCurrency(statistics.maxLoss),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: '做多胜率',
      value: `${statistics.longWinRate.toFixed(1)}%`,
      icon: Target,
      color: statistics.longWinRate >= 50 ? 'text-green-600' : 'text-red-600',
      bgColor: statistics.longWinRate >= 50 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: '做空胜率',
      value: `${statistics.shortWinRate.toFixed(1)}%`,
      icon: Target,
      color: statistics.shortWinRate >= 50 ? 'text-green-600' : 'text-red-600',
      bgColor: statistics.shortWinRate >= 50 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: '做多盈亏',
      value: formatCurrency(statistics.longPnl),
      icon: DollarSign,
      color: statistics.longPnl >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: statistics.longPnl >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: '做空盈亏',
      value: formatCurrency(statistics.shortPnl),
      icon: DollarSign,
      color: statistics.shortPnl >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: statistics.shortPnl >= 0 ? 'bg-green-50' : 'bg-red-50'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">统计指标</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`p-4 rounded-lg ${card.bgColor} border border-gray-200`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">{card.title}</h4>
                <IconComponent className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className={`text-xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}