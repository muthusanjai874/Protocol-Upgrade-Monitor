'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { getGovernanceOutcome } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Predicting...' : 'Predict Outcome'}
    </Button>
  );
}

export function GovernancePredictor() {
  const [state, formAction] = useActionState(getGovernanceOutcome, initialState);
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

  const getPredictionBadgeVariant = (prediction?: 'Likely to Pass' | 'Likely to Fail' | 'Too Close to Call') => {
    switch (prediction) {
      case 'Likely to Pass':
        return 'default';
      case 'Likely to Fail':
        return 'destructive';
      case 'Too Close to Call':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Predict the likelihood of a Snapshot.org governance proposal passing or failing.
      </p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="proposalId">Snapshot Proposal ID</Label>
          <Input id="proposalId" name="proposalId" placeholder="e.g., 0x586de892e...b9d3" />
          {state?.error?.proposalId && <p className="text-xs text-destructive">{state.error.proposalId[0]}</p>}
        </div>
        <SubmitButton />
      </form>

      {state?.data && (
        <Card className="mt-4 bg-secondary/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Prediction Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-2 sm:space-y-0">
                <Badge variant={getPredictionBadgeVariant(state.data.prediction)} className="capitalize text-lg w-fit">
                    {state.data.prediction}
                </Badge>
                <div className='text-sm'>
                    <span className='text-muted-foreground'>Confidence: </span>
                    <span className='font-bold'>{(state.data.confidence * 100).toFixed(1)}%</span>
                </div>
             </div>
             <div>
                <CardDescription>Reasoning</CardDescription>
                <p className="text-sm">{state.data.reasoning}</p>
             </div>
             <Separator />
             <div>
                <CardDescription className="mb-2">Key Factors</CardDescription>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    {state.data.keyFactors.map((factor: string, index: number) => (
                        <li key={index}>{factor}</li>
                    ))}
                </ul>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
