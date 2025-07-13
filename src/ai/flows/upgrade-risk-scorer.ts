'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getMarketDataTool } from '../tools/market-data';
import { getContractInfoTool } from '../tools/etherscan';
import { getSnapshotProposalTool } from '../tools/snapshot';
import { predictVolatilityTool } from '../tools/volatility-model';

const CalculateUpgradeRiskInputSchema = z.object({
  network: z.string().describe('The blockchain network (e.g., Ethereum, Polygon).'),
  protocolAddress: z.string().describe('The smart contract address to monitor.'),
  upgradeType: z.string().describe('The type of upgrade (e.g., Governance proposal, Implementation upgrade).'),
  proposalId: z.string().optional().describe('The Snapshot.org proposal ID, if the upgrade type is "Governance Proposal".'),
  riskThresholds: z.object({
    volatility: z.string().describe('User-defined volatility tolerance (e.g., "High", "Medium", "Low").'),
    liquidity: z.string().describe('User-defined liquidity requirement (e.g., "High", "Medium", "Low").'),
  }),
  timeHorizon: z.string().describe('The impact analysis time horizon (e.g., "Short-term", "Long-term").'),
  assetPairs: z.string().describe('The token pairs affected by the upgrade.'),
  description: z.string().describe('A detailed description of the upgrade, including its purpose, scope, and potential impact.'),
  predictionWindow: z.number().describe('The number of days to predict volatility for after the upgrade.'),
});
export type CalculateUpgradeRiskInput = z.infer<
  typeof CalculateUpgradeRiskInputSchema
>;

const CalculateUpgradeRiskOutputSchema = z.object({
  riskScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'The overall upgrade risk score on a 0-100 scale, based on a multi-factor assessment.'
    ),
  riskBreakdown: z.object({
      technicalRisk: z.string().describe('Analysis of the technical risk, including smart contract complexity, transaction count, and verification status.'),
      governanceRisk: z.string().describe('Analysis of governance risk, like voter participation and proposal history.'),
      marketRisk: z.string().describe('Analysis of market risk, including correlation with broader market movements.'),
      liquidityRisk: z.string().describe('Analysis of liquidity risk, such as TVL concentration and DEX volume.'),
  }),
  volatilityPrediction: z.object({
    predictedVolatility: z.array(z.number()).describe('The predicted volatility for each day in the prediction window.'),
    modelAccuracy: z.number().describe('The simulated accuracy of the GARCH model used for prediction (e.g., RMSE).'),
    confidenceIntervals: z.array(z.object({
      lowerBound: z.number(),
      upperBound: z.number(),
    })).describe('Confidence intervals for the volatility predictions.'),
  }),
  liquidityShiftPrediction: z.string().describe("A qualitative summary of the predicted liquidity shifts."),
  executionGuidance: z.string().describe('Overall recommendation and guidance for execution.'),
  executionTiming: z.string().describe('Recommendation for optimal entry/exit windows for trading strategies.'),
  portfolioRebalancing: z.string().describe('Specific asset allocation adjustment recommendations.'),
  riskMitigation: z.string().describe('Hedging recommendations or other strategies to mitigate identified risks.'),
});
export type CalculateUpgradeRiskOutput = z.infer<
  typeof CalculateUpgradeRiskOutputSchema
>;

export async function calculateUpgradeRisk(
  input: CalculateUpgradeRiskInput
): Promise<CalculateUpgradeRiskOutput> {
  return calculateUpgradeRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateUpgradeRiskPrompt',
  input: {schema: CalculateUpgradeRiskInputSchema},
  output: {schema: CalculateUpgradeRiskOutputSchema},
  tools: [getMarketDataTool, getContractInfoTool, getSnapshotProposalTool, predictVolatilityTool],
  prompt: `You are an expert in assessing risks for blockchain protocol upgrades for a sophisticated trader.

You will receive a detailed, structured request about a specific protocol upgrade. Based on this information, perform a comprehensive multi-factor risk assessment.

Your analysis must cover:
1.  **Technical Risk**: Based on the upgrade type and description. You MUST use the getContractInfoTool to fetch details about the protocolAddress on the specified network. Analyze the contract's verification status and transaction history to inform your technical risk assessment.
2.  **Governance Risk**: Based on the network and upgrade type. If the upgrade type is "Governance Proposal" and a proposalId is provided, you MUST use the getSnapshotProposalTool to fetch live data about the proposal. Use this data (voter participation, current results, etc.) to inform your governance risk assessment.
3.  **Market Risk**: Based on the asset pairs and time horizon. To do this, you MUST use the getMarketData tool to fetch live market data for the primary asset in the asset pairs.
4.  **Liquidity Risk**: Based on asset pairs and described impact.
5.  **Volatility Prediction**: You MUST use the predictVolatilityTool to get a GARCH(1,1) model simulation for the volatility impact. The primary asset in the 'assetPairs' should be the asset ticker. Use the user's 'description' and 'predictionWindow' as inputs for the tool. The tool will return the quantitative data for the prediction.

Based on this comprehensive analysis, you will:
- Calculate a single, overall **risk score** from 0 to 100.
- Provide a detailed **risk breakdown** for each of the four risk factors, incorporating any real-time data you fetched.
- Take the raw output from the predictVolatilityTool and place it in the 'volatilityPrediction' field of the final JSON output.
- Summarize the predicted **liquidity shifts**.
- Provide high-level **execution guidance**.
- Suggest optimal **execution timing** (entry/exit windows).
- Provide actionable **portfolio rebalancing** recommendations.
- Recommend specific **risk mitigation** strategies (e.g., hedging).

The user has specified their risk thresholds. Tailor your rebalancing and mitigation recommendations to align with their tolerance (Volatility: {{{riskThresholds.volatility}}}, Liquidity: {{{riskThresholds.liquidity}}}).

**Upgrade Details:**
- Network: {{{network}}}
- Protocol Address: {{{protocolAddress}}}
- Upgrade Type: {{{upgradeType}}}
{{#if proposalId}}- Snapshot Proposal ID: {{{proposalId}}}{{/if}}
- Time Horizon: {{{timeHorizon}}}
- Affected Asset Pairs: {{{assetPairs}}}
- Prediction Window: {{{predictionWindow}}} days
- Description: {{{description}}}

Generate a JSON object with the results. Be specific and quantitative where possible in your recommendations.
`,
});

const calculateUpgradeRiskFlow = ai.defineFlow(
  {
    name: 'calculateUpgradeRiskFlow',
    inputSchema: CalculateUpgradeRiskInputSchema,
    outputSchema: CalculateUpgradeRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
