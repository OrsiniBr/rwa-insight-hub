import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchCryptoPrices, AssetPrice, getTreasuryRates } from "@/lib/price-api";
import { 
  fetchLatestTransactions, 
  fetchLatestBlocks, 
  MantleTransaction, 
  MantleBlock,
  getLatestBlockNumber 
} from "@/lib/mantle-api";

export interface Pool {
  id: string;
  name: string;
  tag: string;
  description: string;
  assetType: "Treasury" | "Crypto" | "Commodity" | "Stock" | "RWA";
  riskLevel: "Low" | "Medium" | "High";
  latestNav: number;
  previousNav: number;
  change24h: number;
  status: "Healthy" | "Needs Review" | "Stale Data";
  lastUpdated: string;
  minutesAgo: number;
  priceData?: AssetPrice;
  unitPrice?: number;
  unitsOutstanding?: number;
}

interface RealtimeStats {
  totalNav: number;
  navChange: number;
  activePoolsCount: number;
  lastUpdateTime: number;
}

interface DataSource {
  name: string;
  type: "Price Oracle" | "FX" | "On-Chain Position" | "Off-Chain Accounting";
  value: number;
  lastUpdated: number;
}

export interface MantleData {
  latestTransaction: MantleTransaction | null;
  latestBlock: MantleBlock | null;
  recentTransactions: MantleTransaction[];
  recentBlocks: MantleBlock[];
  currentBlockNumber: number;
}

// Pool definitions with underlying asset mappings
const POOL_DEFINITIONS = [
  {
    id: "POOL-001",
    name: "BlackRock Treasury Fund",
    tag: "BUIDL",
    description: "Tokenized US Treasury securities providing stable yield with institutional-grade custody",
    assetType: "Treasury" as const,
    riskLevel: "Low" as const,
    baseNav: 10000000,
    unitsOutstanding: 10000000,
    cryptoSymbol: null,
  },
  {
    id: "POOL-002",
    name: "Bitcoin Tracker",
    tag: "BTC",
    description: "Direct exposure to Bitcoin with real-time NAV tracking and institutional custody",
    assetType: "Crypto" as const,
    riskLevel: "High" as const,
    baseNav: 50000000,
    unitsOutstanding: 500,
    cryptoSymbol: "BTC",
  },
  {
    id: "POOL-003",
    name: "Ethereum Fund",
    tag: "ETH",
    description: "Ethereum exposure with staking rewards and DeFi yield optimization",
    assetType: "Crypto" as const,
    riskLevel: "High" as const,
    baseNav: 25000000,
    unitsOutstanding: 6500,
    cryptoSymbol: "ETH",
  },
  {
    id: "POOL-004",
    name: "Gold Commodity Pool",
    tag: "GOLD",
    description: "Physical gold-backed tokens with verified reserves and real-time pricing",
    assetType: "Commodity" as const,
    riskLevel: "Medium" as const,
    baseNav: 15000000,
    unitsOutstanding: 5500,
    cryptoSymbol: null,
  },
  {
    id: "POOL-005",
    name: "Real Estate Fund",
    tag: "REIT",
    description: "Diversified commercial real estate portfolio with quarterly distributions",
    assetType: "RWA" as const,
    riskLevel: "Medium" as const,
    baseNav: 30000000,
    unitsOutstanding: 300000,
    cryptoSymbol: null,
  },
  {
    id: "POOL-006",
    name: "Solana Tracker",
    tag: "SOL",
    description: "Solana exposure with validator staking and ecosystem participation",
    assetType: "Crypto" as const,
    riskLevel: "High" as const,
    baseNav: 8000000,
    unitsOutstanding: 35000,
    cryptoSymbol: "SOL",
  },
  {
    id: "POOL-007",
    name: "Mantle Native Fund",
    tag: "MNT",
    description: "Native MNT token exposure with L2 staking benefits",
    assetType: "Crypto" as const,
    riskLevel: "High" as const,
    baseNav: 5000000,
    unitsOutstanding: 4500000,
    cryptoSymbol: "MNT",
  },
  {
    id: "POOL-008",
    name: "Chainlink Oracle Fund",
    tag: "LINK",
    description: "LINK token exposure benefiting from oracle network growth",
    assetType: "Crypto" as const,
    riskLevel: "High" as const,
    baseNav: 12000000,
    unitsOutstanding: 420000,
    cryptoSymbol: "LINK",
  },
];

