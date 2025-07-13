'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import fetch from 'node-fetch';

async function callPythonApi(endpoint: string, data: any) {
  const pythonApiUrl = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';
  try {
    const response = await fetch(`${pythonApiUrl}/${endpoint}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Python API Error:', errorBody);
      throw new Error(
        `Python API request failed: ${response.statusText} - ${errorBody}`
      );
    }
    return await response.json();
  } catch (e: any) {
    console.error(
      `Failed to fetch from Python API endpoint ${endpoint}:`,
      e.message
    );
    return {
      error: `Prediction Failed: Could not connect to the Python backend service.`,
    };
  }
}

export const predictVolatilityTool = ai.defineTool(
  {
    name: 'predictVolatilityTool',
    description:
      'Calls a Python backend to run a GARCH(1,1) model simulation for predicting asset volatility. Use this to fulfill volatility prediction requests.',
    inputSchema: z.object({
      assetTicker: z
        .string()
        .describe('The ticker symbol of the asset (e.g., ETH, BTC).'),
      upgradeDescription: z
        .string()
        .describe(
          'The user-provided description of the upgrade event. This context is used to influence the volatility simulation.'
        ),
      predictionWindow: z
        .number()
        .describe(
          'The number of days into the future to predict volatility for.'
        ),
    }),
    outputSchema: z.object({
      predictedVolatility: z.array(z.number()).optional(),
      modelAccuracy: z.number().optional(),
      confidenceIntervals: z
        .array(
          z.object({
            lowerBound: z.number(),
            upperBound: z.number(),
          })
        )
        .optional(),
      error: z.string().optional(),
    }),
  },
  async input => {
    return await callPythonApi('predict_volatility', input);
  }
);
