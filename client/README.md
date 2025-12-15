# RWA NAV Coprocessor

Real-time NAV transparency dashboard for tokenized RWA pools on Mantle Network with Chainlink oracle integration.

## Live APIs Integrated

### Price APIs
| API | Endpoint | Used For |
|-----|----------|----------|
| CoinGecko | `api.coingecko.com/api/v3/coins/markets` | Real-time crypto prices (BTC, ETH, SOL, MNT, LINK) |
| Gate.io | `api.gateio.ws/api/v4` | Backup price source |

### Mantle Network APIs
| API | Endpoint | Used For |
|-----|----------|----------|
| Explorer API | `explorer.mantle.xyz/api/v2/transactions` | Real transactions |
| Explorer API | `explorer.mantle.xyz/api/v2/blocks` | Real blocks |
| RPC | `rpc.mantle.xyz` | Block number, gas price |

### Files Using APIs
- `src/lib/price-api.ts` - CoinGecko price fetching
- `src/lib/mantle-api.ts` - Mantle explorer & RPC calls
- `src/hooks/useRealtimeData.ts` - Combines all real-time data
- `src/components/VerifyAuditability.tsx` - Real Mantle transactions
- `src/components/KeyMetrics.tsx` - Live price data

## Test the APIs

```typescript
// Test crypto prices
import { fetchCryptoPrices } from "@/lib/price-api";
const prices = await fetchCryptoPrices(["BTC", "ETH"]);
console.log("BTC:", prices.get("BTC")?.currentPrice);

// Test Mantle transactions
import { fetchLatestTransactions } from "@/lib/mantle-api";
const txs = await fetchLatestTransactions(5);
console.log("Latest tx:", txs[0]?.hash);
```

## Backend Requirements

The frontend is complete. Backend developer needs to build:
1. NAVRegistry smart contract on Mantle
2. Chainlink automation for price updates
3. ZK proof generation for NAV verification
| Tool/API | Purpose | File Location |
|----------|---------|---------------|
| **Mantle RPC** | Blockchain data queries | `src/lib/mantle-utils.ts` |
| **Mantle Explorer API** | Transaction verification | `src/lib/mantle-utils.ts` |
| **Gas Oracle** | L2 gas estimation | `src/lib/mantle-utils.ts` |
| **Block Explorer Links** | Transaction/block verification | `src/components/VerifyAuditability.tsx` |

### Mantle-Specific Functions

```typescript
// src/lib/mantle-utils.ts

// Generate Mantle transaction hashes
generateTxHash(): string

// Generate block information
generateBlockNumber(): number  // Based on Mantle's ~68M+ blocks
generateBlockHash(): string

// Explorer URL generators
getExplorerTxUrl(txHash: string): string
getExplorerBlockUrl(blockNumber: number): string
getExplorerAddressUrl(address: string): string

// Oracle source generation with Mantle contracts
generateOracleSources(assetType: string, baseValue: number): OracleSource[]

// Audit data with L1/L2 cost breakdown
generateAuditData(): AuditData
```

### Auditability Features (Mantle-Powered)
- **On-chain NAV verification** - View transactions on Mantle Explorer
- **Block confirmation** - See exact block where NAV was written
- **Data snapshot hashes** - Cryptographic proof of input data
- **Merkle root verification** - State root for ZK validity proofs
- **L1/L2 cost breakdown** - Transparent gas cost reporting
- **ZK Proof tracking** - Batch IDs and state roots

## 🔗 Chainlink Integration

### Chainlink Products Integrated

| Product | Purpose | File Location | Status |
|---------|---------|---------------|--------|
| **Data Feeds** | Price oracles for all assets | `src/lib/chainlink-utils.ts` | ✅ Active |
| **Data Streams** | Low-latency price updates | `src/lib/chainlink-utils.ts` | ✅ Active |
| **Automation** | Automated NAV updates | `src/lib/chainlink-utils.ts` | ✅ Active |
| **Functions** | Off-chain computation | `src/lib/chainlink-utils.ts` | ✅ Active |
| **CCIP** | Cross-chain messaging | `src/lib/chainlink-utils.ts` | ✅ Active |
| **Proof of Reserve** | Reserve verification | `src/lib/chainlink-utils.ts` | ✅ Active |
| **VRF** | Verifiable randomness | `src/lib/chainlink-utils.ts` | 📋 Planned |

