'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getMarketData } from '../services/market-data';

export const getMarketDataTool = ai.defineTool(
  {
    name: 'getMarketData',
    description: 'Returns the current market data for a given crypto asset. Use the full name of the asset (e.g. "ethereum", "bitcoin").',
    inputSchema: z.object({
      asset: z.string().describe('The asset to get market data for (e.g. "ethereum", "bitcoin", "polygon").'),
    }),
    outputSchema: z.object({
        id: z.string().optional(),
        symbol: z.string().optional(),
        name: z.string().optional(),
        price_usd: z.number().optional(),
        market_cap_usd: z.number().optional(),
        total_volume_usd: z.number().optional(),
        price_change_24h_usd: z.number().optional(),
        price_change_percentage_24h: z.number().optional(),
        error: z.string().optional(),
    }),
  },
  async (input) => {
    return await getMarketData(input.asset);
  }
);
