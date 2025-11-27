const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const COINS = ['BTC', 'ETH', 'SOL', 'ADA'];
const EMA_PERIODS = ['120', '200'];
const MODES = ['full', 'fixed'];

interface TradeRecord {
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

interface TradingData {
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

function parseCSV(filePath: string): Promise<TradeRecord[]> {
  return new Promise((resolve, reject) => {
    const results: TradeRecord[] = [];
    
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' }))
      .on('data', (row: any) => {
        try {
          const datetime = row['日期/时间'];
          const year = parseInt(datetime.split('-')[0]);
          
          const record: TradeRecord = {
            tradeNumber: parseInt(row['交易 #']),
            type: row['类型'],
            datetime: datetime,
            signal: row['信号'],
            price: parseFloat(row['价格 USDT']),
            positionSize: parseFloat(row['仓位大小（数量）']),
            positionValue: parseFloat(row['仓位大小（价值）']),
            netPnl: parseFloat(row['净损益 USDT']),
            netPnlPercent: parseFloat(row['净损益 %']),
            maxProfit: parseFloat(row['最大交易获利 USDT']),
            maxProfitPercent: parseFloat(row['最大交易获利 %']),
            maxLoss: parseFloat(row['交易亏损 USDT']),
            maxLossPercent: parseFloat(row['交易亏损 %']),
            cumulativePnl: parseFloat(row['累计P&L USDT']),
            cumulativePnlPercent: parseFloat(row['累计P&L %']),
            year: year
          };
          results.push(record);
        } catch (error) {
          console.error('解析行数据出错:', row, error);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', reject);
  });
}

function calculateStatistics(trades: TradeRecord[]) {
  if (trades.length === 0) {
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
    };
  }

  // 按时间排序
  const sortedTrades = trades.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  
  // 计算最大回撤
  let maxCumulativePnl = 0;
  let maxDrawdown = 0;
  sortedTrades.forEach(trade => {
    if (trade.cumulativePnl > maxCumulativePnl) {
      maxCumulativePnl = trade.cumulativePnl;
    }
    const drawdown = maxCumulativePnl - trade.cumulativePnl;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  // 计算胜率等统计指标
  const profitableTrades = trades.filter(trade => trade.netPnl > 0);
  const losingTrades = trades.filter(trade => trade.netPnl < 0);
  
  const longTrades = trades.filter(trade => trade.type.includes('多头'));
  const shortTrades = trades.filter(trade => trade.type.includes('空头'));
  
  const profitableLongTrades = longTrades.filter(trade => trade.netPnl > 0);
  const profitableShortTrades = shortTrades.filter(trade => trade.netPnl > 0);

  const totalLongPnl = longTrades.reduce((sum, trade) => sum + trade.netPnl, 0);
  const totalShortPnl = shortTrades.reduce((sum, trade) => sum + trade.netPnl, 0);

  return {
    totalReturn: trades[trades.length - 1]?.cumulativePnlPercent || 0,
    totalPnl: trades[trades.length - 1]?.cumulativePnl || 0,
    maxDrawdown: maxDrawdown,
    winRate: trades.length > 0 ? (profitableTrades.length / trades.length) * 100 : 0,
    avgWin: profitableTrades.length > 0 ? profitableTrades.reduce((sum, trade) => sum + trade.netPnl, 0) / profitableTrades.length : 0,
    avgLoss: losingTrades.length > 0 ? losingTrades.reduce((sum, trade) => sum + trade.netPnl, 0) / losingTrades.length : 0,
    maxWin: Math.max(...trades.map(trade => trade.netPnl)),
    maxLoss: Math.min(...trades.map(trade => trade.netPnl)),
    longWinRate: longTrades.length > 0 ? (profitableLongTrades.length / longTrades.length) * 100 : 0,
    shortWinRate: shortTrades.length > 0 ? (profitableShortTrades.length / shortTrades.length) * 100 : 0,
    longPnl: totalLongPnl,
    shortPnl: totalShortPnl
  };
}

async function convertData() {
  const outputDir = path.join(__dirname, '..', 'src', 'data');
  
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const allData: TradingData[] = [];

  for (const coin of COINS) {
    for (const emaPeriod of EMA_PERIODS) {
      for (const mode of MODES) {
        const fileName = `${coin}-EMA${emaPeriod}-${mode.toUpperCase()}.csv`;
        const filePath = path.join(__dirname, '..', 'originData', mode, fileName);
        
        console.log(`处理文件: ${filePath}`);
        
        try {
          if (fs.existsSync(filePath)) {
            const trades = await parseCSV(filePath);
            const statistics = calculateStatistics(trades);
            
            const data: TradingData = {
              coin,
              emaPeriod,
              mode,
              trades,
              statistics
            };
            
            allData.push(data);
            
            // 保存单个文件
            const outputFileName = `${coin}-${emaPeriod}-${mode}.json`;
            const outputPath = path.join(outputDir, outputFileName);
            fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
            
            console.log(`✅ 转换完成: ${outputFileName} (${trades.length} 条记录)`);
          } else {
            console.log(`⚠️ 文件不存在: ${filePath}`);
          }
        } catch (error) {
          console.error(`❌ 处理文件 ${fileName} 时出错:`, error);
        }
      }
    }
  }

  // 保存汇总文件
  const summaryPath = path.join(outputDir, 'all-data.json');
  fs.writeFileSync(summaryPath, JSON.stringify(allData, null, 2));
  console.log(`\n✅ 所有数据转换完成！共 ${allData.length} 个文件`);
  
  // 生成索引文件
  const indexPath = path.join(outputDir, 'index.ts');
  const indexContent = `
import type { TradingData, TradeRecord } from '../types/trading';

${allData.map((data, index) => 
  `import ${data.coin}${data.emaPeriod}${data.mode} from './${data.coin}-${data.emaPeriod}-${data.mode}.json';`
).join('\n')}

export const tradingData = {
${allData.map(data => 
  `  '${data.coin}-${data.emaPeriod}-${data.mode}': ${data.coin}${data.emaPeriod}${data.mode} as TradingData,`
).join('\n')}
};

export { type TradingData, type TradeRecord };
`;
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ 索引文件生成完成');
}

// 运行转换
convertData().catch(console.error);