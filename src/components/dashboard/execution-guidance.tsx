import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertTriangle, Lightbulb, ShieldCheck, TrendingUp } from "lucide-react"

const guidanceItems = [
  {
    id: 1,
    title: "High Risk: Polygon PoS v2",
    content: "Consider reducing exposure to MATIC 48 hours prior to the upgrade. High complexity and potential for volatility noted.",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  {
    id: 2,
    title: "Opportunity: Solana v2.1.5",
    content: "Low-risk patch may attract positive sentiment. Monitor social channels for bullish signals post-upgrade.",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    id: 3,
    title: "General Recommendation",
    content: "Review liquidity pool positions for assets undergoing medium-to-high risk upgrades. Temporary liquidity shifts are probable.",
    icon: ShieldCheck,
    color: "text-accent-foreground",
    bgColor: "bg-accent/20",
    borderColor: "border-accent/50"
  },
]

export function ExecutionGuidance() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Execution Guidance</CardTitle>
        </div>
        <CardDescription>Actionable insights based on market analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {guidanceItems.map((item) => (
            <div key={item.id} className={`p-4 rounded-lg border ${item.borderColor || 'border-border'} ${item.bgColor || 'bg-card'}`}>
              <div className="flex items-start gap-3">
                <item.icon className={`h-5 w-5 mt-1 shrink-0 ${item.color}`} />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
