'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getHistoricalTvlTool } from '../tools/defi-llama';

const PredictLiquidityShiftInputSchema = z.object({
  protocol: z.string().describe('The slug of the protocol on DeFi Llama (e.g., "aave", "uniswap").'),
  timeframe: z.string().describe('The timeframe for the prediction (e.g., 1 day, 1 week, 1 month).'),
});
export type PredictLiquidityShiftInput = z.infer<typeof PredictLiquidityShiftInputSchema>;

const PredictLiquidityShiftOutputSchema = z.object({
  predictedTvlMovements: z.string().describe('Predicted TVL movements for the specified timeframe.'),
  confidenceScore: z.number().describe('Confidence score for the prediction (0-1).'),
  riskAssessment: z.string().describe('Risk assessment associated with the predicted liquidity shifts.'),
  analysisSummary: z.string().describe('A summary of the historical data analysis that informed the prediction.'),
});
export type PredictLiquidityShiftOutput = z.infer<typeof PredictLiquidityShiftOutputSchema>;

export async function predictLiquidityShift(input: PredictLiquidityShiftInput): Promise<PredictLiquidityShiftOutput> {
  return predictLiquidityShiftFlow(input);
}

const predictLiquidityShiftPrompt = ai.definePrompt({
  name: 'predictLiquidityShiftPrompt',
  input: {schema: PredictLiquidityShiftInputSchema},
  output: {schema: PredictLiquidityShiftOutputSchema},
  tools: [getHistoricalTvlTool],
  prompt: `You are an expert in predicting liquidity shifts in decentralized finance (DeFi).

  1. Use the getHistoricalTvlTool to fetch the recent historical Total Value Locked (TVL) data for the protocol: "{{{protocol}}}".
  2. Analyze the fetched TVL data to identify trends, volatility, and key turning points.
  3. Based on your analysis of the historical data, predict the TVL movements for the specified timeframe: {{{timeframe}}}.
  4. Provide a confidence score for your prediction and a detailed risk assessment.
  5. Summarize your analysis of the historical data and explain how it informed your prediction.

  The final output must be a JSON object that strictly adheres to the output schema.
  `,
});

const predictLiquidityShiftFlow = ai.defineFlow(
  {
    name: 'predictLiquidityShiftFlow',
    inputSchema: PredictLiquidityShiftInputSchema,
    outputSchema: PredictLiquidityShiftOutputSchema,
  },
  async input => {
    const {output} = await predictLiquidityShiftPrompt(input);
    return output!;
  }
);
