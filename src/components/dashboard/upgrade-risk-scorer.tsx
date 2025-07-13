
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { getUpgradeRiskScore } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { VolatilityChart } from './volatility-chart';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Calculating...' : 'Calculate Risk Score'}
    </Button>
  );
}

export function UpgradeRiskScorer() {
  const [state, formAction] = useActionState(getUpgradeRiskScore, initialState);
  const { toast } = useToast();
  const [upgradeType, setUpgradeType] = useState('');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (state?.error && typeof state.error === 'string') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
     if (state?.data?.volatilityPrediction) {
      const formattedData = state.data.volatilityPrediction.predictedVolatility.map((value: number, index: number) => ({
        name: `Day ${index + 1}`,
        volatility: value,
        lowerBound: state.data.volatilityPrediction.confidenceIntervals[index].lowerBound,
        upperBound: state.data.volatilityPrediction.confidenceIntervals[index].upperBound,
      }));
      setChartData(formattedData);
    } else {
        setChartData([]);
    }
  }, [state, toast]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Calculate a multi-factor upgrade risk score and get actionable recommendations. Includes a volatility forecast.
      </p>
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="network">Network Selection</Label>
            <Select name="network">
              <SelectTrigger id="network">
                <SelectValue placeholder="Select Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Polygon">Polygon</SelectItem>
                <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                <SelectItem value="Solana">Solana</SelectItem>
                <SelectItem value="Bitcoin">Bitcoin</SelectItem>
              </SelectContent>
            </Select>
            {state?.error?.network && <p className="text-xs text-destructive">{state.error.network[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="upgradeType">Upgrade Type</Label>
            <Select name="upgradeType" onValueChange={setUpgradeType}>
              <SelectTrigger id="upgradeType">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Governance Proposal">Governance Proposal</SelectItem>
                <SelectItem value="Implementation Upgrade">Implementation Upgrade</SelectItem>
                <SelectItem value="Parameter Change">Parameter Change</SelectItem>
                <SelectItem value="Hard Fork">Hard Fork</SelectItem>
              </SelectContent>
            </Select>
            {state?.error?.upgradeType && <p className="text-xs text-destructive">{state.error.upgradeType[0]}</p>}
          </div>
        </div>

        {upgradeType === 'Governance Proposal' && (
          <div className="space-y-2">
            <Label htmlFor="proposalId">Snapshot Proposal ID</Label>
            <Input id="proposalId" name="proposalId" placeholder="e.g., 0x586de892e...b9d3" />
            {state?.error?.proposalId && <p className="text-xs text-destructive">{state.error.proposalId[0]}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="protocolAddress">Protocol Contract Address</Label>
          <Input id="protocolAddress" name="protocolAddress" placeholder="e.g., 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" />
          <p className="text-xs text-muted-foreground pt-1">The primary smart contract address of the protocol. Used to assess technical risk.</p>
          {state?.error?.protocolAddress && <p className="text-xs text-destructive">{state.error.protocolAddress[0]}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assetPairs">Asset Pairs</Label>
          <Input id="assetPairs" name="assetPairs" placeholder="e.g., ETH/USDC, wBTC/ETH" />
          {state?.error?.assetPairs && <p className="text-xs text-destructive">{state.error.assetPairs[0]}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="volatilityTolerance">Volatility Tolerance</Label>
            <Select name="volatilityTolerance">
              <SelectTrigger id="volatilityTolerance">
                <SelectValue placeholder="Select Tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            {state?.error?.volatilityTolerance && <p className="text-xs text-destructive">{state.error.volatilityTolerance[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="liquidityRequirements">Liquidity Requirements</Label>
            <Select name="liquidityRequirements">
              <SelectTrigger id="liquidityRequirements">
                <SelectValue placeholder="Select Requirements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            {state?.error?.liquidityRequirements && <p className="text-xs text-destructive">{state.error.liquidityRequirements[0]}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="timeHorizon">Time Horizon</Label>
                <Select name="timeHorizon">
                    <SelectTrigger id="timeHorizon">
                    <SelectValue placeholder="Select Horizon" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Short-term (1-7 days)">Short-term (1-7 days)</SelectItem>
                    <SelectItem value="Medium-term (1-4 weeks)">Medium-term (1-4 weeks)</SelectItem>
                    <SelectItem value="Long-term (1-6 months)">Long-term (1-6 months)</SelectItem>
                    </SelectContent>
                </Select>
                {state?.error?.timeHorizon && <p className="text-xs text-destructive">{state.error.timeHorizon[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="predictionWindow">Prediction Window (Days)</Label>
                <Input id="predictionWindow" name="predictionWindow" type="number" placeholder="e.g., 7" defaultValue="7" />
                 {state?.error?.predictionWindow && <p className="text-xs text-destructive">{state.error.predictionWindow[0]}</p>}
            </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Upgrade Description</Label>
          <Textarea id="description" name="description" placeholder="Describe the upgrade's purpose, scope, and potential impact..." />
          {state?.error?.description && <p className="text-xs text-destructive">{state.error.description[0]}</p>}
        </div>

        <SubmitButton />
      </form>

      {state?.data && (
        <Card className="mt-4 bg-secondary/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Risk Assessment Result</CardTitle>
            <div>
              <CardDescription>Overall Risk Score</CardDescription>
              <p className="text-3xl font-bold text-primary">{state.data.riskScore}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
             <div>
              <CardDescription className="font-semibold mb-2">Execution Guidance</CardDescription>
              <p className="text-sm">{state.data.executionGuidance}</p>
            </div>
            <Separator />
            <div>
              <CardDescription className="font-semibold mb-2">Volatility Forecast</CardDescription>
                <p className="text-sm text-muted-foreground mb-2">Model Accuracy (RMSE): {state.data.volatilityPrediction.modelAccuracy.toFixed(4)}</p>
                <VolatilityChart data={chartData} />
            </div>
            <Separator />
            <div>
              <CardDescription className="font-semibold mb-2">Risk Breakdown</CardDescription>
              <div className="text-sm space-y-2">
                <p><strong>Technical:</strong> {state.data.riskBreakdown.technicalRisk}</p>
                <p><strong>Governance:</strong> {state.data.riskBreakdown.governanceRisk}</p>
                <p><strong>Market:</strong> {state.data.riskBreakdown.marketRisk}</p>
                <p><strong>Liquidity:</strong> {state.data.riskBreakdown.liquidityRisk}</p>
              </div>
            </div>
            <Separator />
            <div>
              <CardDescription className="font-semibold mb-2">AI Predictions</CardDescription>
              <div className="text-sm space-y-2">
                <p><strong>Liquidity Shift:</strong> {state.data.liquidityShiftPrediction}</p>
              </div>
            </div>
            <Separator />
            <div>
              <CardDescription className="font-semibold mb-2">Trading Strategy</CardDescription>
              <div className="text-sm space-y-2">
                <p><strong>Execution Timing:</strong> {state.data.executionTiming}</p>
                <p><strong>Portfolio Rebalancing:</strong> {state.data.portfolioRebalancing}</p>
                <p><strong>Risk Mitigation:</strong> {state.data.riskMitigation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
