import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pool } from "@/lib/realtime-data";
import { PoolComparison } from "./PoolComparison";

interface PoolsTableProps {
  pools: Pool[];
}

export function PoolsTable({ pools }: PoolsTableProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecent, setShowRecent] = useState(false);
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");

  const assetTypes = useMemo(() => {
    const types = new Set(pools.map((p) => p.assetType));
    return Array.from(types).sort();
  }, [pools]);

  const filteredPools = useMemo(() => {
    return pools.filter((pool) => {
      const matchesSearch =
        pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.tag.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRecent = !showRecent || pool.minutesAgo <= 1440;
      const matchesType =
        assetTypeFilter === "all" ||
        pool.assetType.toLowerCase() === assetTypeFilter.toLowerCase();
      return matchesSearch && matchesRecent && matchesType;
    });
  }, [pools, searchQuery, showRecent, assetTypeFilter]);

  const getStatusBadge = (status: Pool["status"]) => {
    switch (status) {
      case "Healthy":
        return <Badge variant="success" className="text-[10px]">{status}</Badge>;
      case "Needs Review":
        return <Badge variant="warning" className="text-[10px]">{status}</Badge>;
      case "Stale Data":
        return <Badge variant="destructive" className="text-[10px]">{status}</Badge>;
    }
  };

  const getStatusDot = (minutesAgo: number) => {
    if (minutesAgo < 60) return "status-dot status-healthy";
    if (minutesAgo < 1440) return "status-dot status-warning";
    return "status-dot status-stale";
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    if (value < 0.01) return `$${value.toFixed(8)}`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
      {/* Filters Header */}
      <div className="border-b border-border/50 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search pools..."
              className="pl-8 h-8 text-xs bg-muted/50 border-border/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <PoolComparison pools={pools} />
            <div className="flex items-center gap-1.5">
              <Switch
                id="recent-filter"
                checked={showRecent}
                onCheckedChange={setShowRecent}
                className="scale-75"
              />
              <Label htmlFor="recent-filter" className="text-[10px] text-muted-foreground whitespace-nowrap">
                Last 24h
              </Label>
            </div>
            <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
              <SelectTrigger className="w-[110px] h-8 text-xs bg-muted/50 border-border/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Types</SelectItem>
                {assetTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()} className="text-xs">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Pool
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                NAV
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                24h
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Updated
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filteredPools.map((pool, index) => (
              <tr
                key={pool.id}
                className="group cursor-pointer transition-colors hover:bg-muted/30"
                onClick={() => navigate(`/pool/${pool.id}`)}
              >
                <td className="px-4 py-2.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                      {pool.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {pool.tag} · {pool.assetType}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="text-xs font-semibold text-foreground tabular-nums">
                    {formatValue(pool.latestNav)}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
                      pool.change24h >= 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {pool.change24h >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(pool.change24h).toFixed(2)}%
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className={getStatusDot(pool.minutesAgo)} />
                    <span className="text-[10px] text-muted-foreground">
                      {pool.lastUpdated}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5">{getStatusBadge(pool.status)}</td>
                <td className="px-4 py-2.5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-[10px] text-primary hover:text-primary hover:bg-primary/10 h-6 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pool/${pool.id}`);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPools.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No pools found</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
