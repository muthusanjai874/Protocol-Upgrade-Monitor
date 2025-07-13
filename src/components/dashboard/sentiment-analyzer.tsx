'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { getSentimentAnalysis } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Analyzing...' : 'Analyze Sentiment'}
    </Button>
  );
}

export function SentimentAnalyzer() {
  const [state, formAction] = useActionState(getSentimentAnalysis, initialState);
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

  const getSentimentBadgeVariant = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
        case 'positive':
            return 'default';
        case 'negative':
            return 'destructive';
        case 'neutral':
            return 'secondary';
        default:
            return 'outline';
    }
  }
  
    const getSentimentIcon = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-primary-foreground" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-destructive-foreground" />;
      default:
        return <MessageCircle className="h-4 w-4 text-secondary-foreground" />;
    }
  };


  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Analyze real-time Twitter sentiment for any topic or crypto asset.
      </p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic or Asset</Label>
          <Input id="topic" name="topic" placeholder="e.g. bitcoin, $ETH" />
          {state?.error?.topic && <p className="text-xs text-destructive">{state.error.topic[0]}</p>}
        </div>
        <SubmitButton />
      </form>

      {state?.data && (
        <Card className="mt-4 bg-secondary/50">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-2 sm:space-y-0">
                <Badge variant={getSentimentBadgeVariant(state.data.overallSentiment)} className="capitalize text-lg w-fit">
                    {state.data.overallSentiment}
                </Badge>
                <div className='text-sm'>
                    <span className='text-muted-foreground'>Confidence: </span>
                    <span className='font-bold'>{(state.data.confidence * 100).toFixed(1)}%</span>
                </div>
             </div>
             <div>
                <CardDescription>Summary</CardDescription>
                <p className="text-sm">{state.data.summary}</p>
             </div>
             <Separator />
             <div>
                <CardDescription className="mb-2">Analyzed Tweets</CardDescription>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {state.data.analyzedTweets.map((item: any, index: number) => (
                        <div key={index} className='text-sm p-3 bg-background/50 rounded-md'>
                           <p className='italic mb-2'>"{item.tweet}"</p>
                           <div className='flex items-center gap-2'>
                                <Badge variant={getSentimentBadgeVariant(item.sentiment)} className="capitalize w-fit">
                                    <div className="flex items-center gap-1.5">
                                        {getSentimentIcon(item.sentiment)}
                                        <span>{item.sentiment}</span>
                                    </div>
                                </Badge>
                                <p className='text-xs text-muted-foreground'>{item.reasoning}</p>
                           </div>
                        </div>
                    ))}
                </div>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
