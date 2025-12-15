import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { PoolsTable } from "@/components/PoolsTable";
import { PoolFilters, FilterState } from "@/components/PoolFilters";
import { NavAlerts } from "@/components/NavAlerts";
import { PoolComparison } from "@/components/PoolComparison";
import { Layers, DollarSign, Clock, RefreshCw, Bell, GitCompare } from "lucide-react";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { pools, stats } = useRealtimeData();
  const [showAlerts, setShowAlerts] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    assetType: "all",
    riskLevel: "all",
    status: "all",
    showRecent: false,
    sortBy: "updated",
    sortOrder: "desc",
    minNav: "",
    maxNav: "",
  });

  // Get unique asset types and risk levels
  const assetTypes = useMemo(() => 
    [...new Set(pools.map(p => p.assetType))], 
    [pools]
  );
  
  const riskLevels = useMemo(() => 
    [...new Set(pools.map(p => p.riskLevel))], 
    [pools]
  );

  // Filter and sort pools
  const filteredPools = useMemo(() => {
    let result = [...pools];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.tag.toLowerCase().includes(query)
      );
    }

    // Asset type filter
    if (filters.assetType !== "all") {
      result = result.filter(p => p.assetType.toLowerCase() === filters.assetType);
    }

    // Risk level filter
    if (filters.riskLevel !== "all") {
      result = result.filter(p => p.riskLevel.toLowerCase() === filters.riskLevel);
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter(p => p.status.toLowerCase() === filters.status);
    }

    // Recent only filter (last 24h = 1440 minutes)
    if (filters.showRecent) {
      result = result.filter(p => p.minutesAgo < 1440);
    }

    // NAV range filter
    if (filters.minNav) {
      result = result.filter(p => p.latestNav >= parseFloat(filters.minNav));
    }
    if (filters.maxNav) {
      result = result.filter(p => p.latestNav <= parseFloat(filters.maxNav));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "nav":
          comparison = a.latestNav - b.latestNav;
          break;
        case "change":
          comparison = a.change24h - b.change24h;
          break;
        case "updated":
          comparison = a.minutesAgo - b.minutesAgo;
          break;
      }
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [pools, filters]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.assetType !== "all") count++;
    if (filters.riskLevel !== "all") count++;
    if (filters.status !== "all") count++;
    if (filters.showRecent) count++;
    if (filters.minNav || filters.maxNav) count++;
    return count;
  }, [filters]);

  const formatNav = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const timeSinceUpdate = () => {
    const seconds = Math.floor((Date.now() - stats.lastUpdateTime) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-4">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-4 animate-fade-in">
          <div>
            <h1 className="text-xl font-bold text-foreground mb-1">
              NAV Overview
            </h1>
            <p className="text-xs text-muted-foreground">
              Real-time NAV transparency for tokenized RWA pools
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showAlerts ? "default" : "outline"}
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <Bell className="h-3 w-3" />
              Alerts
            </Button>
            <Button
              variant={showComparison ? "default" : "outline"}
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={() => setShowComparison(!showComparison)}
            >
              <GitCompare className="h-3 w-3" />
              Compare
            </Button>
          </div>
        </div>

        {/* Alerts Panel */}
        {showAlerts && (
          <div className="mb-4">
            <NavAlerts pools={pools} />
          </div>
        )}

        {/* Comparison Panel */}
        {showComparison && (
          <div className="mb-4">
            <PoolComparison pools={pools} />
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatsCard
            title="Active RWA Pools"
            value={stats.activePoolsCount.toString()}
            subtitle="Currently healthy"
            icon={Layers}
            delay={0}
          />
          <StatsCard
            title="Total On-Chain NAV"
            value={formatNav(stats.totalNav)}
            subtitle="Combined value"
            icon={DollarSign}
            trend={{ 
              value: `${stats.navChange >= 0 ? "+" : ""}${stats.navChange.toFixed(2)}% (24h)`, 
              positive: stats.navChange >= 0 
            }}
            delay={50}
          />
          <StatsCard
            title="Last Update"
            value={timeSinceUpdate()}
            subtitle="Most recent"
            icon={Clock}
            delay={100}
          />
          <StatsCard
            title="Refresh Rate"
            value="2s"
            subtitle="Real-time updates"
            icon={RefreshCw}
            delay={150}
          />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <PoolFilters
            filters={filters}
            onFiltersChange={setFilters}
            assetTypes={assetTypes}
            riskLevels={riskLevels}
            activeFiltersCount={activeFiltersCount}
          />
        </div>

        {/* Results count */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            Showing {filteredPools.length} of {pools.length} pools
          </span>
          {filteredPools.length > 0 && filters.sortBy === "updated" && (
            <span className="text-[10px] text-primary">
              Sorted by latest updates
            </span>
          )}
        </div>

        {/* Pools Table */}
        <PoolsTable pools={filteredPools} />
      </main>
    </div>
  );
};

export default Index;
