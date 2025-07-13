'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getContractInfo } from '../services/etherscan';

export const getContractInfoTool = ai.defineTool(
  {
    name: 'getContractInfoTool',
    description: 'Returns information about a smart contract on a given network, such as its verification status and transaction count. Supports Ethereum, Polygon, and Arbitrum.',
    inputSchema: z.object({
      network: z.string().describe('The blockchain network to query (e.g., "Ethereum", "Polygon", "Arbitrum").'),
      address: z.string().describe('The smart contract address to look up.'),
    }),
    outputSchema: z.object({
        address: z.string().optional(),
        isVerified: z.boolean().optional(),
        contractName: z.string().optional(),
        transactionCount: z.number().optional(),
        error: z.string().optional(),
    }),
  },
  async (input) => {
    return await getContractInfo(input.network, input.address);
  }
);
