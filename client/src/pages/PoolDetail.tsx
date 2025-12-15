import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { NavChart } from "@/components/NavChart";
import { KeyMetrics } from "@/components/KeyMetrics";
import { EnhancedDataSources } from "@/components/EnhancedDataSources";
import { EnhancedAIExplanation } from "@/components/EnhancedAIExplanation";
import { VerifyAuditability } from "@/components/VerifyAuditability";
import { ChainlinkDataFeeds } from "@/components/ChainlinkDataFeeds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useRealtimeData } from "@/hooks/useRealtimeData";

const PoolDetail = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  const { pools } = useRealtimeData();

  const pool = pools.find((p) => p.id === poolId);

  if (!pool) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-lg font-bold text-foreground mb-3">Pool not found</h1>
            <Button onClick={() => navigate("/")} size="sm" className="text-xs">Return to Overview</Button>
          </div>
        </main>
      </div>
    );
  }

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    if (value < 0.01) return `$${value.toFixed(8)}`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 gap-1.5 text-xs text-muted-foreground hover:text-foreground h-7 px-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Button>

        {/* Hero Card */}
        <div className="glass-card p-4 lg:p-5 mb-4 animate-fade-in glow-primary">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left Side */}
            <div className="space-y-2">
              <div>
                <h1 className="text-lg font-bold text-foreground mb-0.5">
                  {pool.name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {pool.tag} · {pool.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[10px]">{pool.assetType}</Badge>
                <Badge variant="muted" className="text-[10px]">{pool.riskLevel}</Badge>
                <Badge variant="outline" className="text-[10px]">#{poolId}</Badge>
              </div>
            </div>

            {/* Right Side */}
            <div className="lg:text-right space-y-2">
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5">Latest NAV</p>
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {formatValue(pool.latestNav)}
                </p>
              </div>

              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground">
                  Prev: {formatValue(pool.previousNav)}
                </p>
                <div className={`flex items-center gap-0.5 lg:justify-end text-xs font-medium ${
                  pool.change24h >= 0 ? "text-success" : "text-destructive"
                }`}>
                  {pool.change24h >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span className="tabular-nums">
                    {pool.change24h >= 0 ? "+" : ""}{pool.change24h.toFixed(2)}% (24h)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 lg:justify-end">
                <div className={`status-dot ${pool.status === "Healthy" ? "status-healthy" : pool.status === "Needs Review" ? "status-warning" : "status-stale"}`} />
                <span className="text-[10px] text-muted-foreground">
                  {pool.lastUpdated}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <NavChart poolId={poolId || ""} baseValue={pool.latestNav} />
          </div>
          <div>
            <KeyMetrics poolId={poolId || ""} baseNav={pool.latestNav} />
          </div>
        </div>

        {/* Data Sources & Chainlink */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <EnhancedDataSources 
            poolId={poolId || ""} 
            assetType={pool.assetType} 
            baseValue={pool.latestNav} 
          />
          <ChainlinkDataFeeds 
            poolId={poolId || ""} 
            assetType={pool.assetType} 
          />
        </div>

        {/* AI Explanation & Auditability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EnhancedAIExplanation poolId={poolId || ""} />
          <VerifyAuditability poolId={poolId || ""} poolName={pool.name} />
        </div>
      </main>
    </div>
  );
};

export default PoolDetail;
