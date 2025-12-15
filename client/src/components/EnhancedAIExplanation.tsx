import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Clock, 
  Shield, 
  History, 
  ChevronDown, 
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Database
} from "lucide-react";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { 
  generateOracleSources, 
  generateAuditData, 
  generateComprehensiveExplanation,
  generatePreviousExplanation,
  AIExplanationEntry,
  OracleSource,
  AuditData
} from "@/lib/mantle-utils";

interface EnhancedAIExplanationProps {
  poolId: string;
}

export function EnhancedAIExplanation({ poolId }: EnhancedAIExplanationProps) {
  const { pools } = useRealtimeData();
  const [explanation, setExplanation] = useState("");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [sources, setSources] = useState<OracleSource[]>([]);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [previousExplanations, setPreviousExplanations] = useState<AIExplanationEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const pool = pools.find((p) => p.id === poolId);
  const btcPool = pools.find((p) => p.tag === "BTC");
  const ethPool = pools.find((p) => p.tag === "ETH");

  useEffect(() => {
    if (!pool) return;

    const generateExplanation = () => {
      // Generate oracle sources
      const newSources = generateOracleSources(pool.assetType, pool.latestNav);
      setSources(newSources);
      
      // Generate audit data
      const newAuditData = generateAuditData();
      setAuditData(newAuditData);
      
      // Generate comprehensive explanation
      const newExplanation = generateComprehensiveExplanation(pool, newSources, newAuditData);
      setExplanation(newExplanation);
      setLastUpdate(new Date());
    };

    // Generate previous explanations (history)
    const history: AIExplanationEntry[] = [];
    for (let i = 1; i <= 5; i++) {
      history.push(generatePreviousExplanation(pool, i * 4 + Math.floor(Math.random() * 2)));
    }
    setPreviousExplanations(history);

    generateExplanation();
    const interval = setInterval(generateExplanation, 5000);

    return () => clearInterval(interval);
  }, [pool, btcPool, ethPool, pools]);

  if (!pool) return null;

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "250ms" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground">
          AI NAV Explanation
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 text-[8px] text-muted-foreground hover:text-foreground"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History className="h-2.5 w-2.5 mr-0.5" />
          History
          {showHistory ? <ChevronUp className="h-2 w-2 ml-0.5" /> : <ChevronDown className="h-2 w-2 ml-0.5" />}
        </Button>
      </div>

      {/* Agent Header */}
      <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-secondary/10 border border-secondary/20">
        <div className="rounded-full bg-secondary/20 p-1.5">
          <Sparkles className="h-3 w-3 text-secondary" />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-medium text-foreground">
            NAV Coprocessor Agent
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5 text-muted-foreground" />
              <span className="text-[8px] text-muted-foreground">
                {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Database className="h-2.5 w-2.5 text-primary" />
              <span className="text-[8px] text-primary">
                {sources.length} sources
              </span>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-medium ${
          pool.change24h >= 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
        }`}>
          {pool.change24h >= 0 ? (
            <ArrowUpRight className="h-2.5 w-2.5" />
          ) : (
            <ArrowDownRight className="h-2.5 w-2.5" />
          )}
          {pool.change24h >= 0 ? "+" : ""}{pool.change24h.toFixed(2)}%
        </div>
      </div>

      {/* Current Explanation */}
      <div className="prose prose-sm prose-invert max-w-none mb-3">
        <div className="text-[9px] text-muted-foreground leading-relaxed whitespace-pre-line">
          {explanation.split('\n').map((line, i) => {
            if (line.startsWith('**') && line.includes('**')) {
              const text = line.replace(/\*\*/g, '');
              return <p key={i} className="font-semibold text-foreground text-[10px] mt-2 mb-1">{text}</p>;
            }
            if (line.startsWith('•')) {
              return <p key={i} className="ml-2 text-[8px]">{line}</p>;
            }
            return <p key={i} className="text-[9px]">{line}</p>;
          })}
        </div>
      </div>

      {/* Confidence & Source Badges */}
      <div className="flex flex-wrap items-center gap-1 mb-3 pt-2 border-t border-border/30">
        <Badge variant="success" className="gap-0.5 text-[7px]">
          <Shield className="h-2 w-2" />
          High Confidence
        </Badge>
        <Badge variant="muted" className="text-[7px]">{sources.length} Sources</Badge>
        <Badge variant="secondary" className="text-[7px]">
          <TrendingUp className="h-2 w-2 mr-0.5" />
          Real-time
        </Badge>
        {auditData && (
          <Badge variant="default" className="text-[7px]">
            Block #{auditData.navBlockNumber.toLocaleString()}
          </Badge>
        )}
      </div>

      {/* Previous Explanations (History) */}
      {showHistory && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <h4 className="text-[9px] font-medium text-foreground mb-2 flex items-center gap-1">
            <History className="h-3 w-3 text-muted-foreground" />
            Previous Explanations
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {previousExplanations.map((entry, idx) => (
              <div 
                key={idx}
                className="p-2 rounded-lg bg-muted/20 border border-border/20"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-muted-foreground">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className={`flex items-center gap-0.5 text-[7px] font-medium ${
                      entry.changeDirection === "up" ? "text-success" : entry.changeDirection === "down" ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {entry.changeDirection === "up" ? (
                        <ArrowUpRight className="h-2 w-2" />
                      ) : entry.changeDirection === "down" ? (
                        <ArrowDownRight className="h-2 w-2" />
                      ) : null}
                      {entry.changeDirection === "up" ? "+" : entry.changeDirection === "down" ? "-" : ""}
                      {entry.changePercent}%
                    </div>
                    <Badge 
                      variant={entry.confidence === "High" ? "success" : entry.confidence === "Medium" ? "warning" : "destructive"}
                      className="text-[6px]"
                    >
                      {entry.confidence}
                    </Badge>
                  </div>
                </div>
                <p className="text-[8px] text-muted-foreground leading-relaxed">
                  {entry.explanation}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {entry.keyFactors.slice(0, 3).map((factor, i) => (
                    <span key={i} className="text-[6px] bg-background/50 px-1 py-0.5 rounded text-muted-foreground">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
