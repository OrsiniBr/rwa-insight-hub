import { useState, useEffect } from "react";
import { Coins, TrendingUp, Clock, AlertCircle, Activity } from "lucide-react";
import { useRealtimeData } from "@/hooks/useRealtimeData";

interface KeyMetricsProps {
  poolId: string;
  baseNav?: number;
}

export function KeyMetrics({ poolId, baseNav = 10254398.21 }: KeyMetricsProps) {
  const { pools, mantleData, lastPriceUpdate } = useRealtimeData();
  const pool = pools.find(p => p.id === poolId);
  
  const [metrics, setMetrics] = useState({
    currentNav: baseNav,
    unitsOutstanding: 10000000,
    navPerToken: baseNav / 10000000,
    oracleDeviation: 0.02,
  });

  useEffect(() => {
    if (pool) {
      setMetrics({
        currentNav: pool.latestNav,
        unitsOutstanding: pool.unitsOutstanding || 10000000,
        navPerToken: pool.unitPrice || pool.latestNav / (pool.unitsOutstanding || 10000000),
        oracleDeviation: Math.abs(pool.change24h) * 0.01, // Deviation based on volatility
      });
    }
  }, [pool]);

  const formatValue = (value: number, decimals: number = 2) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(decimals)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(decimals)}K`;
    return `$${value.toFixed(4)}`;
  };

  const formatUnits = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toLocaleString();
  };

  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((Date.now() - lastPriceUpdate.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  const metricsData = [
    {
      label: "Current NAV",
      value: formatValue(metrics.currentNav),
      icon: Coins,
      sublabel: pool?.priceData ? `${pool.tag}: $${pool.priceData.currentPrice.toLocaleString()}` : null,
    },
    {
      label: "Units Outstanding",
      value: formatUnits(metrics.unitsOutstanding),
      icon: TrendingUp,
      sublabel: null,
    },
    {
      label: "NAV per Token",
      value: `$${metrics.navPerToken.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`,
      icon: Coins,
      sublabel: pool?.priceData ? `24h High: $${pool.priceData.high24h?.toLocaleString() || "N/A"}` : null,
    },
    {
      label: "Oracle Deviation",
      value: `${metrics.oracleDeviation.toFixed(3)}%`,
      icon: AlertCircle,
      sublabel: pool?.priceData ? `24h Low: $${pool.priceData.low24h?.toLocaleString() || "N/A"}` : null,
    },
    {
      label: "Last Price Update",
      value: getTimeSinceUpdate(),
      icon: Clock,
      sublabel: mantleData?.currentBlockNumber ? `Block #${mantleData.currentBlockNumber.toLocaleString()}` : null,
    },
    {
      label: "Network Status",
      value: mantleData?.latestBlock ? "Active" : "Connecting...",
      icon: Activity,
      sublabel: mantleData?.latestBlock ? `${mantleData.recentTransactions.length} recent txs` : null,
    },
  ];

  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-foreground">Key Metrics</h3>
        <span className="text-[9px] text-primary">Live Data</span>
      </div>
      <div className="space-y-2.5">
        {metricsData.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-1.5">
                <metric.icon className="h-3 w-3 text-primary" />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">{metric.label}</span>
                {metric.sublabel && (
                  <span className="text-[8px] text-muted-foreground/70">{metric.sublabel}</span>
                )}
              </div>
            </div>
            <span className="text-xs font-medium text-foreground tabular-nums">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