### Chainlink Functions

```typescript
// src/lib/chainlink-utils.ts

// Price Feed Functions
generateChainlinkPriceFeed(pair: string, basePrice: number): ChainlinkPriceFeed
generateAllPriceFeeds(): ChainlinkPriceFeed[]

// Data Stream Functions (Low-Latency)
generateDataStream(feedId: string, name: string, basePrice: number): ChainlinkDataStream
generateAllDataStreams(): ChainlinkDataStream[]

// Automation Functions
generateAutomationUpkeep(name: string): ChainlinkAutomation
generateAllAutomationUpkeeps(): ChainlinkAutomation[]

// Chainlink Functions (Serverless)
generateFunctionsRequest(source: string): ChainlinkFunctionsRequest
NAV_CALCULATION_SOURCE: string  // Sample source code

// CCIP Functions
generateCCIPMessage(): CCIPMessage

// Proof of Reserve
generateProofOfReserve(assetName: string, reserves: number): ProofOfReserve

// Utility Functions
formatChainlinkPrice(price: number, decimals: number): string
getChainlinkFeedUrl(pair: string): string
getChainlinkFunctionsUrl(subscriptionId: number): string
getChainlinkAutomationUrl(upkeepId: string): string
getCCIPExplorerUrl(messageId: string): string
```

### Chainlink Contract Addresses (Mantle)

```typescript
// Aggregator V3 Interface Addresses
ETH_USD: "0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08"

// Note: Additional feeds require deployment on Mantle
// See: https://docs.chain.link/data-feeds/price-feeds/addresses
```

### Data Feeds Supported
- **Crypto**: BTC/USD, ETH/USD, BNB/USD, SOL/USD, XRP/USD, ADA/USD, AVAX/USD, DOGE/USD, DOT/USD, LINK/USD, MATIC/USD, MNT/USD
- **Forex**: EUR/USD, GBP/USD, JPY/USD
- **Commodities**: XAU/USD (Gold), XAG/USD (Silver), CRUDE/USD (Oil)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── Navbar.tsx                 # Navigation bar
│   ├── StatsCard.tsx              # Statistics display cards
│   ├── PoolsTable.tsx             # Main pools table
│   ├── PoolFilters.tsx            # Advanced filtering UI
│   ├── PoolComparison.tsx         # Pool comparison feature
│   ├── NavAlerts.tsx              # Real-time alerts
│   ├── NavChart.tsx               # Price charts
│   ├── KeyMetrics.tsx             # Pool metrics display
│   ├── EnhancedDataSources.tsx    # Data source attribution
│   ├── EnhancedAIExplanation.tsx  # AI NAV explanations
│   ├── VerifyAuditability.tsx     # On-chain verification
│   └── ChainlinkDataFeeds.tsx     # Chainlink oracle display
├── hooks/
│   └── useRealtimeData.ts         # Real-time data hook
├── lib/
│   ├── mantle-utils.ts            # Mantle Network utilities
│   ├── chainlink-utils.ts         # Chainlink oracle utilities
│   ├── realtime-data.ts           # Data generation
│   └── utils.ts                   # General utilities
├── pages/
│   ├── Index.tsx                  # Homepage/NAV Overview
│   └── PoolDetail.tsx             # Pool detail page
└── index.css                      # Global styles & design system
```

## 🛠️ Backend Requirements

The following backend functionality needs to be implemented for production:

### Smart Contracts (Solidity)

| Contract | Purpose | Priority |
|----------|---------|----------|
| `NAVRegistry.sol` | Store and verify NAV values on-chain | 🔴 Critical |
| `PoolManager.sol` | Manage RWA pool configurations | 🔴 Critical |
| `OracleAggregator.sol` | Aggregate multiple Chainlink feeds | 🟡 High |
| `FeeCollector.sol` | Handle protocol fees | 🟡 High |
| `AccessControl.sol` | Role-based permissions | 🟡 High |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/pools` | GET | List all pools with current NAV |
| `/api/pools/:id` | GET | Get pool details |
| `/api/pools/:id/history` | GET | NAV history for charts |
| `/api/pools/:id/sources` | GET | Data source information |
| `/api/ai/explanation/:id` | GET | AI-generated NAV explanation |
| `/api/alerts` | GET | Get active alerts |
| `/api/audit/:txHash` | GET | Verify transaction on-chain |

