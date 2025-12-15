import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateChartData } from "@/lib/realtime-data";

interface NavChartProps {
  poolId: string;
  baseValue?: number;
}

const timeframes = [
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
];

export function NavChart({ poolId, baseValue = 10000000 }: NavChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(7);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const chartData = generateChartData(baseValue, selectedTimeframe);
    setData(chartData);

    // Update chart every 3 seconds
    const interval = setInterval(() => {
      setData((prev) => {
        const lastPoint = prev[prev.length - 1];
        const change = (Math.random() - 0.48) * baseValue * 0.002;
        const newNav = Math.max(baseValue * 0.85, lastPoint.nav + change);
        const newPoint = {
          timestamp: Date.now(),
          date: new Date().toLocaleDateString("en-US", { 
            month: "short", 
            day: "numeric",
            hour: "2-digit" 
          }),
          nav: newNav,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedTimeframe, baseValue]);

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatTooltip = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(4)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(4)}`;
  };

  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-foreground">NAV Over Time</h3>
        <div className="flex gap-0.5 p-0.5 bg-muted/50 rounded-md">
          {timeframes.map((tf) => (
            <Button
              key={tf.label}
              variant={selectedTimeframe === tf.days ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-6 px-2 text-[10px]",
                selectedTimeframe === tf.days && "shadow-sm"
              )}
              onClick={() => setSelectedTimeframe(tf.days)}
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(165, 100%, 44%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(165, 100%, 44%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(230, 30%, 18%)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="hsl(230, 20%, 55%)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(230, 20%, 55%)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 40%, 8%)",
                border: "1px solid hsl(230, 30%, 18%)",
                borderRadius: "6px",
                fontSize: "10px",
              }}
              labelStyle={{ color: "hsl(230, 60%, 98%)", fontSize: "10px" }}
              formatter={(value: number) => [formatTooltip(value), "NAV"]}
            />
            <Area
              type="monotone"
              dataKey="nav"
              stroke="hsl(165, 100%, 44%)"
              strokeWidth={1.5}
              fill="url(#navGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
