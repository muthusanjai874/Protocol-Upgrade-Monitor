'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { fetchRecentTweets } from '../services/twitter';

export const getTweetsTool = ai.defineTool(
  {
    name: 'getTweetsTool',
    description: 'Returns recent tweets for a given search query. Use this to get live social media sentiment. If no API key is available, this will return sample data.',
    inputSchema: z.object({
      query: z.string().describe('The search term to look for in recent tweets (e.g. "bitcoin", "$ETH").'),
    }),
    outputSchema: z.object({
        tweets: z.array(z.object({
            id: z.string(),
            text: z.string(),
        })).optional(),
        note: z.string().optional().describe('A note indicating if the data is sample data.'),
        error: z.string().optional(),
    }),
  },
  async (input) => {
    return await fetchRecentTweets(input.query);
  }
);
