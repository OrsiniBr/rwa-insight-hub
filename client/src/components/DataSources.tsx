import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Database, LineChart, Globe, FileText } from "lucide-react";
import { generatePriceChange, formatTimeAgo } from "@/lib/realtime-data";

interface DataSource {
  name: string;
  type: "Price Oracle" | "FX" | "On-Chain Position" | "Off-Chain Accounting";
  value: number;
  lastUpdated: number;
  format: "currency" | "rate" | "amount";
}

const initialSources: DataSource[] = [
  { name: "Chainlink BTC/USD", type: "Price Oracle", value: 67234.52, lastUpdated: 1, format: "currency" },
  { name: "Chainlink ETH/USD", type: "Price Oracle", value: 3521.88, lastUpdated: 1, format: "currency" },
  { name: "Chainlink EUR/USD", type: "FX", value: 1.0842, lastUpdated: 2, format: "rate" },
  { name: "Treasury Vault", type: "On-Chain Position", value: 10254398, lastUpdated: 5, format: "amount" },
  { name: "NAV Admin Report", type: "Off-Chain Accounting", value: 52950000, lastUpdated: 15, format: "amount" },
];

const getTypeIcon = (type: DataSource["type"]) => {
  switch (type) {
    case "Price Oracle": return LineChart;
    case "FX": return Globe;
    case "On-Chain Position": return Database;
    case "Off-Chain Accounting": return FileText;
  }
};

const getTypeBadgeVariant = (type: DataSource["type"]) => {
  switch (type) {
    case "Price Oracle": return "secondary";
    case "FX": return "warning";
    case "On-Chain Position": return "success";
    case "Off-Chain Accounting": return "muted";
  }
};

export function DataSources() {
  const [sources, setSources] = useState(initialSources);

  useEffect(() => {
    const interval = setInterval(() => {
      setSources((prev) =>
        prev.map((source) => ({
          ...source,
          value: generatePriceChange(source.value, source.type === "Price Oracle" ? 0.002 : 0.0005),
          lastUpdated: Math.max(0, source.lastUpdated),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, format: DataSource["format"]) => {
    if (format === "rate") return `Rate: ${value.toFixed(4)}`;
    if (format === "amount") return `$${(value / 1000000).toFixed(2)}M`;
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <h3 className="text-xs font-semibold text-foreground mb-4">
        Data Sources & Inputs
      </h3>

      <div className="space-y-2.5">
        {sources.map((source) => {
          const Icon = getTypeIcon(source.type);
          return (
            <div
              key={source.name}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/20 transition-colors"
            >
              <div className="rounded-md bg-primary/10 p-1.5 shrink-0">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1.5 mb-1">
                  <span className="text-[10px] font-medium text-foreground">
                    {source.name}
                  </span>
                  <Badge variant={getTypeBadgeVariant(source.type)} className="shrink-0 text-[8px]">
                    {source.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground tabular-nums">
                    {formatValue(source.value, source.format)}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {formatTimeAgo(source.lastUpdated)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-2.5 rounded-lg bg-secondary/10 border border-secondary/20">
        <p className="text-[9px] text-muted-foreground leading-relaxed">
          All inputs are hashed and referenced in the on-chain NAVRegistry for auditability.
        </p>
      </div>
    </div>
  );
}
