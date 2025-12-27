// Real-time data service with live price simulations

export interface Pool {
  id: string;
  name: string;
  tag: string;
  // latestNav: number;
  // previousNav: number;
  change24h: number;
  // lastUpdated: string;
  minutesAgo: number;
  status:string;
  assetType: string;
  riskLevel: string;
  symbol?: string;
  price?: number;
}

// Top 30 Cryptocurrencies - Current prices as of December 15, 2024


// // Combine all assets
// export const getAllPools = (): Pool[] => {
//   return [...rwaAssets, ...cryptoAssets, ...stockAssets];
// };

// Generate random price change
export const generatePriceChange = (basePrice: number, volatility: number = 0.002): number => {
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
  return basePrice + change;
};

// Calculate 24h change
export const calculate24hChange = (current: number, previous: number): number => {
  return ((current - previous) / previous) * 100;
};

// Get status based on minutes ago
export const getStatus = (minutesAgo: number): "Healthy" | "Needs Review" | "Stale Data" => {
  if (minutesAgo < 60) return "Healthy";
  if (minutesAgo < 180) return "Needs Review";
  return "Stale Data";
};

// Format time ago
export const formatTimeAgo = (minutes: number): string => {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 120) return "1 hr ago";
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hrs ago`;
  return `${Math.floor(minutes / 1440)} days ago`;
};

// Generate chart data
export const generateChartData = (baseValue: number, days: number) => {
  const data = [];
  let currentValue = baseValue;
  const now = Date.now();

  for (let i = days * 24; i >= 0; i--) {
    const timestamp = now - i * 60 * 60 * 1000;
    const change = (Math.random() - 0.48) * baseValue * 0.005;
    currentValue = Math.max(baseValue * 0.85, currentValue + change);
    data.push({
      timestamp,
      date: new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" }),
      nav: currentValue,
    });
  }
  return data;
};

// Data sources for real-time updates
export const dataSources = [
  { name: "Chainlink ETH/USD", type: "Price Oracle" as const, value: 3521.88, lastUpdated: 1 },
  { name: "Chainlink BTC/USD", type: "Price Oracle" as const, value: 67234.52, lastUpdated: 1 },
  { name: "Chainlink EUR/USD", type: "FX" as const, value: 1.0842, lastUpdated: 2 },
  { name: "Treasury Vault", type: "On-Chain Position" as const, value: 10254398, lastUpdated: 5 },
  { name: "NAV Admin Report", type: "Off-Chain Accounting" as const, value: 52950000, lastUpdated: 15 },
  { name: "Stock Oracle Feed", type: "Price Oracle" as const, value: 189.42, lastUpdated: 5 },
];

// AI Explanation templates
export const aiExplanations = [
  "NAV increased due to strong performance in crypto assets. Bitcoin gained {btcChange}% while Ethereum rose {ethChange}%. Treasury positions remained stable with minor yield adjustments.",
  "Market volatility led to mixed results. Crypto holdings showed {cryptoChange}% movement while traditional assets provided {rwaChange}% stability. FX had minimal impact.",
  "Today's NAV reflects ongoing market dynamics. Digital assets contributed {cryptoChange}% to overall performance. Bond yields compressed slightly, boosting fixed income valuations.",
  "Portfolio rebalancing completed. Exposure adjusted across {numAssets} assets. Net result shows {totalChange}% change with improved risk-adjusted returns.",
];
