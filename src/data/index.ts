
import type { TradingData, TradeRecord } from '../types/trading';

import BTC120full from './BTC-120-full.json';
import BTC120fixed from './BTC-120-fixed.json';
import BTC200full from './BTC-200-full.json';
import BTC200fixed from './BTC-200-fixed.json';
import ETH120full from './ETH-120-full.json';
import ETH120fixed from './ETH-120-fixed.json';
import ETH200full from './ETH-200-full.json';
import ETH200fixed from './ETH-200-fixed.json';
import SOL120full from './SOL-120-full.json';
import SOL120fixed from './SOL-120-fixed.json';
import SOL200full from './SOL-200-full.json';
import SOL200fixed from './SOL-200-fixed.json';
import ADA120full from './ADA-120-full.json';
import ADA120fixed from './ADA-120-fixed.json';
import ADA200full from './ADA-200-full.json';
import ADA200fixed from './ADA-200-fixed.json';

export const tradingData = {
  'BTC-120-full': BTC120full as TradingData,
  'BTC-120-fixed': BTC120fixed as TradingData,
  'BTC-200-full': BTC200full as TradingData,
  'BTC-200-fixed': BTC200fixed as TradingData,
  'ETH-120-full': ETH120full as TradingData,
  'ETH-120-fixed': ETH120fixed as TradingData,
  'ETH-200-full': ETH200full as TradingData,
  'ETH-200-fixed': ETH200fixed as TradingData,
  'SOL-120-full': SOL120full as TradingData,
  'SOL-120-fixed': SOL120fixed as TradingData,
  'SOL-200-full': SOL200full as TradingData,
  'SOL-200-fixed': SOL200fixed as TradingData,
  'ADA-120-full': ADA120full as TradingData,
  'ADA-120-fixed': ADA120fixed as TradingData,
  'ADA-200-full': ADA200full as TradingData,
  'ADA-200-fixed': ADA200fixed as TradingData,
};

export { type TradingData, type TradeRecord };
