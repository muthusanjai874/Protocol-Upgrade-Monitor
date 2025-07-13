'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getProposalInfo } from '../services/snapshot';

export const getSnapshotProposalTool = ai.defineTool(
  {
    name: 'getSnapshotProposalTool',
    description: 'Returns live information about a governance proposal from Snapshot.org, including its current state, vote counts, and scores.',
    inputSchema: z.object({
      proposalId: z.string().describe('The unique ID of the proposal on Snapshot.org.'),
    }),
    outputSchema: z.object({
        id: z.string().optional(),
        title: z.string().optional(),
        state: z.string().optional(),
        space: z.string().optional(),
        totalVotes: z.number().optional(),
        totalScore: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        results: z.array(z.object({
            choice: z.string(),
            score: z.number(),
        })).optional(),
        error: z.string().optional(),
    }),
  },
  async (input) => {
    return await getProposalInfo(input.proposalId);
  }
);
