import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import type { TradeRecord } from '../types/trading';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

interface TradingChartProps {
  trades: TradeRecord[];
}

export function TradingChart({ trades }: TradingChartProps) {
  if (!trades || trades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">交易图表</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          暂无数据
        </div>
      </div>
    );
  }

  // 按时间排序，仅取平仓记录，保证每笔完整交易仅展示一次
  const completedTrades = [...trades]
    .filter(t => t.type.includes('出场'))
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  // 准备图表数据
  const labels = completedTrades.map((trade, index) => `交易${index + 1}`);
  const pnlData = completedTrades.map(trade => trade.netPnl);
  const cumulativeData = completedTrades.map(trade => trade.cumulativePnl);

  const data: ChartData<'bar' | 'line'> = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: '单笔盈亏',
        data: pnlData,
        backgroundColor: pnlData.map(value => value >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'),
        borderColor: pnlData.map(value => value >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'),
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '累计收益',
        data: cumulativeData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y1'
      }
    ]
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: '交易盈亏与累计收益',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            const trade = completedTrades[index];
            return `时间: ${trade.datetime}`;
          },
          afterLabel: (context) => {
            const index = context.dataIndex;
            const trade = completedTrades[index];
            return [
              `价格: $${trade.price.toFixed(2)}`,
              `信号: ${trade.signal}`,
              `类型: ${trade.type}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '交易序号（按平仓）'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: '单笔盈亏 (USDT)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: '累计收益 (USDT)'
        },
        grid: {
          drawOnChartArea: true,
        },
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">交易图表</h3>
      <div className="h-96">
        <Chart type="bar" data={data} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>盈利交易</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>亏损交易</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-blue-500 rounded"></div>
            <span>累计收益</span>
          </div>
        </div>
      </div>
    </div>
  );
}
