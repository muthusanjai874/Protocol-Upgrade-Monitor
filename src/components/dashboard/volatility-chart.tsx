
'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, ComposedChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  volatility: {
    label: 'Predicted Volatility',
    color: 'hsl(var(--chart-1))',
  },
  confidence: {
    label: 'Confidence Interval',
    color: 'hsl(var(--chart-2))',
    style: {
        strokeDasharray: '3 3'
    }
  }
} satisfies ChartConfig;

export function VolatilityChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map(d => ({
    ...d,
    confidence: [d.lowerBound, d.upperBound]
  }));

  return (
    <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => value.toFixed(3)}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="volatility" fill="var(--color-volatility)" radius={4} />
                <Area 
                    dataKey="confidence"
                    type="monotone"
                    fill="var(--color-confidence)"
                    stroke="var(--color-confidence)"
                    fillOpacity={0.2}
                    strokeWidth={0}
                    activeDot={false}
                />
            </ComposedChart>
        </ChartContainer>
    </div>
  );
}
