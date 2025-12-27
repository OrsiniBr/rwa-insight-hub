import { useState, useEffect } from 'react';
import { Pool } from './useRealtimeData';

interface MantleToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
}

export const useMantleTokens = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMantleTokens = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?' +
          'vs_currency=usd&' +
          'asset_platform_id=mantle&' +
          'order=market_cap_desc&' +
          'per_page=250&' +
          'page=1&' +
          'sparkline=false&' +
          'price_change_percentage=24h'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch Mantle tokens');
        }

        const mantleTokens: MantleToken[] = await response.json();
        
        // Transform CoinGecko data to your Pool structure
        const transformedPools: Pool[] = mantleTokens.map((token) => {
          const currentPrice = token.current_price;
          const change24h = token.price_change_percentage_24h || 0;
          
          // Calculate previous NAV based on 24h change
          const previousNav = change24h !== 0 
            ? currentPrice / (1 + change24h / 100)
            : currentPrice;

          return {
            id: token.id,
            name: token.name,
            tag: token.symbol.toUpperCase(),
            assetType: 'Crypto',
            riskLevel: token.market_cap_rank <= 100 ? 'Low' : token.market_cap_rank <= 500 ? 'Medium' : 'High',
            status: 'active',
            latestNav: token.market_cap, // Use market cap for total value
            previousNav: previousNav * (token.circulating_supply || 0), // Approx previous MC
            change24h: change24h,
            minutesAgo: 0,
            lastUpdated: new Date().toISOString(),
            description: `${token.name} (${token.symbol.toUpperCase()}) - Market Cap Rank: #${token.market_cap_rank}`,
            unitPrice: currentPrice,
            unitsOutstanding: token.circulating_supply,
            priceData: {
              id: token.id,
              name: token.name,
              symbol: token.symbol,
              marketCap: token.market_cap,
              currentPrice: currentPrice,
              priceChange24h: currentPrice - previousNav,
              priceChangePercentage24h: change24h,
              high24h: 0, // Not available in this endpoint response standard
              low24h: 0,  // Not available in this endpoint response standard
              volume24h: token.total_volume,
              lastUpdated: Date.now()
            }
          };
        });

        setPools(transformedPools);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching Mantle tokens:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMantleTokens();
    
    const interval = setInterval(fetchMantleTokens, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = {
    activePoolsCount: pools.filter(p => p.status === 'active').length,
    totalNav: pools.reduce((sum, p) => sum + p.latestNav, 0),
    navChange: pools.length > 0 
      ? pools.reduce((sum, p) => sum + p.change24h, 0) / pools.length 
      : 0,
    lastUpdateTime: Date.now(),
  };

  console.log("pools>>>", pools); 

  return { pools, stats, loading, error };  // ← Added semicolon here
};