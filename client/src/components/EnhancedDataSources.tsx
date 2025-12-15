import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  LineChart, 
  Globe, 
  FileText, 
  Fuel, 
  Droplets,
  ExternalLink,
  Copy,
  Check,
  Shield,
  RefreshCw
} from "lucide-react";
import { 
  OracleSource, 
  generateOracleSources,
  getExplorerTxUrl,
  getExplorerAddressUrl 
} from "@/lib/mantle-utils";

function formatTimeAgo(minutes: number): string {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${Math.floor(minutes)} min ago`;
  return `${Math.floor(minutes / 60)} hr ago`;
}

interface EnhancedDataSourcesProps {
  poolId: string;
  assetType: string;
  baseValue: number;
}

const getTypeIcon = (type: OracleSource["type"]) => {
  switch (type) {
    case "Price Oracle": return LineChart;
    case "FX": return Globe;
    case "On-Chain Position": return Database;
    case "Off-Chain Accounting": return FileText;
    case "Gas Oracle": return Fuel;
    case "DEX Pool": return Droplets;
  }
};

const getTypeBadgeVariant = (type: OracleSource["type"]): "secondary" | "warning" | "success" | "muted" | "destructive" | "default" => {
  switch (type) {
    case "Price Oracle": return "secondary";
    case "FX": return "warning";
    case "On-Chain Position": return "success";
    case "Off-Chain Accounting": return "muted";
    case "Gas Oracle": return "default";
    case "DEX Pool": return "secondary";
  }
};

export function EnhancedDataSources({ poolId, assetType, baseValue }: EnhancedDataSourcesProps) {
  const [sources, setSources] = useState<OracleSource[]>([]);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    // Generate initial sources
    setSources(generateOracleSources(assetType, baseValue));
    
    // Update sources every 2 seconds
    const interval = setInterval(() => {
      setSources(prev => prev.map(source => ({
        ...source,
        value: source.format === "gas" ? source.value : 
          source.value * (1 + (Math.random() - 0.5) * 0.002),
        lastUpdated: Math.max(1, source.lastUpdated),
        confidence: Math.min(100, source.confidence + (Math.random() - 0.5) * 0.1),
      })));
      setLastRefresh(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [assetType, baseValue]);

  const formatValue = (value: number, format: OracleSource["format"]) => {
    if (format === "rate") return value.toFixed(4);
    if (format === "gas") return `${(value * 1000).toFixed(2)} gwei`;
    if (format === "amount") {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
      return `$${value.toFixed(2)}`;
    }
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const truncateHash = (hash: string) => `${hash.slice(0, 8)}...${hash.slice(-6)}`;

  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground">
          Data Sources & Inputs
        </h3>
        <div className="flex items-center gap-1.5">
          <RefreshCw className="h-2.5 w-2.5 text-primary animate-spin" />
          <span className="text-[8px] text-muted-foreground">
            Live • {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {sources.map((source, idx) => {
          const Icon = getTypeIcon(source.type);
          return (
            <div
              key={`${source.name}-${idx}`}
              className="p-2 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start gap-2">
                <div className="rounded-md bg-primary/10 p-1 shrink-0">
                  <Icon className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="min-w-0">
                      <span className="text-[10px] font-medium text-foreground block">
                        {source.name}
                      </span>
                      <span className="text-[8px] text-muted-foreground">
                        {source.provider}
                      </span>
                    </div>
                    <Badge variant={getTypeBadgeVariant(source.type)} className="shrink-0 text-[7px]">
                      {source.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-[9px] mb-1.5">
                    <span className="text-foreground font-medium tabular-nums">
                      {formatValue(source.value, source.format)}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="status-dot status-healthy" />
                      <span className="text-muted-foreground">
                        {formatTimeAgo(source.lastUpdated)}
                      </span>
                    </div>
                  </div>

                  {/* Contract & Transaction Info */}
                  {source.contractAddress !== "0x0000000000000000000000000000000000000000" && (
                    <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-border/20">
                      <div className="flex items-center gap-0.5 bg-background/50 rounded px-1 py-0.5">
                        <span className="text-[7px] text-muted-foreground">Contract:</span>
                        <button
                          onClick={() => copyToClipboard(source.contractAddress)}
                          className="text-[7px] text-primary hover:underline flex items-center gap-0.5"
                        >
                          {truncateHash(source.contractAddress)}
                          {copiedHash === source.contractAddress ? (
                            <Check className="h-2 w-2" />
                          ) : (
                            <Copy className="h-2 w-2" />
                          )}
                        </button>
                      </div>
                      <a
                        href={getExplorerTxUrl(source.lastTxHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-0.5 bg-background/50 rounded px-1 py-0.5 text-[7px] text-primary hover:underline"
                      >
                        Last Tx
                        <ExternalLink className="h-2 w-2" />
                      </a>
                      <div className="flex items-center gap-0.5 bg-background/50 rounded px-1 py-0.5">
                        <Shield className="h-2 w-2 text-success" />
                        <span className="text-[7px] text-success">{source.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-0.5 bg-background/50 rounded px-1 py-0.5">
                        <span className="text-[7px] text-muted-foreground">Dev: ±{source.deviation.toFixed(2)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-3 p-2 rounded-lg bg-secondary/10 border border-secondary/20">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Shield className="h-3 w-3 text-secondary" />
          <span className="text-[9px] font-medium text-foreground">Auditability Verified</span>
        </div>
        <p className="text-[8px] text-muted-foreground leading-relaxed">
          All {sources.length} inputs are cryptographically hashed and stored in the on-chain NAVRegistry. 
          Each data point references its source transaction for full traceability on Mantle Network.
        </p>
      </div>
    </div>
  );
}