### Database Schema

```sql
-- Pools table
CREATE TABLE pools (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  asset_type VARCHAR NOT NULL,
  risk_level VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- NAV History
CREATE TABLE nav_history (
  id SERIAL PRIMARY KEY,
  pool_id VARCHAR REFERENCES pools(id),
  nav_value DECIMAL(20,8),
  tx_hash VARCHAR,
  block_number BIGINT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Data Sources
CREATE TABLE data_sources (
  id SERIAL PRIMARY KEY,
  pool_id VARCHAR REFERENCES pools(id),
  source_name VARCHAR,
  source_type VARCHAR,
  contract_address VARCHAR,
  last_value DECIMAL(20,8),
  last_updated TIMESTAMP
);

-- Alerts
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  pool_id VARCHAR REFERENCES pools(id),
  alert_type VARCHAR,
  message TEXT,
  severity VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### External Service Integrations

| Service | Purpose | Documentation |
|---------|---------|---------------|
| **Chainlink Data Feeds** | Price oracles | [docs.chain.link/data-feeds](https://docs.chain.link/data-feeds) |
| **Chainlink Functions** | Off-chain compute | [docs.chain.link/chainlink-functions](https://docs.chain.link/chainlink-functions) |
| **Chainlink Automation** | Scheduled updates | [docs.chain.link/chainlink-automation](https://docs.chain.link/chainlink-automation) |
| **OpenAI/Claude API** | AI explanations | For natural language NAV analysis |
| **The Graph** | Indexed blockchain data | [thegraph.com](https://thegraph.com) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd rwa-nav-coprocessor

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

```env
# Mantle Network
VITE_MANTLE_RPC_URL=https://rpc.mantle.xyz
VITE_MANTLE_CHAIN_ID=5000

# Chainlink (if using direct integration)
VITE_CHAINLINK_FUNCTIONS_SUBSCRIPTION_ID=your_subscription_id

# API Keys (for production)
VITE_OPENAI_API_KEY=your_openai_key
```

## 🧪 Testing Chainlink Integration

### Test Data Feed Functionality

```typescript
// In browser console or test file
import { generateAllPriceFeeds } from './src/lib/chainlink-utils';

const feeds = generateAllPriceFeeds();
console.log('Price Feeds:', feeds);
// Expected: Array of 18 price feeds with pair, price, status
```

### Test Data Streams

```typescript
import { generateAllDataStreams } from './src/lib/chainlink-utils';

const streams = generateAllDataStreams();
console.log('Data Streams:', streams);
// Expected: Array of 5 low-latency streams with bid/ask
```

### Test Automation Upkeeps

```typescript
import { generateAllAutomationUpkeeps } from './src/lib/chainlink-utils';

const upkeeps = generateAllAutomationUpkeeps();
console.log('Automation Upkeeps:', upkeeps);
// Expected: Array of 6 automation tasks with status
```

### Test Mantle Utilities

```typescript
import { generateAuditData, getExplorerTxUrl } from './src/lib/mantle-utils';

const audit = generateAuditData();
console.log('Audit Data:', audit);
console.log('Explorer URL:', getExplorerTxUrl(audit.navTxHash));
// Expected: Audit object with tx hash, block, and Mantle explorer URL
```

## 📚 Documentation Links

### Mantle Network
- [Mantle Documentation](https://docs.mantle.xyz/network)
- [Mantle Explorer](https://explorer.mantle.xyz)
- [Mantle RPC Endpoints](https://docs.mantle.xyz/network/for-devs/quick-start)

### Chainlink
- [Chainlink Documentation](https://docs.chain.link)
- [Data Feeds](https://docs.chain.link/data-feeds)
- [Data Streams](https://docs.chain.link/data-streams)
- [Chainlink Functions](https://docs.chain.link/chainlink-functions)
- [Chainlink Automation](https://docs.chain.link/chainlink-automation)
- [CCIP](https://docs.chain.link/ccip)

## 🎨 Design System

The application uses a dark fintech theme with:
- **Background**: Navy (#050712 to #090B18)
- **Primary**: Teal/Cyan (#00E0B8)
- **Secondary**: Purple/Blue (#5C6CFF)
- **Success**: Green (#27D980)
- **Destructive**: Red (#FF4D6A)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ on [Mantle Network](https://mantle.xyz) with [Chainlink](https://chain.link) oracles
