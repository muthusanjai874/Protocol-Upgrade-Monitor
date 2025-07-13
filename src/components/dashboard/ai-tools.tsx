'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { UpgradeRiskScorer } from "./upgrade-risk-scorer";
import { LiquidityPredictor } from "./liquidity-predictor";
import { SentimentAnalyzer } from "./sentiment-analyzer";
import { GovernancePredictor } from "./governance-predictor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export function AiTools() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Bot className="w-6 h-6 text-primary" />
        <CardTitle className="font-headline">AI Analysis Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold">Upgrade Risk Scoring</AccordionTrigger>
            <AccordionContent>
              <UpgradeRiskScorer />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold">Liquidity Shift Prediction</AccordionTrigger>
            <AccordionContent>
                <LiquidityPredictor />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-semibold">Sentiment Analysis</AccordionTrigger>
            <AccordionContent>
                <SentimentAnalyzer />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="font-semibold">Governance Outcome Prediction</AccordionTrigger>
            <AccordionContent>
                <GovernancePredictor />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