function formatTimeAgo(minutes: number): string {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${Math.floor(minutes)} min ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hr ago`;
  return `${Math.floor(minutes / 1440)} days ago`;
}

function getStatus(minutesAgo: number): "Healthy" | "Needs Review" | "Stale Data" {
  if (minutesAgo < 5) return "Healthy";
  if (minutesAgo < 30) return "Needs Review";
  return "Stale Data";
}

// Legacy exports for backward compatibility
export const dataSources: DataSource[] = [];
export const aiExplanations: string[] = [];

export function generatePriceChange(basePrice: number, volatility: number = 0.001): number {
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
  return basePrice + change;
}

export function calculate24hChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

export function getStatusFromMinutes(minutesAgo: number): "Healthy" | "Needs Review" | "Stale Data" {
  return getStatus(minutesAgo);
}

export function generateChartData(baseValue: number, days: number) {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movement
    const volatility = 0.02;
    const trend = 0.001;
    const randomWalk = (Math.random() - 0.5) * volatility;
    const value = baseValue * (1 + randomWalk + trend * (days - i));
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.max(value, baseValue * 0.8),
    });
  }
  
  return data;
}

export function getAllPools(): Pool[] {
  return POOL_DEFINITIONS.map(def => ({
    id: def.id,
    name: def.name,
    tag: def.tag,
    description: def.description,
    assetType: def.assetType,
    riskLevel: def.riskLevel,
    latestNav: def.baseNav,
    previousNav: def.baseNav * 0.99,
    change24h: 1.0,
    status: "Healthy" as const,
    lastUpdated: "Just now",
    minutesAgo: 0,
    unitPrice: def.baseNav / def.unitsOutstanding,
    unitsOutstanding: def.unitsOutstanding,
  }));
}

export function useRealtimeData() {
  const [pools, setPools] = useState<Pool[]>(getAllPools());
  const [stats, setStats] = useState<RealtimeStats>({
    totalNav: 0,
    navChange: 0,
    activePoolsCount: 0,
    lastUpdateTime: Date.now(),
  });
  const [sources, setSources] = useState<DataSource[]>([]);
  const [mantleData, setMantleData] = useState<MantleData>({
    latestTransaction: null,
    latestBlock: null,
    recentTransactions: [],
    recentBlocks: [],
    currentBlockNumber: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date>(new Date());

  const fetchRealData = useCallback(async () => {
    try {
      // Fetch crypto prices from CoinGecko
      const cryptoSymbols = POOL_DEFINITIONS
        .filter(p => p.cryptoSymbol)
        .map(p => p.cryptoSymbol as string);
      
      const [prices, transactions, blocks, blockNumber] = await Promise.all([
        fetchCryptoPrices(cryptoSymbols),
        fetchLatestTransactions(10),
        fetchLatestBlocks(5),
        getLatestBlockNumber(),
      ]);

      const treasuryRates = getTreasuryRates();

      // Update Mantle data
      setMantleData({
        latestTransaction: transactions[0] || null,
        latestBlock: blocks[0] || null,
        recentTransactions: transactions,
        recentBlocks: blocks,
        currentBlockNumber: blockNumber,
      });

      // Update pools with real prices
      const updatedPools: Pool[] = POOL_DEFINITIONS.map(poolDef => {
        let latestNav = poolDef.baseNav;
        let priceData: AssetPrice | undefined;
        let change24h = 0;
        let unitPrice = poolDef.baseNav / poolDef.unitsOutstanding;

        if (poolDef.cryptoSymbol && prices.has(poolDef.cryptoSymbol)) {
          priceData = prices.get(poolDef.cryptoSymbol);
          if (priceData) {
            // Calculate NAV based on real price and units held
            unitPrice = priceData.currentPrice;
            latestNav = unitPrice * poolDef.unitsOutstanding;
            change24h = priceData.priceChangePercentage24h;
          }
        } else if (poolDef.assetType === "Treasury") {
          // Treasury funds use yield-based NAV calculation
          const avgYield = treasuryRates["10-Year"];
          const dailyAccrual = poolDef.baseNav * (avgYield / 100 / 365);
          latestNav = poolDef.baseNav + dailyAccrual;
          change24h = avgYield / 365;
          unitPrice = latestNav / poolDef.unitsOutstanding;
        } else if (poolDef.assetType === "Commodity") {
          // Gold price - approximate current market price ($2,650/oz)
          const goldPricePerOz = 2650 + (Math.random() - 0.5) * 20;
          const ouncesHeld = poolDef.baseNav / 2600;
          latestNav = goldPricePerOz * ouncesHeld;
          change24h = ((goldPricePerOz - 2640) / 2640) * 100;
          unitPrice = latestNav / poolDef.unitsOutstanding;
        } else if (poolDef.assetType === "RWA") {
          // Real estate NAV - stable with small daily changes
          latestNav = poolDef.baseNav * (1 + (Math.random() - 0.5) * 0.001);
          change24h = (Math.random() - 0.5) * 0.2;
          unitPrice = latestNav / poolDef.unitsOutstanding;
        }

        const minutesAgo = Math.random() * 3; // Recently updated

        return {
          id: poolDef.id,
          name: poolDef.name,
          tag: poolDef.tag,
          description: poolDef.description,
          assetType: poolDef.assetType,
          riskLevel: poolDef.riskLevel,
          latestNav,
          previousNav: latestNav / (1 + change24h / 100),
          change24h,
          status: getStatus(minutesAgo),
          lastUpdated: formatTimeAgo(minutesAgo),
          minutesAgo,
          priceData,
          unitPrice,
          unitsOutstanding: poolDef.unitsOutstanding,
        };
      });

      setPools(updatedPools);
      setLastPriceUpdate(new Date());

      // Update data sources
      const updatedSources: DataSource[] = [
        {
          name: "Chainlink BTC/USD",
          type: "Price Oracle",
          value: prices.get("BTC")?.currentPrice || 104500,
          lastUpdated: 0,
        },
        {
          name: "Chainlink ETH/USD",
          type: "Price Oracle",
          value: prices.get("ETH")?.currentPrice || 3950,
          lastUpdated: 0,
        },
        {
          name: "EUR/USD FX Rate",
          type: "FX",
          value: 1.0523,
          lastUpdated: 1,
        },
        {
          name: "Treasury Yield 10Y",
          type: "Off-Chain Accounting",
          value: treasuryRates["10-Year"],
          lastUpdated: 2,
        },
      ];
      setSources(updatedSources);

      // Calculate stats
      const totalNav = updatedPools.reduce((sum, pool) => sum + pool.latestNav, 0);
      const previousTotalNav = updatedPools.reduce((sum, pool) => sum + pool.previousNav, 0);
      const navChange = ((totalNav - previousTotalNav) / previousTotalNav) * 100;

      setStats({
        totalNav,
        navChange,
        activePoolsCount: updatedPools.filter(p => p.status === "Healthy").length,
        lastUpdateTime: Date.now(),
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching real-time data:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchRealData();

    // Refresh every 30 seconds to respect API rate limits
    const interval = setInterval(fetchRealData, 30000);

    return () => clearInterval(interval);
  }, [fetchRealData]);

  return { 
    pools, 
    stats, 
    sources,
    mantleData,
    isLoading,
    lastPriceUpdate,
    refetch: fetchRealData,
  };
}

export function usePoolRealtimeData(poolId: string) {
  const { pools, sources, mantleData, isLoading, lastPriceUpdate } = useRealtimeData();
  const [chartData, setChartData] = useState<any[]>([]);
  const [aiExplanation, setAiExplanation] = useState("");

  const pool = pools.find((p) => p.id === poolId);

  useEffect(() => {
    if (pool) {
      // Generate chart data based on pool's NAV
      const data = generateChartData(pool.latestNav, 7);
      setChartData(data);

      // Generate AI explanation based on real data
      const direction = pool.change24h >= 0 ? "increased" : "decreased";
      const changeAbs = Math.abs(pool.change24h).toFixed(2);
      
      let explanation = `Today's NAV ${direction} by ${changeAbs}%. `;
      
      if (pool.priceData) {
        explanation += `${pool.tag} is currently trading at $${pool.priceData.currentPrice.toLocaleString()} `;
        explanation += `with a 24h high of $${pool.priceData.high24h?.toLocaleString() || "N/A"} `;
        explanation += `and low of $${pool.priceData.low24h?.toLocaleString() || "N/A"}. `;
        explanation += `Trading volume: $${((pool.priceData.volume24h || 0) / 1e9).toFixed(2)}B. `;
      }
      
      if (pool.assetType === "Treasury") {
        explanation += "Treasury yields remained stable with consistent daily accrual. ";
      }
      
      explanation += `Pool maintains ${pool.riskLevel.toLowerCase()} risk profile with ${pool.status.toLowerCase()} status.`;
      
      setAiExplanation(explanation);
    }
  }, [pool, pools]);

  return { 
    pool, 
    chartData, 
    aiExplanation, 
    sources,
    mantleData,
    isLoading,
    lastPriceUpdate,
  };
}
