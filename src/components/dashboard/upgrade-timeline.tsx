import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { CalendarClock } from "lucide-react";

type RiskLevel = "Low" | "Medium" | "High";

const upgrades = [
  {
    protocol: "Ethereum",
    upgradeName: "Dencun",
    date: "2024-03-13",
    risk: "Medium" as RiskLevel,
    status: "Completed",
  },
  {
    protocol: "ChainLink",
    upgradeName: "CCIP Mainnet",
    date: "2024-07-17",
    risk: "High" as RiskLevel,
    status: "Completed",
  },
  {
    protocol: "Solana",
    upgradeName: "v2.1.5 Patch",
    date: "2024-09-12",
    risk: "Low" as RiskLevel,
    status: "Upcoming",
  },
  {
    protocol: "Avalanche",
    upgradeName: "Cortina 12",
    date: "2024-10-25",
    risk: "Medium" as RiskLevel,
    status: "Upcoming",
  },
  {
    protocol: "Polygon",
    upgradeName: "PoS v2 Hardfork",
    date: "2024-11-05",
    risk: "High" as RiskLevel,
    status: "Upcoming",
  },
];

const riskVariantMapping: Record<RiskLevel, "default" | "secondary" | "destructive"> = {
  Low: "default",
  Medium: "secondary",
  High: "destructive",
};

export function UpgradeTimeline() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Protocol Upgrade Timeline</CardTitle>
        </div>
        <CardDescription>A calendar of key upcoming and completed network upgrades.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protocol</TableHead>
              <TableHead>Upgrade</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upgrades.map((upgrade) => (
              <TableRow key={upgrade.upgradeName}>
                <TableCell className="font-medium">{upgrade.protocol}</TableCell>
                <TableCell>{upgrade.upgradeName}</TableCell>
                <TableCell>{upgrade.date}</TableCell>
                <TableCell>
                  <Badge variant={riskVariantMapping[upgrade.risk]}>{upgrade.risk}</Badge>
                </TableCell>
                <TableCell>
                    <Badge variant={upgrade.status === 'Completed' ? 'outline' : 'default'} className={upgrade.status !== 'Completed' ? `bg-accent/80 text-accent-foreground` : ''}>
                        {upgrade.status}
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
