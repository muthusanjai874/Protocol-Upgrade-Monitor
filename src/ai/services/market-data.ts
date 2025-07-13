'use server';

import fetch from 'node-fetch';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function getMarketData(asset: string) {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/coins/${asset.toLowerCase()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from CoinGecko: ${response.statusText}`);
    }
    const data: any = await response.json();

    if (!data.market_data) {
        return {
            error: `No market data found for asset: ${asset}. Please provide a valid CoinGecko asset ID (e.g., 'ethereum', 'bitcoin').`
        }
    }

    return {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      price_usd: data.market_data.current_price?.usd,
      market_cap_usd: data.market_data.market_cap?.usd,
      total_volume_usd: data.market_data.total_volume?.usd,
      price_change_24h_usd: data.market_data.price_change_24h_in_currency?.usd,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h,
    };
  } catch (error: any) {
    console.error("Error fetching from CoinGecko:", error);
    return {
        error: error.message || 'An unknown error occurred while fetching market data.'
    };
  }
}
