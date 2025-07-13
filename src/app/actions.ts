'use server';

import { z } from 'zod';
import {
  calculateUpgradeRisk,
  CalculateUpgradeRiskInput,
} from '@/ai/flows/upgrade-risk-scorer';
import {
  predictLiquidityShift,
  PredictLiquidityShiftInput,
} from '@/ai/flows/liquidity-shift-prediction';
import {
  analyzeTweetSentiment,
  AnalyzeTweetSentimentInput,
} from '@/ai/flows/sentiment-analysis-integration';
import {
    predictGovernanceOutcome,
    PredictGovernanceOutcomeInput,
} from '@/ai/flows/governance-outcome-prediction';
import { getMarketData } from '@/ai/services/market-data';
import fetch from 'node-fetch';

async function callPythonApi(endpoint: string, data: any) {
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';
    try {
        const response = await fetch(`${pythonApiUrl}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Python API Error:', errorBody);
            throw new Error(`Python API request failed: ${response.statusText}`);
        }
        return await response.json();
    } catch (e: any) {
        console.error(`Failed to fetch from Python API endpoint ${endpoint}:`, e.message);
        throw new Error(`Prediction Failed: fetch failed. Make sure the Python backend server is running.`);
    }
}


const upgradeRiskSchema = z.object({
  network: z.string().min(1, "Network is required."),
  protocolAddress: z.string().min(1, "Protocol address is required."),
  upgradeType: z.string().min(1, "Upgrade type is required."),
  proposalId: z.string().optional(),
  volatilityTolerance: z.string().min(1, "Volatility tolerance is required."),
  liquidityRequirements: z.string().min(1, "Liquidity requirements is required."),
  timeHorizon: z.string().min(1, "Time horizon is required."),
  assetPairs: z.string().min(1, "Asset pairs are required."),
  description: z.string().min(1, "Description is required."),
  predictionWindow: z.coerce.number().int().min(1, 'Prediction window must be at least 1 day.'),
});


export async function getUpgradeRiskScore(prevState: any, formData: FormData) {
  const validatedFields = upgradeRiskSchema.safeParse({
    network: formData.get('network'),
    protocolAddress: formData.get('protocolAddress'),
    upgradeType: formData.get('upgradeType'),
    proposalId: formData.get('proposalId'),
    volatilityTolerance: formData.get('volatilityTolerance'),
    liquidityRequirements: formData.get('liquidityRequirements'),
    timeHorizon: formData.get('timeHorizon'),
    assetPairs: formData.get('assetPairs'),
    description: formData.get('description'),
    predictionWindow: formData.get('predictionWindow'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const input: CalculateUpgradeRiskInput = {
    network: validatedFields.data.network,
    protocolAddress: validatedFields.data.protocolAddress,
    upgradeType: validatedFields.data.upgradeType,
    proposalId: validatedFields.data.proposalId,
    riskThresholds: {
        volatility: validatedFields.data.volatilityTolerance,
        liquidity: validatedFields.data.liquidityRequirements,
    },
    timeHorizon: validatedFields.data.timeHorizon,
    assetPairs: validatedFields.data.assetPairs,
    description: validatedFields.data.description,
    predictionWindow: validatedFields.data.predictionWindow,
  };


  try {
    const result = await calculateUpgradeRisk(input);
    return { data: result };
  } catch (e) {
    return { error: 'An unexpected error occurred.' };
  }
}

const liquidityShiftSchema = z.object({
  protocol: z.string().min(1, 'Protocol is required.'),
  timeframe: z.string().min(1, 'Timeframe is required.'),
});

export async function getLiquidityShift(prevState: any, formData: FormData) {
    const validatedFields = liquidityShiftSchema.safeParse({
        protocol: formData.get('protocol'),
        timeframe: formData.get('timeframe'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const result = await predictLiquidityShift(validatedFields.data as PredictLiquidityShiftInput);
        return { data: result };
    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred.' };
    }
}


const sentimentAnalysisSchema = z.object({
    topic: z.string().min(1, 'Topic is required.'),
});

export async function getSentimentAnalysis(prevState: any, formData: FormData) {
    const validatedFields = sentimentAnalysisSchema.safeParse({
        topic: formData.get('topic'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const result = await analyzeTweetSentiment(validatedFields.data as AnalyzeTweetSentimentInput);
        return { data: result };
    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred.' };
    }
}

const governanceOutcomeSchema = z.object({
    proposalId: z.string().min(1, 'Proposal ID is required.'),
});

export async function getGovernanceOutcome(prevState: any, formData: FormData) {
    const validatedFields = governanceOutcomeSchema.safeParse({
        proposalId: formData.get('proposalId'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const result = await predictGovernanceOutcome(validatedFields.data as PredictGovernanceOutcomeInput);
        return { data: result };
    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred.' };
    }
}


export async function getNetworkMetrics(asset: string) {
    try {
        const result = await getMarketData(asset);
        if (result.error) {
            return { error: result.error };
        }
        return { data: result };
    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred while fetching network metrics.' };
    }
}
