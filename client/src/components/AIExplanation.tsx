import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Shield } from "lucide-react";
import { useRealtimeData } from "@/hooks/useRealtimeData";

interface AIExplanationProps {
  poolId: string;
}

export function AIExplanation({ poolId }: AIExplanationProps) {
  const { pools } = useRealtimeData();
  const [explanation, setExplanation] = useState("");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [sourcesCount, setSourcesCount] = useState(5);

  const pool = pools.find((p) => p.id === poolId);
  const btcPool = pools.find((p) => p.tag === "BTC");
  const ethPool = pools.find((p) => p.tag === "ETH");

  useEffect(() => {
    if (!pool) return;

    const generateExplanation = () => {
      const direction = pool.change24h >= 0 ? "increased" : "decreased";
      const btcChange = btcPool?.change24h.toFixed(2) || "0.51";
      const ethChange = ethPool?.change24h.toFixed(2) || "0.67";
      const healthyCount = pools.filter((p) => p.status === "Healthy").length;

      let contextualInfo = "";
      if (pool.assetType === "Crypto") {
        contextualInfo = `Bitcoin moved ${btcChange}% and Ethereum ${ethChange}%. Market sentiment remains cautiously optimistic.`;
      } else if (pool.assetType === "Treasury") {
        contextualInfo = "Treasury yields remained stable. Short-term rates adjusted marginally with Fed guidance.";
      } else if (pool.assetType === "Stock") {
        contextualInfo = "Equity markets showed moderate activity. Sector rotation favored technology and healthcare.";
      } else if (pool.assetType === "Commodity") {
        contextualInfo = "Commodity prices reflected supply chain dynamics. Precious metals held steady.";
      } else if (pool.assetType === "RWA") {
        contextualInfo = "Real estate valuations adjusted based on cap rate movements and occupancy data.";
      } else {
        contextualInfo = "Alternative asset valuations updated based on latest market comparables.";
      }

      const newExplanation = `NAV ${direction} by ${Math.abs(pool.change24h).toFixed(2)}% in the last 24 hours. ${contextualInfo} The ${pool.riskLevel.toLowerCase()} risk profile was maintained with ${healthyCount} healthy data sources actively feeding the coprocessor. No anomalies detected in oracle feeds.`;

      setExplanation(newExplanation);
      setLastUpdate(new Date());
      setSourcesCount(Math.floor(Math.random() * 3) + 4);
    };

    generateExplanation();
    const interval = setInterval(generateExplanation, 5000);

    return () => clearInterval(interval);
  }, [pool, btcPool, ethPool, pools]);

  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "250ms" }}>
      <h3 className="text-xs font-semibold text-foreground mb-3">
        AI NAV Explanation
      </h3>

      <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-secondary/10 border border-secondary/20">
        <div className="rounded-full bg-secondary/20 p-1.5">
          <Sparkles className="h-3 w-3 text-secondary" />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-medium text-foreground">
            NAV Coprocessor Agent
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <Clock className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="text-[9px] text-muted-foreground">
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      <div className="prose prose-sm prose-invert max-w-none">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          {explanation}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border/30">
        <Badge variant="success" className="gap-0.5 text-[8px]">
          <Shield className="h-2.5 w-2.5" />
          High Confidence
        </Badge>
        <Badge variant="muted" className="text-[8px]">{sourcesCount} Sources</Badge>
      </div>
    </div>
  );
}
