import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  RefreshCw,
  Link2,
  Activity,
  Clock,
  Shield,
  Zap,
  Database
} from "lucide-react";
import {
  ChainlinkPriceFeed,
  ChainlinkDataStream,
  ChainlinkAutomation,
  generateAllPriceFeeds,
  generateAllDataStreams,
  generateAllAutomationUpkeeps,
  getChainlinkFeedUrl,
  getChainlinkAutomationUrl
} from "@/lib/chainlink-utils";

interface ChainlinkDataFeedsProps {
  poolId: string;
  assetType: string;
}

export function ChainlinkDataFeeds({ poolId, assetType }: ChainlinkDataFeedsProps) {
  const [priceFeeds, setPriceFeeds] = useState<ChainlinkPriceFeed[]>([]);
  const [dataStreams, setDataStreams] = useState<ChainlinkDataStream[]>([]);
  const [automations, setAutomations] = useState<ChainlinkAutomation[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"feeds" | "streams" | "automation">("feeds");

  useEffect(() => {
    // Initial data generation
    setPriceFeeds(generateAllPriceFeeds());
    setDataStreams(generateAllDataStreams());
    setAutomations(generateAllAutomationUpkeeps());
    
    // Update price feeds every 2 seconds
    const interval = setInterval(() => {
      setPriceFeeds(generateAllPriceFeeds());
      setDataStreams(generateAllDataStreams());
      setLastUpdate(new Date());
    }, 2000);

    // Update automations every 10 seconds
    const automationInterval = setInterval(() => {
      setAutomations(generateAllAutomationUpkeeps());
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(automationInterval);
    };
  }, [poolId]);

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(4)}`;
    if (price >= 0.01) return `$${price.toFixed(6)}`;
    return `$${price.toFixed(8)}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  // Filter relevant feeds based on asset type
  const getRelevantFeeds = () => {
    if (assetType === "Crypto") return priceFeeds.filter(f => !f.pair.includes("EUR") && !f.pair.includes("GBP") && !f.pair.includes("XA"));
    if (assetType === "Commodity") return priceFeeds.filter(f => f.pair.includes("XA") || f.pair.includes("CRUDE"));
    return priceFeeds.slice(0, 8);
  };

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-500/20 p-1.5">
            <Link2 className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground">
              Chainlink Oracles
            </h3>
            <p className="text-[8px] text-muted-foreground">
              Decentralized price feeds & automation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw className="h-2.5 w-2.5 text-primary animate-spin" />
          <span className="text-[8px] text-muted-foreground">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {[
          { id: "feeds" as const, label: "Data Feeds", icon: Database },
          { id: "streams" as const, label: "Data Streams", icon: Zap },
          { id: "automation" as const, label: "Automation", icon: Activity },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            className="h-6 px-2 text-[8px] gap-1"
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="h-2.5 w-2.5" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Data Feeds Tab */}
      {activeTab === "feeds" && (
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {getRelevantFeeds().map((feed) => (
            <div
              key={feed.pair}
              className="p-2 rounded-lg bg-muted/30 border border-border/30 hover:border-blue-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-foreground">
                      {feed.pair}
                    </span>
                    <span className="text-[7px] text-muted-foreground font-mono">
                      {feed.address.slice(0, 10)}...
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-medium text-foreground tabular-nums">
                    {formatPrice(feed.price)}
                  </span>
                  <div className="flex items-center gap-1 justify-end">
                    <Badge
                      variant={feed.status === "active" ? "success" : "destructive"}
                      className="text-[6px] h-3"
                    >
                      {feed.status}
                    </Badge>
                    <span className="text-[7px] text-muted-foreground">
                      {formatTimeAgo(feed.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-border/20">
                <span className="text-[7px] text-muted-foreground">
                  Dev: ±{feed.deviation.toFixed(3)}%
                </span>
                <span className="text-[7px] text-muted-foreground">
                  Heartbeat: {feed.heartbeat}s
                </span>
                <a
                  href={getChainlinkFeedUrl(feed.pair)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-[7px] text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  View Feed <ExternalLink className="h-2 w-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Streams Tab */}
      {activeTab === "streams" && (
        <div className="space-y-1.5">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="h-3 w-3 text-blue-400" />
              <span className="text-[9px] font-medium text-foreground">Low-Latency Streams</span>
            </div>
            <p className="text-[8px] text-muted-foreground">
              Sub-second price updates for high-frequency applications
            </p>
          </div>
          {dataStreams.map((stream) => (
            <div
              key={stream.feedId}
              className="p-2 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-foreground">{stream.name}</span>
                <span className="text-[10px] font-medium text-foreground tabular-nums">
                  {formatPrice(stream.price)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[7px] text-success">Bid: {formatPrice(stream.bid)}</span>
                <span className="text-[7px] text-destructive">Ask: {formatPrice(stream.ask)}</span>
                <span className="text-[7px] text-muted-foreground ml-auto">
                  Seq: #{stream.sequenceNumber}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === "automation" && (
        <div className="space-y-1.5">
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 mb-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Activity className="h-3 w-3 text-green-400" />
              <span className="text-[9px] font-medium text-foreground">Chainlink Automation</span>
            </div>
            <p className="text-[8px] text-muted-foreground">
              Automated NAV updates and maintenance tasks
            </p>
          </div>
          {automations.map((upkeep) => (
            <div
              key={upkeep.upkeepId}
              className="p-2 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-foreground">{upkeep.name}</span>
                <Badge
                  variant={upkeep.status === "active" ? "success" : upkeep.status === "paused" ? "warning" : "destructive"}
                  className="text-[6px] h-3"
                >
                  {upkeep.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[7px] text-muted-foreground">
                <span>Balance: {upkeep.balance.toFixed(2)} LINK</span>
                <span>Performs: {upkeep.performCount.toLocaleString()}</span>
                <span>Last: {formatTimeAgo(upkeep.lastPerformed)}</span>
              </div>
              <a
                href={getChainlinkAutomationUrl(upkeep.upkeepId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[7px] text-blue-400 hover:underline flex items-center gap-0.5 mt-1"
              >
                Manage Upkeep <ExternalLink className="h-2 w-2" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Shield className="h-3 w-3 text-blue-400" />
          <span className="text-[8px] text-muted-foreground">
            Powered by Chainlink Decentralized Oracle Network
          </span>
        </div>
        <a
          href="https://docs.chain.link"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[8px] text-blue-400 hover:underline"
        >
          Docs
        </a>
      </div>
    </div>
  );
}
