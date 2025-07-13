import { Logo } from "@/components/icons";

export function Header() {
  return (
    <header className="px-4 md:px-6 lg:px-8 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-4 max-w-screen-2xl mx-auto">
        <Logo className="h-8 w-8" />
        <div>
          <h1 className="text-xl md:text-2xl font-headline font-semibold text-foreground">
            Protocol Upgrade Monitor
          </h1>
          <p className="text-sm text-muted-foreground">
            Advanced Monitoring & Risk Assessment for DeFi Protocol Upgrades
          </p>
        </div>
      </div>
    </header>
  );
}
