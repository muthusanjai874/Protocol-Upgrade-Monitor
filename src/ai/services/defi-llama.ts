'use server';

import fetch from 'node-fetch';

const DEFI_LLAMA_API_URL = 'https://api.llama.fi';

export async function getHistoricalTvl(protocol: string) {
  try {
    const response = await fetch(`${DEFI_LLAMA_API_URL}/protocol/${protocol.toLowerCase()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from DeFi Llama: ${response.statusText}`);
    }
    const data: any = await response.json();

    if (!data.tvl || data.tvl.length === 0) {
      return {
        error: `No TVL data found for protocol: ${protocol}. Please provide a valid DeFi Llama slug.`
      };
    }

    const recentTvl = data.tvl.slice(-30).map((entry: any) => ({
      date: new Date(entry.date * 1000).toISOString().split('T')[0],
      tvl: entry.totalLiquidityUSD,
    }));

    return {
      protocol: data.name,
      symbol: data.symbol,
      recentTvl: recentTvl,
    };
  } catch (error: any) {
    console.error("Error fetching from DeFi Llama:", error);
    return {
      error: error.message || 'An unknown error occurred while fetching TVL data.'
    };
  }
}
