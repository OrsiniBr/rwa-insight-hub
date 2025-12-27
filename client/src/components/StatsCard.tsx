import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  delay?: number;
}

export  const formatLargeNumber = (value: string | number) => {
  // Convert string to number if needed
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  
  if (isNaN(num)) return value; // Return original if not a number
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1_000_000_000_000) {
    return `$${(num / 1_000_000_000_000).toFixed(2)}T`; // Trillions
  }
  if (absNum >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`; // Billions
  }
  if (absNum >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`; // Millions
  }
  if (absNum >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`; // Thousands
  }
  
  return `$${num.toFixed(2)}`; // Less than 1000
};

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  className,
  delay = 0 
}: StatsCardProps) {
  return (
    <div 
      className={cn(
        "glass-card p-3 animate-fade-in",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] text-muted-foreground font-medium">{title}</p>
          <p className="text-lg font-semibold text-foreground tabular-nums"> {formatLargeNumber(value)}</p>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-[10px] font-medium tabular-nums",
              trend.positive ? "text-success" : "text-destructive"
            )}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-md bg-primary/10 p-1.5">
            <Icon className="h-3.5 w-3.5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
