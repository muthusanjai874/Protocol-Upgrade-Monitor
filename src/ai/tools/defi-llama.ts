'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getHistoricalTvl } from '../services/defi-llama';

export const getHistoricalTvlTool = ai.defineTool(
  {
    name: 'getHistoricalTvlTool',
    description: 'Returns the recent historical Total Value Locked (TVL) for a given DeFi protocol. Use the protocol\'s "slug" as the input (e.g. "aave", "uniswap", "maker").',
    inputSchema: z.object({
      protocol: z.string().describe('The slug of the protocol on DeFi Llama (e.g., "aave", "uniswap").'),
    }),
    outputSchema: z.object({
        protocol: z.string().optional(),
        symbol: z.string().optional(),
        recentTvl: z.array(z.object({
            date: z.string(),
            tvl: z.number(),
        })).optional(),
        error: z.string().optional(),
    }),
  },
  async (input) => {
    return await getHistoricalTvl(input.protocol);
  }
);
