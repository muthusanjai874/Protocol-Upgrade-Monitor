'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getTweetsTool } from '../tools/twitter';

const AnalyzeTweetSentimentInputSchema = z.object({
  topic: z.string().describe('The topic or asset to analyze tweet sentiment for (e.g. "ethereum", "solana").'),
});
export type AnalyzeTweetSentimentInput = z.infer<typeof AnalyzeTweetSentimentInputSchema>;

const AnalyzedTweetSchema = z.object({
  tweet: z.string().describe('The text of the tweet.'),
  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('The sentiment of the tweet.'),
  reasoning: z.string().describe('A brief explanation for the sentiment classification.')
});

const AnalyzeTweetSentimentOutputSchema = z.object({
  overallSentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The overall sentiment of the tweets (positive, negative, or neutral).'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence score of the overall sentiment analysis (0 to 1).'),
  summary: z.string().describe('A summary of the sentiment analysis.'),
  analyzedTweets: z.array(AnalyzedTweetSchema).describe('A list of analyzed tweets.')
});
export type AnalyzeTweetSentimentOutput = z.infer<typeof AnalyzeTweetSentimentOutputSchema>;

export async function analyzeTweetSentiment(input: AnalyzeTweetSentimentInput): Promise<AnalyzeTweetSentimentOutput> {
  return analyzeTweetSentimentFlow(input);
}

const analyzeTweetSentimentPrompt = ai.definePrompt({
  name: 'analyzeTweetSentimentPrompt',
  input: {schema: AnalyzeTweetSentimentInputSchema},
  output: {schema: AnalyzeTweetSentimentOutputSchema},
  tools: [getTweetsTool],
  prompt: `You are a crypto market sentiment analyst. Your task is to analyze the sentiment of recent tweets related to a specific topic or crypto asset.

  1. First, use the getTweetsTool to fetch recent tweets about "{{{topic}}}".
  2. For each tweet, classify its sentiment as positive, negative, or neutral.
  3. Provide a brief reasoning for each classification.
  4. After analyzing the tweets, determine the overall sentiment for the topic.
  5. Provide a confidence score for your overall sentiment.
  6. Write a concise summary of your findings, highlighting any key themes or opinions.

  The final output must be a JSON object that strictly adheres to the output schema.`,
});

const analyzeTweetSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeTweetSentimentFlow',
    inputSchema: AnalyzeTweetSentimentInputSchema,
    outputSchema: AnalyzeTweetSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeTweetSentimentPrompt(input);
    return output!;
  }
);
