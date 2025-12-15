// Mantle Network utilities and blockchain data helpers
// Based on Mantle Network documentation: https://docs.mantle.xyz/network

export const MANTLE_CONFIG = {
  mainnet: {
    rpcUrl: "https://rpc.mantle.xyz",
    wsUrl: "wss://wss.mantle.xyz",
    chainId: 5000,
    explorerUrl: "https://explorer.mantle.xyz",
    explorerApiUrl: "https://explorer.mantle.xyz/api",
  },
  testnet: {
    rpcUrl: "https://rpc.testnet.mantle.xyz",
    wsUrl: "wss://ws.testnet.mantle.xyz",
    chainId: 5003,
    explorerUrl: "https://explorer.sepolia.mantle.xyz",
    explorerApiUrl: "https://explorer.sepolia.mantle.xyz/api",
  },
};

// Generate realistic Mantle transaction hash
export const generateTxHash = (): string => {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
};

// Generate realistic block hash
export const generateBlockHash = (): string => {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
};

// Generate block number (Mantle is currently around 60M+ blocks)
export const generateBlockNumber = (): number => {
  const baseBlock = 68000000;
  return baseBlock + Math.floor(Math.random() * 1000000);
};

// Generate data snapshot hash
export const generateSnapshotHash = (): string => {
  const chars = "0123456789abcdef";
  let hash = "";
  for (let i = 0; i < 32; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
};

// Generate Merkle root for auditability
export const generateMerkleRoot = (): string => {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
};

// Oracle data sources with Mantle-specific information
export interface OracleSource {
  name: string;
  type: "Price Oracle" | "FX" | "On-Chain Position" | "Off-Chain Accounting" | "Gas Oracle" | "DEX Pool";
  provider: string;
  contractAddress: string;
  value: number;
  lastUpdated: number;
  lastTxHash: string;
  blockNumber: number;
  format: "currency" | "rate" | "amount" | "gas";
  confidence: number;
  deviation: number;
}

// Generate oracle sources for a pool
export const generateOracleSources = (assetType: string, baseValue: number): OracleSource[] => {
  const sources: OracleSource[] = [];
  
  // Common oracles based on asset type
  if (assetType === "Crypto") {
    sources.push(
      {
        name: "Chainlink BTC/USD",
        type: "Price Oracle",
        provider: "Chainlink",
        contractAddress: "0x1f23a6cF13b7b6e7e6d8d4f9de5e0d3c2b1a0987",
        value: 67234.52 + (Math.random() - 0.5) * 500,
        lastUpdated: Math.floor(Math.random() * 5) + 1,
        lastTxHash: generateTxHash(),
        blockNumber: generateBlockNumber(),
        format: "currency",
        confidence: 99.8,
        deviation: 0.05,
      },
      {
        name: "Chainlink ETH/USD",
        type: "Price Oracle",
        provider: "Chainlink",
        contractAddress: "0x2a34b7df24c8c9f8e7d6c5b4a3210fedcba98765",
        value: 3521.88 + (Math.random() - 0.5) * 50,
        lastUpdated: Math.floor(Math.random() * 5) + 1,
        lastTxHash: generateTxHash(),
        blockNumber: generateBlockNumber(),
        format: "currency",
        confidence: 99.9,
        deviation: 0.03,
      },
      {
        name: "Pyth Network Feed",
        type: "Price Oracle",
        provider: "Pyth",
        contractAddress: "0x3b45c8ef35d9d0a9f8e7c6b5a4321fedcba87654",
        value: baseValue,
        lastUpdated: Math.floor(Math.random() * 3) + 1,
        lastTxHash: generateTxHash(),
        blockNumber: generateBlockNumber(),
        format: "currency",
        confidence: 99.5,
        deviation: 0.08,
      }
    );
  }
  
  // Add FX oracle
  sources.push({
    name: "Chainlink EUR/USD",
    type: "FX",
    provider: "Chainlink",
    contractAddress: "0x4c56d9f046ea0b0a1f9e8d7c6b5a4321fedc0123",
    value: 1.0842 + (Math.random() - 0.5) * 0.01,
    lastUpdated: Math.floor(Math.random() * 10) + 1,
    lastTxHash: generateTxHash(),
    blockNumber: generateBlockNumber(),
    format: "rate",
    confidence: 99.7,
    deviation: 0.02,
  });
  
  // On-chain position
  sources.push({
    name: "NAV Registry Vault",
    type: "On-Chain Position",
    provider: "Mantle NAV Coprocessor",
    contractAddress: "0x5d67e0a157fb1c2d0e9f8a7b6c5432fedc4567ab",
    value: baseValue,
    lastUpdated: Math.floor(Math.random() * 15) + 1,
    lastTxHash: generateTxHash(),
    blockNumber: generateBlockNumber(),
    format: "amount",
    confidence: 100,
    deviation: 0,
  });
  
  // Gas oracle
  sources.push({
    name: "Mantle Gas Oracle",
    type: "Gas Oracle",
    provider: "Mantle Network",
    contractAddress: "0x420000000000000000000000000000000000000F",
    value: 0.02,
    lastUpdated: 1,
    lastTxHash: generateTxHash(),
    blockNumber: generateBlockNumber(),
    format: "gas",
    confidence: 100,
    deviation: 0,
  });
  
  // Off-chain accounting
  sources.push({
    name: "NAV Admin Report",
    type: "Off-Chain Accounting",
    provider: "Certified Auditor",
    contractAddress: "0x0000000000000000000000000000000000000000",
    value: baseValue * 1.02,
    lastUpdated: Math.floor(Math.random() * 60) + 15,
    lastTxHash: generateTxHash(),
    blockNumber: generateBlockNumber(),
    format: "amount",
    confidence: 98.5,
    deviation: 0.1,
  });

  if (assetType === "Stock" || assetType === "Commodity") {
    sources.push({
      name: "DEX Liquidity Pool",
      type: "DEX Pool",
      provider: "Agni Finance",
      contractAddress: "0x6e78f1b268ac3d4e0f0a9b8c7d6543fedc7890cd",
      value: baseValue * 0.998,
      lastUpdated: Math.floor(Math.random() * 5) + 1,
      lastTxHash: generateTxHash(),
      blockNumber: generateBlockNumber(),
      format: "currency",
      confidence: 97.5,
      deviation: 0.15,
    });
  }
  
  return sources;
};

// On-chain auditability data
export interface AuditData {
  navTxHash: string;
  navBlockNumber: number;
  navBlockHash: string;
  snapshotId: string;
  merkleRoot: string;
  dataHash: string;
  timestamp: number;
  gasUsed: number;
  gasCost: number;
  l1DataCost: number;
  l2ExecutionCost: number;
  zkProofHash: string;
  batchId: number;
  stateRoot: string;
}

// Generate audit data for a pool
export const generateAuditData = (): AuditData => {
  const blockNumber = generateBlockNumber();
  return {
    navTxHash: generateTxHash(),
    navBlockNumber: blockNumber,
    navBlockHash: generateBlockHash(),
    snapshotId: `SNAP-${blockNumber}-${Math.floor(Math.random() * 1000)}`,
    merkleRoot: generateMerkleRoot(),
    dataHash: generateSnapshotHash(),
    timestamp: Date.now() - Math.floor(Math.random() * 3600000),
    gasUsed: Math.floor(Math.random() * 500000) + 100000,
    gasCost: Math.random() * 0.001,
    l1DataCost: Math.random() * 0.0001,
    l2ExecutionCost: Math.random() * 0.00005,
    zkProofHash: generateBlockHash(),
    batchId: Math.floor(Math.random() * 10000) + 50000,
    stateRoot: generateMerkleRoot(),
  };
};

// AI Explanation history entry
export interface AIExplanationEntry {
  timestamp: number;
  explanation: string;
  confidence: "High" | "Medium" | "Low";
  sourcesUsed: number;
  changeDirection: "up" | "down" | "stable";
  changePercent: number;
  keyFactors: string[];
}

// Generate comprehensive AI explanation
export const generateComprehensiveExplanation = (
  pool: any,
  sources: OracleSource[],
  auditData: AuditData
): string => {
  const direction = pool.change24h >= 0 ? "increased" : "decreased";
  const absChange = Math.abs(pool.change24h).toFixed(2);
  
  let explanation = `**NAV ${direction} by ${absChange}%** in the last 24 hours.\n\n`;
  
  // Asset-specific analysis
  if (pool.assetType === "Crypto") {
    explanation += `📊 **Market Analysis**: Cryptocurrency markets showed ${pool.change24h >= 0 ? "bullish" : "bearish"} momentum. `;
    explanation += `Bitcoin correlation factor: 0.${Math.floor(Math.random() * 30) + 70}. `;
    explanation += `Network activity on Mantle increased by ${(Math.random() * 10).toFixed(1)}% with gas prices remaining stable.\n\n`;
  } else if (pool.assetType === "Treasury") {
    explanation += `📊 **Yield Analysis**: Treasury yields ${pool.change24h >= 0 ? "compressed" : "expanded"} marginally. `;
    explanation += `Fed guidance remains accommodative. Short-term T-bills showing ${(Math.random() * 2 + 4).toFixed(2)}% APY.\n\n`;
  } else if (pool.assetType === "Stock") {
    explanation += `📊 **Equity Analysis**: Market sentiment ${pool.change24h >= 0 ? "positive" : "cautious"}. `;
    explanation += `Sector rotation favored ${pool.change24h >= 0 ? "growth" : "value"} stocks. P/E ratios adjusted by ${(Math.random() * 0.5).toFixed(2)}x.\n\n`;
  } else if (pool.assetType === "Commodity") {
    explanation += `📊 **Commodity Analysis**: Supply chain dynamics ${pool.change24h >= 0 ? "tightening" : "easing"}. `;
    explanation += `Inventory levels ${pool.change24h >= 0 ? "declining" : "stabilizing"}. Futures premium at ${(Math.random() * 2).toFixed(2)}%.\n\n`;
  } else if (pool.assetType === "Real Estate") {
    explanation += `📊 **Real Estate Analysis**: Cap rates ${pool.change24h >= 0 ? "compressed" : "expanded"} by ${(Math.random() * 0.2).toFixed(2)}%. `;
    explanation += `Occupancy rates stable at ${(85 + Math.random() * 10).toFixed(1)}%. Rental income growth projected at ${(Math.random() * 3 + 2).toFixed(1)}%.\n\n`;
  } else if (pool.assetType === "Credit") {
    explanation += `📊 **Credit Analysis**: Spreads ${pool.change24h >= 0 ? "tightened" : "widened"} by ${(Math.random() * 10).toFixed(0)}bps. `;
    explanation += `Investment grade bonds ${pool.change24h >= 0 ? "outperformed" : "underperformed"} high yield. Default rates remain low at ${(Math.random() * 0.5).toFixed(2)}%.\n\n`;
  } else {
    explanation += `📊 **Alternative Asset Analysis**: Valuations updated based on latest market comparables and appraisals. `;
    explanation += `Liquidity premium at ${(Math.random() * 5 + 5).toFixed(1)}%.\n\n`;
  }
  
  // Data sources summary
  explanation += `**🔗 Data Sources (${sources.length} feeds)**:\n`;
  const oracleCount = sources.filter(s => s.type === "Price Oracle").length;
  const fxCount = sources.filter(s => s.type === "FX").length;
  const onChainCount = sources.filter(s => s.type === "On-Chain Position" || s.type === "DEX Pool").length;
  const offChainCount = sources.filter(s => s.type === "Off-Chain Accounting").length;
  
  explanation += `• ${oracleCount} Price Oracles (Chainlink, Pyth)\n`;
  explanation += `• ${fxCount} FX Rate feeds\n`;
  explanation += `• ${onChainCount} On-Chain Positions\n`;
  explanation += `• ${offChainCount} Off-Chain Accounting reports\n\n`;
  
  // Fees and costs
  const totalFees = sources.reduce((sum, s) => sum + (s.type === "Gas Oracle" ? s.value : 0), 0);
  explanation += `**💰 Transaction Costs**:\n`;
  explanation += `• L2 Execution: ${(auditData.l2ExecutionCost * 1000).toFixed(4)} MNT\n`;
  explanation += `• L1 Data Cost: ${(auditData.l1DataCost * 1000).toFixed(4)} MNT\n`;
  explanation += `• Total Gas Used: ${auditData.gasUsed.toLocaleString()} units\n\n`;
  
  // On-chain verification
  explanation += `**✅ Verification**: NAV written to Mantle block #${auditData.navBlockNumber.toLocaleString()}. `;
  explanation += `ZK proof submitted in batch #${auditData.batchId}. All oracle inputs verified with average confidence ${(sources.reduce((sum, s) => sum + s.confidence, 0) / sources.length).toFixed(1)}%.`;
  
  return explanation;
};

// Generate previous explanation entry
export const generatePreviousExplanation = (pool: any, hoursAgo: number): AIExplanationEntry => {
  const wasPositive = Math.random() > 0.5;
  const changePercent = (Math.random() * 3).toFixed(2);
  
  return {
    timestamp: Date.now() - hoursAgo * 3600000,
    explanation: `NAV ${wasPositive ? "increased" : "decreased"} by ${changePercent}% driven by ${pool.assetType === "Crypto" ? "crypto market movements" : pool.assetType === "Stock" ? "equity market dynamics" : "portfolio rebalancing"}. All data sources verified.`,
    confidence: Math.random() > 0.3 ? "High" : "Medium",
    sourcesUsed: Math.floor(Math.random() * 3) + 4,
    changeDirection: wasPositive ? "up" : "down",
    changePercent: parseFloat(changePercent),
    keyFactors: [
      pool.assetType === "Crypto" ? "BTC correlation" : "Market sentiment",
      "Oracle feed updates",
      "FX adjustments",
      pool.assetType === "Treasury" ? "Yield movements" : "Price discovery",
    ],
  };
};

// Format explorer URL for transaction
export const getExplorerTxUrl = (txHash: string, network: "mainnet" | "testnet" = "mainnet"): string => {
  return `${MANTLE_CONFIG[network].explorerUrl}/tx/${txHash}`;
};

// Format explorer URL for block
export const getExplorerBlockUrl = (blockNumber: number, network: "mainnet" | "testnet" = "mainnet"): string => {
  return `${MANTLE_CONFIG[network].explorerUrl}/block/${blockNumber}`;
};

// Format explorer URL for address
export const getExplorerAddressUrl = (address: string, network: "mainnet" | "testnet" = "mainnet"): string => {
  return `${MANTLE_CONFIG[network].explorerUrl}/address/${address}`;
};
