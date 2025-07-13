'use server';

import fetch from 'node-fetch';

const TWITTER_API_URL = 'https://api.twitter.com/2/tweets/search/recent';

const sampleTweets = [
    { id: '1', text: 'Just bought more #Bitcoin, to the moon! 🚀🌕' },
    { id: '2', text: 'Ethereum merge was a huge success. The future is bright for $ETH.' },
    { id: '3', text: 'Is Solana the fastest blockchain? The ecosystem is growing so fast.' },
    { id: '4', text: 'I am not sure about the market right now, seems very volatile.' },
    { id: '5', text: 'Regulation is coming for crypto, this could be bad news for many projects.' },
    { id: '6', text: 'Just saw the latest dev update for Polygon, looks incredibly promising.' },
    { id: '7', text: 'What is everyone\'s favorite Layer 2 solution? So many to choose from.' },
    { id: '8', text: 'The market is down today, but I am holding for the long term. #HODL' },
    { id: '9', text: 'Another day, another DeFi protocol hack. Stay safe out there.' },
    { id: '10', text: 'Crypto provides financial freedom for everyone, it\'s the future.' }
];

export async function fetchRecentTweets(query: string) {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    console.log("TWITTER_BEARER_TOKEN not found. Returning sample tweet data.");
    return {
        tweets: sampleTweets,
        note: 'This is sample data. To fetch live tweets, please add a TWITTER_BEARER_TOKEN to your .env file.'
    };
  }

  try {
    const response = await fetch(`${TWITTER_API_URL}?query=${encodeURIComponent(query)}&max_results=10`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch data from Twitter: ${response.statusText} - ${errorBody}`);
    }

    const data: any = await response.json();

    if (!data.data || data.data.length === 0) {
      return {
        tweets: [],
        error: `No recent tweets found for query: ${query}`,
      };
    }

    return {
      tweets: data.data.map((tweet: any) => ({
        id: tweet.id,
        text: tweet.text,
      })),
    };
  } catch (error: any) {
    console.error("Error fetching from Twitter:", error);
    return {
      error: error.message || 'An unknown error occurred while fetching tweets.'
    };
  }
}
