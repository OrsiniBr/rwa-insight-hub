import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import { Pool } from "@/lib/realtime-data";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  poolName: string;
  poolTag: string;
  change: number;
  timestamp: Date;
  type: "increase" | "decrease";
}

interface NavAlertsProps {
  pools: Pool[];
}

export function NavAlerts({ pools }: NavAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [previousChanges, setPreviousChanges] = useState<Map<string, number>>(
    new Map()
  );

  useEffect(() => {
    pools.forEach((pool) => {
      const prevChange = previousChanges.get(pool.id);
      if (prevChange !== undefined) {
        const diff = Math.abs(pool.change24h - prevChange);
        if (diff > 0.3) {
          const newAlert: Alert = {
            id: `${pool.id}-${Date.now()}`,
            poolName: pool.name,
            poolTag: pool.tag,
            change: pool.change24h,
            timestamp: new Date(),
            type: pool.change24h > prevChange ? "increase" : "decrease",
          };
          setAlerts((prev) => [newAlert, ...prev.slice(0, 19)]);
        }
      }
    });

    setPreviousChanges(new Map(pools.map((p) => [p.id, p.change24h])));
  }, [pools]);

  const clearAlerts = () => setAlerts([]);

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="nav" size="sm" className="relative gap-1.5">
          <Bell className="h-3.5 w-3.5" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium flex items-center justify-center text-destructive-foreground">
              {alerts.length > 9 ? "9+" : alerts.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="flex items-center justify-between p-2 border-b border-border/50">
          <span className="text-xs font-medium">NAV Alerts</span>
          {alerts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAlerts}
              className="h-6 text-[10px] text-muted-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
        <ScrollArea className="h-[250px]">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">No alerts yet</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Alerts appear when prices change significantly
              </p>
            </div>
          ) : (
            <div className="p-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 group"
                >
                  <div
                    className={cn(
                      "rounded-full p-1 mt-0.5",
                      alert.type === "increase"
                        ? "bg-success/20"
                        : "bg-destructive/20"
                    )}
                  >
                    {alert.type === "increase" ? (
                      <ArrowUpRight className="h-2.5 w-2.5 text-success" />
                    ) : (
                      <ArrowDownRight className="h-2.5 w-2.5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{alert.poolName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="muted" className="text-[10px]">
                        {alert.poolTag}
                      </Badge>
                      <span
                        className={cn(
                          "text-[10px] font-medium",
                          alert.change >= 0 ? "text-success" : "text-destructive"
                        )}
                      >
                        {alert.change >= 0 ? "+" : ""}
                        {alert.change.toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => removeAlert(alert.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
