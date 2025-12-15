import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, ArrowDownRight, GitCompare } from "lucide-react";
import { Pool } from "@/lib/realtime-data";
import { cn } from "@/lib/utils";

interface PoolComparisonProps {
  pools: Pool[];
}

export function PoolComparison({ pools }: PoolComparisonProps) {
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const togglePool = (poolId: string) => {
    setSelectedPools((prev) =>
      prev.includes(poolId)
        ? prev.filter((id) => id !== poolId)
        : prev.length < 4
        ? [...prev, poolId]
        : prev
    );
  };

  const comparedPools = pools.filter((p) => selectedPools.includes(p.id));

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    if (value < 0.01) return `$${value.toFixed(8)}`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="glass" size="sm" className="gap-1.5 text-xs">
            <GitCompare className="h-3 w-3" />
            Compare
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm">Select Pools to Compare (Max 4)</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {pools.map((pool) => (
                <div
                  key={pool.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selectedPools.includes(pool.id)}
                    onCheckedChange={() => togglePool(pool.id)}
                    disabled={
                      !selectedPools.includes(pool.id) && selectedPools.length >= 4
                    }
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium">{pool.name}</p>
                    <p className="text-[10px] text-muted-foreground">{pool.tag}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {pool.assetType}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Button
            onClick={() => {
              setShowComparison(true);
              setIsOpen(false);
            }}
            disabled={selectedPools.length < 2}
            size="sm"
            className="text-xs"
          >
            Compare {selectedPools.length} Pools
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-sm">Pool Comparison</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {comparedPools.map((pool) => (
              <div key={pool.id} className="glass-card p-3 space-y-2">
                <div>
                  <p className="text-xs font-medium text-foreground">{pool.name}</p>
                  <p className="text-[10px] text-muted-foreground">{pool.tag}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">NAV</p>
                  <p className="text-sm font-semibold">{formatValue(pool.latestNav)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">24h Change</p>
                  <div
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
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
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Type</p>
                  <Badge variant="secondary" className="text-[10px]">
                    {pool.assetType}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Risk</p>
                  <p className="text-xs">{pool.riskLevel}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      pool.status === "Healthy"
                        ? "success"
                        : pool.status === "Needs Review"
                        ? "warning"
                        : "destructive"
                    }
                    className="text-[10px]"
                  >
                    {pool.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
