import { useState, useMemo, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { PoolsTable } from "@/components/PoolsTable";
import { PoolFilters, FilterState } from "@/components/PoolFilters";
import { NavAlerts } from "@/components/NavAlerts";
import { PoolComparison } from "@/components/PoolComparison";
import { Layers, DollarSign, Clock, RefreshCw, Bell, GitCompare } from "lucide-react";
import { Pool } from "@/hooks/useRealtimeData";
import { Button } from "@/components/ui/button";
import { useMantleTokens } from "@/hooks/useMantleToken";


// Define types for the API response
interface MantleToken {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

interface Stats {
  activePoolsCount: number;
  totalNav: number;
  navChange: number;
  lastUpdateTime: number;
}

type AssetType = "RWA" | "Treasury" | "Crypto" | "Commodity" | "Stock";

const Index = () => {
  //hooks
  const isFetching = useRef(false);
const {stats, pools, loading, error} = useMantleTokens()
  //states
  // const [pools, setPools] = useState<Pool[]>([]);
  // const [stats, setStats] = useState<Stats>({
  //   activePoolsCount: 0,
  //   totalNav: 0,
  //   navChange: 0,
  //   lastUpdateTime: Date.now(),
  // });
  const [isLoading, setIsLoading] = useState(true);
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

  // Function to transform Mantle API data to Pool format
  const transformMantleData = (mantleData: MantleToken[]): Pool[] => {
    return mantleData.map((token) => {
      const currentPrice = token.price;
      const change = token.change24h;
      const previousPrice = currentPrice / (1 + change / 100);

      return {
        id: token.id,
        name: token.name,
        tag: token.symbol,
        assetType: "RWA" as "RWA",
        riskLevel: "Medium" as "Medium",
        status: "active",
        latestNav: currentPrice,
        previousNav: previousPrice,
        change24h: change,
        minutesAgo: 0,
        description: `${token.name} - Market Cap: $${(token.marketCap / 1000000).toFixed(2)}M`,
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  // Function to calculate stats from pools
  const calculateStats = (poolsData: Pool[]): Stats => {
    const activeCount = poolsData.filter(p => p.status === "active").length;
    const totalNav = poolsData.reduce((sum, p) => sum + p.latestNav, 0);
    const avgChange = poolsData.length > 0
      ? poolsData.reduce((sum, p) => sum + p.change24h, 0) / poolsData.length
      : 0;

    return {
      activePoolsCount: activeCount,
      totalNav,
      navChange: avgChange,
      lastUpdateTime: Date.now(),
    };
  };

  // Fetch Mantle realtime data
//  const fetchMantleRealtimeData = async () => {
//     if (isFetching.current) return;
    
//     try {
//       isFetching.current = true;
//       console.log('Fetching Mantle tokens...');
      
//       const response = await fetch("https://rwa-insight-hub.onrender.com/api/v1/mantle/tokens", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//         },
//       });
      
//       console.log('Response status:', response.status);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('API Error:', errorText);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('API Response:', data);
      
//       // Handle different response structures
//       let tokenArray: MantleToken[] = [];
      
//       if (Array.isArray(data)) {
//         tokenArray = data;
//       } else if (data.tokens && Array.isArray(data.tokens)) {
//         tokenArray = data.tokens;
//       } else if (data.data && Array.isArray(data.data)) {
//         tokenArray = data.data;
//       } else {
//         console.warn('Unexpected data structure:', data);
//         tokenArray = [];
//       }
      
//       console.log('Token array:', tokenArray);
      
//       if (tokenArray.length > 0) {
//         const transformedPools = transformMantleData(tokenArray);
//         console.log('Transformed pools:', transformedPools);
        
//         setPools(transformedPools);
//         setStats(calculateStats(transformedPools));
//       } else {
//         console.warn('No tokens found in response');
//       }
      
//     } catch (error) {
//       console.error('Error fetching realtime data:', error);
//     } finally {
//       setIsLoading(false);
//       isFetching.current = false;
//     }
//   };

// const fetchMantleRealtimeData = async () => {
//   if (isFetching.current) return;
  
//   try {
//     isFetching.current = true;
// const response = await fetch("https://rwa-insight-hub.onrender.com/api/v1/mantle/tokens", {
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
    
//     const data = await response.json();
//     let tokenArray: MantleToken[] = [];

//     // Extract the array correctly
//     if (Array.isArray(data)) tokenArray = data;
//     else if (data.data) tokenArray = data.data;
//     else if (data.tokens) tokenArray = data.tokens;

//     if (tokenArray.length > 0) {
//       // FIX: Clean the data of duplicates BEFORE setting state
//       // This ensures if the API returns duplicates, your UI stays clean
//       const uniqueMap = new Map();
//       tokenArray.forEach(token => uniqueMap.set(token.id || token.symbol, token));
//       const cleanTokens = Array.from(uniqueMap.values());

//       const transformedPools = transformMantleData(cleanTokens);
//       setPools(transformedPools);
//       setStats(calculateStats(transformedPools));
//     }
//   } catch (error) {
//     console.error('Error fetching realtime data:', error);
//   } finally {
//     setIsLoading(false);
//     isFetching.current = false;
//   }
// };

  // Initial fetch on mount
//   useEffect(() => {
//     fetchMantleRealtimeData();
//   }, []);

// useEffect(() => {
//   const interval = setInterval(() => {
//     fetchMantleRealtimeData();
//   }, 30000); // 30 seconds is much safer
//   return () => clearInterval(interval);
// }, []);

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
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const timeSinceUpdate = () => {
    const seconds = Math.floor((Date.now() - stats.lastUpdateTime) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  if (isLoading && pools.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-sm text-muted-foreground">Loading realtime data...</p>
              <p className="text-xs text-muted-foreground mt-2">Fetching Mantle tokens...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
              Real-time NAV transparency for tokenized RWA pools on Mantle Network
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
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              // onClick={fetchMantleRealtimeData}
              disabled={isFetching.current}
            >
              <RefreshCw className={`h-3 w-3 ${isFetching.current ? 'animate-spin' : ''}`} />
              Refresh
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
            value="5s"
            subtitle="Auto-refresh"
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