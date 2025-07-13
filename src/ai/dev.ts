'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/upgrade-risk-scorer.ts';
import '@/ai/flows/sentiment-analysis-integration.ts';
import '@/ai/flows/liquidity-shift-prediction.ts';
import '@/ai/flows/governance-outcome-prediction.ts';
import '@/ai/tools/market-data.ts';
import '@/ai/tools/twitter.ts';
import '@/ai/tools/defi-llama.ts';
import '@/ai/tools/etherscan.ts';
import '@/ai/tools/snapshot.ts';
import '@/ai/tools/volatility-model.ts';
