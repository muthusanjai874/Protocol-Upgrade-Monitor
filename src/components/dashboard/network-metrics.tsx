
'use client';

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Gauge, DollarSign, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getNetworkMetrics } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";

type Metric = {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  previousValue?: string;
};

const initialMetrics: Metric[] = [
    { title: "Price (USD)", value: "...", icon: DollarSign, description: "Live price from CoinGecko" },
    { title: "Market Cap", value: "...", icon: Gauge, description: "Total market value" },
    { title: "Volume (24h)", value: "...", icon: Activity, description: "Total value traded" },
    { title: "Change (24h)", value: "...", icon: Percent, description: "Price change in 24 hours" },
];

export function NetworkMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    const response = await getNetworkMetrics('ethereum');
    if (response.data && !response.error) {
        setMetrics(currentMetrics => [
            { 
                ...currentMetrics[0], 
                value: `$${response.data.price_usd?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}`,
                previousValue: currentMetrics[0].value
            },
            { 
                ...currentMetrics[1], 
                value: `$${(response.data.market_cap_usd ?? 0).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 2 })}`,
                previousValue: currentMetrics[1].value
            },
            { 
                ...currentMetrics[2], 
                value: `$${(response.data.total_volume_usd ?? 0).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 2 })}`,
                previousValue: currentMetrics[2].value
            },
            { 
                ...currentMetrics[3], 
                value: `${response.data.price_change_percentage_24h?.toFixed(2) ?? '0.00'}%`,
                previousValue: currentMetrics[3].value
            },
        ]);
    }
     if (loading) setLoading(false);
  }, [loading]);

  useEffect(() => {
    fetchMetrics(); // Initial fetch
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return (
    <div>
        <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-headline">Ethereum Network</h2>
            <Badge variant="outline" className="text-primary border-primary">
                <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Live
            </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
            <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <>
                        <Skeleton className="h-8 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-1/2" />
                    </>
                ) : (
                    <>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </>
                )}
            </CardContent>
            </Card>
        ))}
        </div>
    </div>
  );
}
