# RWA NAV Coprocessor

Real-time NAV (Net Asset Value) transparency dashboard for tokenized Real World Asset (RWA) pools on Mantle Network. This professional fintech application provides live price tracking, on-chain verification, and AI-powered analysis for 70+ active assets.

![Mantle Network](https://img.shields.io/badge/Mantle-Network-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

NAVRegistry  -  0xC927F5C205328c5d2B48aA7210F6Af7DfDd70B97
https://mantlescan.xyz/address/0xC927F5C205328c5d2B48aA7210F6Af7DfDd70B97

https://rwa-insight-hub.vercel.app/

PoolRegistry  -  0x8BaCC14Db47cf7a68bFE10642b4c4d25eC576ccd
https://mantlescan.xyz/address/0x8BaCC14Db47cf7a68bFE10642b4c4d25eC576ccd
Mantle NAV Coprocessor

## 🚀 Features

- **70 Active Mantle Assets**: Real-time tracking of native tokens, wrapped assets, stablecoins, DeFi tokens, and more
- **Live Price Data**: Integration with CoinGecko, Gate.io, and on-chain oracles
- **DeFi TVL Metrics**: Real-time TVL and APY data for Mantle DeFi protocols (Agni, Lendle, Merchant Moe)
- **On-Chain Verification**: All NAV data verifiable on Mantle Network Explorer
- **AI NAV Explanations**: Detailed analysis and predictions for each pool
- **Admin Reports**: Comprehensive audit reports with on-chain verification

## 📊 API Endpoints

### Real-Time NAV API

Backend developers should implement the following endpoints:

#### Get All Pools NAV
```
GET /api/v1/nav/pools
```
Returns NAV data for all 70 active pools.

**Response:**
```json
{
  "success": true,
  "timestamp": 1702918800000,
  "totalNAV": 428000000,
  "poolCount": 70,
  "pools": [
    {
      "poolId": "POOL-001",
      "symbol": "MNT",
      "name": "Mantle",
      "nav": 25000000,
      "unitPrice": 1.28,
      "unitsOutstanding": 19531250,
      "change24h": 2.45,
      "contractAddress": "0x...",
      "lastUpdated": "2024-12-18T10:00:00Z"
    }
  ]
}
```

#### Get Single Pool NAV
```
GET /api/v1/nav/pools/:poolId
```
Returns detailed NAV data for a specific pool.

**Response:**
```json
{
  "success": true,
  "pool": {
    "poolId": "POOL-001",
    "symbol": "MNT",
    "name": "Mantle",
    "nav": 25000000,
    "unitPrice": 1.28,
    "unitsOutstanding": 19531250,
    "change24h": 2.45,
    "high24h": 1.32,
    "low24h": 1.25,
    "volume24h": 15000000,
    "marketCap": 4200000000,
    "contractAddress": "0x...",
    "category": "Native",
    "riskLevel": "Medium",
    "status": "Healthy",
    "lastUpdated": "2024-12-18T10:00:00Z",
    "transactions": {
      "latestTxHash": "0x...",
      "blockNumber": 68234567,
      "explorerUrl": "https://explorer.mantle.xyz/tx/0x..."
    }
  }
}
```

#### Get Real-Time Asset Prices
```
GET /api/v1/prices
```
Returns current prices for all tracked assets.

**Query Parameters:**
- `symbols` (optional): Comma-separated list of symbols (e.g., `MNT,WETH,USDC`)

**Response:**
```json
{
  "success": true,
  "timestamp": 1702918800000,
  "prices": {
    "MNT": {
      "usd": 1.28,
      "change24h": 2.45,
      "high24h": 1.32,
      "low24h": 1.25,
      "volume24h": 15000000,
      "marketCap": 4200000000,
      "source": "coingecko"
    },
    "WETH": {
      "usd": 3905.50,
      "change24h": 1.2,
      "high24h": 3950,
      "low24h": 3850,
      "volume24h": 250000000,
      "marketCap": 470000000000,
      "source": "coingecko"
    }
  }
}
```

#### Get DeFi TVL Metrics
```
GET /api/v1/defi/tvl
```
Returns TVL and APY data for Mantle DeFi protocols.

**Response:**
```json
{
  "success": true,
  "timestamp": 1702918800000,
  "totalTVL": 428000000,
  "protocols": [
    {
      "name": "Lendle",
      "symbol": "LEND",
      "tvl": 156800000,
      "tvlChange24h": 1.8,
      "apy": 8.2,
      "apyRange": { "min": 3.5, "max": 28.4 },
      "volume24h": 8900000,
      "users24h": 1890,
      "category": "Lending",
      "contractAddress": "0xCFa5aE7c2CE8Fadc6426C1ff872cA45378Fb7cF3",
      "website": "https://lendle.xyz"
    }
  ]
}
```

#### Get Transaction History
```
GET /api/v1/transactions/:poolId
```
Returns recent NAV-related transactions for a pool.

**Response:**
```json
{
  "success": true,
  "poolId": "POOL-001",
  "transactions": [
    {
      "hash": "0x...",
      "blockNumber": 68234567,
      "timestamp": "2024-12-18T10:00:00Z",
      "type": "NAV_UPDATE",
      "gasUsed": 245000,
      "gasPrice": "0.02",
      "explorerUrl": "https://explorer.mantle.xyz/tx/0x..."
    }
  ]
}
```

#### Get Admin Report
```
GET /api/v1/reports/:poolId
POST /api/v1/reports/generate
```
Get or generate NAV admin reports.

**Response:**
```json
{
  "success": true,
  "report": {
    "reportId": "RPT-ABC123",
    "generatedAt": "2024-12-18T10:00:00Z",
    "auditor": "James Chen, CPA, CFA",
    "auditorFirm": "Mantle Audit Partners LLP",
    "period": "December 2024",
    "totalNAV": 428000000,
    "navChange": 2.45,
    "poolCount": 70,
    "transactionHash": "0x...",
    "blockNumber": 68234567,
    "verificationStatus": "verified",
    "breakdown": [
      { "category": "DeFi", "value": 150000000, "percentage": 35.0 }
    ],
    "findings": [
      {
        "type": "success",
        "title": "NAV Calculation Verified",
        "description": "All oracle feeds within tolerance"
      }
    ]
  }
}
```

### WebSocket API

For real-time updates, implement WebSocket endpoints:

```
WS /api/v1/ws/prices
WS /api/v1/ws/nav
```

**Message Format:**
```json
{
  "type": "NAV_UPDATE",
  "poolId": "POOL-001",
  "nav": 25000000,
  "unitPrice": 1.28,
  "timestamp": 1702918800000
}
```

## 🔗 External Data Sources

### Price APIs

1. **CoinGecko API** (Primary)
   - Endpoint: `https://api.coingecko.com/api/v3/`
   - Rate Limit: 10-50 calls/minute (depending on plan)
   - Documentation: https://www.coingecko.com/en/api/documentation

2. **Gate.io API** (Secondary)
   - Endpoint: `https://api.gateio.ws/api/v4/`
   - Rate Limit: 900 calls/minute
   - Documentation: https://www.gate.io/docs/developers/apiv4/

### Blockchain APIs

1. **Mantle Network RPC**
   - Mainnet: `https://rpc.mantle.xyz`
   - Chain ID: 5000
   - Explorer API: `https://explorer.mantle.xyz/api`

2. **Mantle Explorer API**
   - Base URL: `https://explorer.mantle.xyz/api`
   - Endpoints:
     - `/v2/blocks` - Get latest blocks
     - `/v2/transactions` - Get transactions
     - `/v2/addresses/:address` - Get address info

### DeFi Protocol APIs

1. **DeFiLlama** (TVL Data)
   - Endpoint: `https://api.llama.fi/`
   - Documentation: https://defillama.com/docs/api

2. **CryptoRank** (Mantle Token Data)
   - Endpoint: `https://api.cryptorank.io/v1/`
   - Documentation: https://cryptorank.io/api

## 📋 Smart Contract Addresses

### Mantle Network (Chain ID: 5000)

| Contract | Address | Purpose |
|----------|---------|---------|
| MNT Token | `0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000` | Native Mantle Token |
| WMNT | `0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8` | Wrapped MNT |
| USDC | `0x09Bc4E0D10E52467E5f0E6f5A38f8F1E9E0E8C0a` | USD Coin |
| USDT | `0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE` | Tether USD |
| WETH | `0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111` | Wrapped Ether |
| Agni Router | `0x319B69888b0d11CeC22B83e5C6D2F4C1D66d4A90` | Agni Finance DEX |
| Lendle Pool | `0xCFa5aE7c2CE8Fadc6426C1ff872cA45378Fb7cF3` | Lendle Lending |

## 🛠️ Backend Requirements

### Database Schema

```sql
-- Pools Table
CREATE TABLE pools (
  id VARCHAR(20) PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  contract_address VARCHAR(66) NOT NULL,
  category VARCHAR(50),
  risk_level VARCHAR(20),
  decimals INT DEFAULT 18,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- NAV History Table
CREATE TABLE nav_history (
  id SERIAL PRIMARY KEY,
  pool_id VARCHAR(20) REFERENCES pools(id),
  nav DECIMAL(38, 18) NOT NULL,
  unit_price DECIMAL(38, 18) NOT NULL,
  units_outstanding DECIMAL(38, 18),
  tx_hash VARCHAR(66),
  block_number BIGINT,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Price Data Table
CREATE TABLE price_data (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  price_usd DECIMAL(38, 18) NOT NULL,
  change_24h DECIMAL(10, 4),
  high_24h DECIMAL(38, 18),
  low_24h DECIMAL(38, 18),
  volume_24h DECIMAL(38, 2),
  market_cap DECIMAL(38, 2),
  source VARCHAR(50),
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- DeFi Protocol Metrics
CREATE TABLE defi_metrics (
  id SERIAL PRIMARY KEY,
  protocol_name VARCHAR(100) NOT NULL,
  tvl DECIMAL(38, 2) NOT NULL,
  tvl_change_24h DECIMAL(10, 4),
  apy DECIMAL(10, 4),
  volume_24h DECIMAL(38, 2),
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Admin Reports Table
CREATE TABLE admin_reports (
  id VARCHAR(50) PRIMARY KEY,
  generated_at TIMESTAMP NOT NULL,
  auditor VARCHAR(100),
  auditor_firm VARCHAR(100),
  period VARCHAR(50),
  total_nav DECIMAL(38, 2),
  nav_change DECIMAL(10, 4),
  pool_count INT,
  tx_hash VARCHAR(66),
  block_number BIGINT,
  verification_status VARCHAR(20),
  findings JSONB,
  breakdown JSONB
);

-- Indexes
CREATE INDEX idx_nav_history_pool ON nav_history(pool_id);
CREATE INDEX idx_nav_history_time ON nav_history(recorded_at DESC);
CREATE INDEX idx_price_data_symbol ON price_data(symbol);
CREATE INDEX idx_price_data_time ON price_data(recorded_at DESC);
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rwa_nav

# Mantle Network
MANTLE_RPC_URL=https://rpc.mantle.xyz
MANTLE_CHAIN_ID=5000
MANTLE_EXPLORER_API=https://explorer.mantle.xyz/api

# External APIs
COINGECKO_API_KEY=your_api_key
GATEIO_API_KEY=your_api_key
DEFILLAMA_API_KEY=your_api_key

# Server
PORT=3001
NODE_ENV=production

# WebSocket
WS_PORT=3002
```

### Cron Jobs

| Job | Frequency | Description |
|-----|-----------|-------------|
| `fetch_prices` | Every 30s | Fetch latest prices from CoinGecko |
| `update_nav` | Every 1m | Calculate and update NAV for all pools |
| `sync_blockchain` | Every 15s | Sync latest blocks/transactions |
| `update_defi_tvl` | Every 5m | Fetch DeFi TVL from DeFiLlama |
| `generate_reports` | Daily | Generate daily admin reports |
| `cleanup_old_data` | Daily | Archive data older than 90 days |

## 🚀 Getting Started

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Development

```bash
# Install dependencies
cd server
npm install

# Run database migrations
npm run migrate

# Start development server
npm run dev

# Start production server
npm start
```

## 📝 License

MIT License - see LICENSE file for details.

## 🔗 Links

- **Live Demo**: https://rwa-insight-hub.vercel.app/
- **Mantle Network**: https://mantle.xyz
- **Mantle Explorer**: https://explorer.mantle.xyz
- **Documentation**: https://docs.mantle.xyz
