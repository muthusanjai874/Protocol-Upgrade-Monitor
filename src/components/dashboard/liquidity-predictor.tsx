'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { getLiquidityShift } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Predicting...' : 'Predict Liquidity Shift'}
    </Button>
  );
}

export function LiquidityPredictor() {
  const [state, formAction] = useActionState(getLiquidityShift, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error && typeof state.error !== 'object') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Forecast TVL movements to predict potential liquidity shifts using live data from DeFi Llama.
      </p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="protocol">Protocol Slug</Label>
          <Input id="protocol" name="protocol" placeholder="e.g., aave, uniswap, maker" />
          {state?.error?.protocol && <p className="text-xs text-destructive">{state.error.protocol[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeframe">Prediction Timeframe</Label>
          <Input id="timeframe" name="timeframe" placeholder="e.g., next 7 days, next month" />
          {state?.error?.timeframe && <p className="text-xs text-destructive">{state.error.timeframe[0]}</p>}
        </div>
        <SubmitButton />
      </form>

      {state?.data && (
        <Card className="mt-4 bg-secondary/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Prediction Result</CardTitle>
             <CardDescription>Confidence Score: {state.data.confidenceScore.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <CardDescription>Predicted TVL Movements</CardDescription>
              <p className="text-sm font-medium">{state.data.predictedTvlMovements}</p>
            </div>
            <Separator />
            <div>
              <CardDescription>Historical Data Analysis</CardDescription>
              <p className="text-sm">{state.data.analysisSummary}</p>
            </div>
            <Separator />
            <div>
              <CardDescription>Risk Assessment</CardDescription>
              <p className="text-sm">{state.data.riskAssessment}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
