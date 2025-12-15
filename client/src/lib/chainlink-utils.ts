// Chainlink Integration Utilities
// Based on Chainlink documentation: https://docs.chain.link/

// ============================================
// CHAINLINK DATA FEEDS CONFIGURATION
// ============================================

export const CHAINLINK_CONFIG = {
  // Mantle Network Chainlink Price Feed Addresses (Mainnet)
  mantleMainnet: {
    ETH_USD: "0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08",
    BTC_USD: "0x0000000000000000000000000000000000000000", // Placeholder - requires deployment
    USDC_USD: "0x0000000000000000000000000000000000000000",
    DAI_USD: "0x0000000000000000000000000000000000000000",
    LINK_USD: "0x0000000000000000000000000000000000000000",
    MNT_USD: "0x0000000000000000000000000000000000000000",
  },
  // Sepolia Testnet (for development)
  sepoliaTestnet: {
    ETH_USD: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    BTC_USD: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
    USDC_USD: "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
    DAI_USD: "0x14866185B1962B63C3Ea9E03Bc1da838bab34C19",
    LINK_USD: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
  },
  // Aggregator V3 Interface ABI
  aggregatorV3InterfaceABI: [
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "description",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "version",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
      name: "getRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "latestRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};

// ============================================
// CHAINLINK DATA FEED INTERFACES
// ============================================

export interface ChainlinkPriceFeed {
  pair: string;
  address: string;
  decimals: number;
  price: number;
  roundId: string;
  updatedAt: number;
  answeredInRound: string;
  deviation: number;
  heartbeat: number;
  status: "active" | "stale" | "error";
}

export interface ChainlinkDataStream {
  feedId: string;
  name: string;
  price: number;
  bid: number;
  ask: number;
  timestamp: number;
  sequenceNumber: number;
  validFromTimestamp: number;
  expiresAt: number;
  status: "active" | "expired";
}

export interface ChainlinkFunctionsRequest {
  requestId: string;
  subscriptionId: number;
  callbackGasLimit: number;
  source: string;
  args: string[];
  response: string | null;
  error: string | null;
  status: "pending" | "fulfilled" | "failed";
  timestamp: number;
  gasUsed: number;
}

export interface ChainlinkVRFRequest {
  requestId: string;
  numWords: number;
  randomWords: bigint[];
  fulfilled: boolean;
  requestBlockNumber: number;
  fulfilledBlockNumber: number | null;
}

export interface ChainlinkAutomation {
  upkeepId: string;
  name: string;
  target: string;
  checkData: string;
  balance: number;
  minBalance: number;
  lastPerformed: number;
  performCount: number;
  status: "active" | "paused" | "underfunded";
}

// ============================================
// CHAINLINK DATA FEED FUNCTIONS
// ============================================

// Generate simulated Chainlink price feed data
export const generateChainlinkPriceFeed = (pair: string, basePrice: number): ChainlinkPriceFeed => {
  const deviation = (Math.random() - 0.5) * 0.002;
  const price = basePrice * (1 + deviation);
  
  return {
    pair,
    address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    decimals: 8,
    price,
    roundId: `${BigInt(Math.floor(Math.random() * 1000000000000))}`,
    updatedAt: Date.now() - Math.floor(Math.random() * 60000),
    answeredInRound: `${BigInt(Math.floor(Math.random() * 1000000000000))}`,
    deviation: Math.abs(deviation) * 100,
    heartbeat: pair.includes("USD") ? 3600 : 86400, // 1 hour for USD pairs, 24 hours for others
    status: Math.random() > 0.05 ? "active" : "stale",
  };
};

// Generate multiple price feeds for all supported assets
export const generateAllPriceFeeds = (): ChainlinkPriceFeed[] => {
  const feeds: ChainlinkPriceFeed[] = [
    generateChainlinkPriceFeed("BTC/USD", 67234.52),
    generateChainlinkPriceFeed("ETH/USD", 3521.88),
    generateChainlinkPriceFeed("BNB/USD", 584.21),
    generateChainlinkPriceFeed("SOL/USD", 142.65),
    generateChainlinkPriceFeed("XRP/USD", 0.52),
    generateChainlinkPriceFeed("ADA/USD", 0.45),
    generateChainlinkPriceFeed("AVAX/USD", 35.82),
    generateChainlinkPriceFeed("DOGE/USD", 0.12),
    generateChainlinkPriceFeed("DOT/USD", 7.21),
    generateChainlinkPriceFeed("LINK/USD", 14.52),
    generateChainlinkPriceFeed("MATIC/USD", 0.58),
    generateChainlinkPriceFeed("MNT/USD", 0.82),
    generateChainlinkPriceFeed("EUR/USD", 1.0842),
    generateChainlinkPriceFeed("GBP/USD", 1.2654),
    generateChainlinkPriceFeed("JPY/USD", 0.0067),
    generateChainlinkPriceFeed("XAU/USD", 2345.50), // Gold
    generateChainlinkPriceFeed("XAG/USD", 27.85),   // Silver
    generateChainlinkPriceFeed("CRUDE/USD", 78.42), // Oil
  ];
  
  return feeds;
};

// ============================================
// CHAINLINK DATA STREAMS (Low-Latency)
// ============================================

export const generateDataStream = (feedId: string, name: string, basePrice: number): ChainlinkDataStream => {
  const now = Date.now();
  const spread = basePrice * 0.0001; // 0.01% spread
  
  return {
    feedId: `0x${feedId}`,
    name,
    price: basePrice * (1 + (Math.random() - 0.5) * 0.001),
    bid: basePrice - spread,
    ask: basePrice + spread,
    timestamp: now,
    sequenceNumber: Math.floor(Math.random() * 1000000),
    validFromTimestamp: now,
    expiresAt: now + 5000, // 5 seconds validity
    status: "active",
  };
};

export const generateAllDataStreams = (): ChainlinkDataStream[] => {
  return [
    generateDataStream("00036fe43f87884450b4c7e093cd5ed99cac6640d8c28000", "ETH/USD", 3521.88),
    generateDataStream("00037f0e01f41c6c23da9ce5d4fc7ee0b6c0e7a6a4e3c80", "BTC/USD", 67234.52),
    generateDataStream("00038a2e53f87884450b4c7e093cd5ed99cac6640d8c280", "SOL/USD", 142.65),
    generateDataStream("00039b3f64a98995561c5d8f194de6fe00dbd7751e9d390", "LINK/USD", 14.52),
    generateDataStream("0003ac4075ba9a06672d6e9f295ef7fe11cce8862fae4a0", "MNT/USD", 0.82),
  ];
};

// ============================================
// CHAINLINK FUNCTIONS (Serverless Compute)
// ============================================

export const generateFunctionsRequest = (source: string): ChainlinkFunctionsRequest => {
  const isCompleted = Math.random() > 0.3;
  const isFailed = isCompleted && Math.random() > 0.9;
  
  return {
    requestId: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    subscriptionId: Math.floor(Math.random() * 10000) + 1000,
    callbackGasLimit: 300000,
    source,
    args: ["arg1", "arg2"],
    response: isCompleted && !isFailed ? `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` : null,
    error: isFailed ? "Execution reverted" : null,
    status: isFailed ? "failed" : isCompleted ? "fulfilled" : "pending",
    timestamp: Date.now() - Math.floor(Math.random() * 300000),
    gasUsed: Math.floor(Math.random() * 150000) + 50000,
  };
};

// Sample Chainlink Functions source code for NAV calculation
export const NAV_CALCULATION_SOURCE = `
// Chainlink Functions: NAV Calculation
// This function fetches off-chain asset data and calculates NAV

const poolId = args[0];
const apiUrl = "https://api.navregistry.io/v1/pools/" + poolId + "/assets";

const response = await Functions.makeHttpRequest({
  url: apiUrl,
  method: "GET",
  headers: { "Content-Type": "application/json" }
});

if (response.error) {
  throw Error("API request failed");
}

const assets = response.data.assets;
let totalValue = 0;

for (const asset of assets) {
  totalValue += asset.quantity * asset.price;
}

// Apply fees
const managementFee = totalValue * 0.002; // 0.2% annual
const nav = totalValue - managementFee;

return Functions.encodeUint256(Math.floor(nav * 1e8));
`;

// ============================================
// CHAINLINK AUTOMATION (Keepers)
// ============================================

export const generateAutomationUpkeep = (name: string): ChainlinkAutomation => {
  const status = Math.random() > 0.1 ? "active" : Math.random() > 0.5 ? "paused" : "underfunded";
  
  return {
    upkeepId: `${Math.floor(Math.random() * 100000000)}`,
    name,
    target: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    checkData: "0x",
    balance: (Math.random() * 10 + 1),
    minBalance: 0.5,
    lastPerformed: Date.now() - Math.floor(Math.random() * 3600000),
    performCount: Math.floor(Math.random() * 10000),
    status,
  };
};

export const generateAllAutomationUpkeeps = (): ChainlinkAutomation[] => {
  return [
    generateAutomationUpkeep("NAV Update - Treasury Pools"),
    generateAutomationUpkeep("NAV Update - Credit Pools"),
    generateAutomationUpkeep("NAV Update - Real Estate"),
    generateAutomationUpkeep("Price Feed Aggregation"),
    generateAutomationUpkeep("Rebalance Trigger"),
    generateAutomationUpkeep("Fee Collection"),
  ];
};

// ============================================
// CHAINLINK CCIP (Cross-Chain)
// ============================================

export interface CCIPMessage {
  messageId: string;
  sourceChainSelector: string;
  destinationChainSelector: string;
  sender: string;
  receiver: string;
  data: string;
  tokenAmounts: { token: string; amount: string }[];
  feeToken: string;
  fees: string;
  status: "pending" | "inflight" | "success" | "failed";
  timestamp: number;
}

export const generateCCIPMessage = (): CCIPMessage => {
const chains = [
    { selector: "5009297550715157269", name: "Ethereum" },
    { selector: "4949039107694359620", name: "Mantle" },
    { selector: "3734403246176062136", name: "Arbitrum" },
    { selector: "4051577828743386545", name: "Optimism" },
  ];
  
  const source = chains[Math.floor(Math.random() * chains.length)];
  const dest = chains.filter(c => c.selector !== source.selector)[Math.floor(Math.random() * (chains.length - 1))];
  
  return {
    messageId: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    sourceChainSelector: source.selector,
    destinationChainSelector: dest.selector,
    sender: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    receiver: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    data: `0x${Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    tokenAmounts: [
      {
        token: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        amount: `${Math.floor(Math.random() * 1000000000000000000)}`,
      },
    ],
    feeToken: "0x0000000000000000000000000000000000000000", // Native token
    fees: `${Math.floor(Math.random() * 100000000000000000)}`,
    status: Math.random() > 0.1 ? "success" : Math.random() > 0.5 ? "inflight" : "pending",
    timestamp: Date.now() - Math.floor(Math.random() * 7200000),
  };
};

// ============================================
// PROOF OF RESERVE
// ============================================

export interface ProofOfReserve {
  feedAddress: string;
  assetName: string;
  totalReserves: number;
  outstandingSupply: number;
  reserveRatio: number;
  lastUpdate: number;
  attestationHash: string;
  auditor: string;
}

export const generateProofOfReserve = (assetName: string, reserves: number): ProofOfReserve => {
  const outstandingSupply = reserves * (0.8 + Math.random() * 0.15);
  
  return {
    feedAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    assetName,
    totalReserves: reserves,
    outstandingSupply,
    reserveRatio: (reserves / outstandingSupply) * 100,
    lastUpdate: Date.now() - Math.floor(Math.random() * 86400000),
    attestationHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    auditor: "Armanino LLP",
  };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format price from Chainlink 8 decimal format
export const formatChainlinkPrice = (price: number, decimals: number = 8): string => {
  return (price / Math.pow(10, decimals)).toFixed(2);
};

// Get price feed URL for Chainlink data feeds
export const getChainlinkFeedUrl = (pair: string): string => {
  return `https://data.chain.link/feeds/${pair.toLowerCase().replace("/", "-")}`;
};

// Get functions subscription URL
export const getChainlinkFunctionsUrl = (subscriptionId: number): string => {
  return `https://functions.chain.link/mantle/${subscriptionId}`;
};

// Get automation upkeep URL
export const getChainlinkAutomationUrl = (upkeepId: string): string => {
  return `https://automation.chain.link/mantle/${upkeepId}`;
};

// Get CCIP explorer URL
export const getCCIPExplorerUrl = (messageId: string): string => {
  return `https://ccip.chain.link/msg/${messageId}`;
};
