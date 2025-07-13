'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getSnapshotProposalTool } from '../tools/snapshot';

const PredictGovernanceOutcomeInputSchema = z.object({
  proposalId: z.string().describe('The ID of the proposal on Snapshot.org.'),
});
export type PredictGovernanceOutcomeInput = z.infer<typeof PredictGovernanceOutcomeInputSchema>;

const PredictGovernanceOutcomeOutputSchema = z.object({
  prediction: z.enum(['Likely to Pass', 'Likely to Fail', 'Too Close to Call']).describe('The predicted outcome of the proposal.'),
  confidence: z.number().min(0).max(1).describe('The confidence score for the prediction (0-1).'),
  reasoning: z.string().describe('A detailed explanation for the prediction, considering voter turnout, vote distribution, and proposal content.'),
  keyFactors: z.array(z.string()).describe('A list of key factors that influenced the prediction.'),
});
export type PredictGovernanceOutcomeOutput = z.infer<typeof PredictGovernanceOutcomeOutputSchema>;

export async function predictGovernanceOutcome(input: PredictGovernanceOutcomeInput): Promise<PredictGovernanceOutcomeOutput> {
  return predictGovernanceOutcomeFlow(input);
}

const predictGovernanceOutcomePrompt = ai.definePrompt({
  name: 'predictGovernanceOutcomePrompt',
  input: {schema: PredictGovernanceOutcomeInputSchema},
  output: {schema: PredictGovernanceOutcomeOutputSchema},
  tools: [getSnapshotProposalTool],
  prompt: `You are an expert governance analyst in the crypto space. Your task is to predict the outcome of a Snapshot.org proposal.

  1. Use the getSnapshotProposalTool to fetch the live data for the proposal with ID: "{{{proposalId}}}".
  2. Analyze the fetched data. Pay close attention to:
     - The current state ('active' or 'closed').
     - The distribution of votes across the choices (e.g., 'For', 'Against').
     - The total number of votes and the total voting power (scores_total).
     - The time remaining until the proposal ends.
     - The content of the proposal title.
  3. Based on this data, act as a classification model to predict whether the proposal is 'Likely to Pass', 'Likely to Fail', or 'Too Close to Call'.
  4. Provide a confidence score for your prediction.
  5. Provide a detailed reasoning for your analysis, explaining how the data points led to your conclusion.
  6. List the most important factors that influenced your prediction.

  The final output must be a JSON object that strictly adheres to the output schema.
  `,
});

const predictGovernanceOutcomeFlow = ai.defineFlow(
  {
    name: 'predictGovernanceOutcomeFlow',
    inputSchema: PredictGovernanceOutcomeInputSchema,
    outputSchema: PredictGovernanceOutcomeOutputSchema,
  },
  async input => {
    const {output} = await predictGovernanceOutcomePrompt(input);
    return output!;
  }
);
