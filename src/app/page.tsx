import { Header } from "@/components/dashboard/header";
import { NetworkMetrics } from "@/components/dashboard/network-metrics";
import { UpgradeTimeline } from "@/components/dashboard/upgrade-timeline";
import { ExecutionGuidance } from "@/components/dashboard/execution-guidance";
import { AiTools } from "@/components/dashboard/ai-tools";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full max-w-screen-2xl mx-auto">
          {/* Left Column */}
          <aside className="xl:col-span-3">
            <div className="sticky top-6">
              <AiTools />
            </div>
          </aside>

          {/* Center Column */}
          <div className="xl:col-span-6 space-y-6">
            <NetworkMetrics />
            <UpgradeTimeline />
          </div>

          {/* Right Column */}
          <aside className="xl:col-span-3">
             <div className="sticky top-6">
              <ExecutionGuidance />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
