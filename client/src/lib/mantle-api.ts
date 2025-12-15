// Mantle Network API Integration
// Fetches real transactions and block data from Mantle Network

export interface MantleTransaction {
  hash: string;
  blockNumber: number;
  blockHash: string;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  status: "success" | "failed";
  method?: string;
}

export interface MantleBlock {
  number: number;
  hash: string;
  timestamp: number;
  transactionsCount: number;
  gasUsed: string;
  gasLimit: string;
  miner: string;
}

export interface MantleAccountInfo {
  address: string;
  balance: string;
  transactionCount: number;
}

// Mantle Network Configuration
export const MANTLE_NETWORK = {
  mainnet: {
    chainId: 5000,
    name: "Mantle",
    rpcUrl: "https://rpc.mantle.xyz",
    explorerUrl: "https://explorer.mantle.xyz",
    explorerApiUrl: "https://explorer.mantle.xyz/api/v2",
  },
  testnet: {
    chainId: 5003,
    name: "Mantle Sepolia",
    rpcUrl: "https://rpc.sepolia.mantle.xyz",
    explorerUrl: "https://explorer.sepolia.mantle.xyz",
    explorerApiUrl: "https://explorer.sepolia.mantle.xyz/api/v2",
  },
};

const NETWORK = MANTLE_NETWORK.mainnet;

/**
 * Fetch latest transactions from Mantle Network
 */
export async function fetchLatestTransactions(limit: number = 10): Promise<MantleTransaction[]> {
  try {
    const response = await fetch(
      `${NETWORK.explorerApiUrl}/transactions?limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Mantle API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items?.map((tx: any) => ({
      hash: tx.hash,
      blockNumber: tx.block_number || tx.block,
      blockHash: tx.block_hash,
      timestamp: new Date(tx.timestamp).getTime(),
      from: tx.from?.hash || tx.from,
      to: tx.to?.hash || tx.to,
      value: tx.value,
      gasUsed: tx.gas_used,
      gasPrice: tx.gas_price,
      status: tx.status === "ok" ? "success" : "failed",
      method: tx.method,
    })) || [];
  } catch (error) {
    console.error("Error fetching Mantle transactions:", error);
    return [];
  }
}

/**
 * Fetch latest blocks from Mantle Network
 */
export async function fetchLatestBlocks(limit: number = 5): Promise<MantleBlock[]> {
  try {
    const response = await fetch(
      `${NETWORK.explorerApiUrl}/blocks?limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Mantle API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items?.map((block: any) => ({
      number: block.height,
      hash: block.hash,
      timestamp: new Date(block.timestamp).getTime(),
      transactionsCount: block.tx_count,
      gasUsed: block.gas_used,
      gasLimit: block.gas_limit,
      miner: block.miner?.hash || block.miner,
    })) || [];
  } catch (error) {
    console.error("Error fetching Mantle blocks:", error);
    return [];
  }
}

/**
 * Fetch a specific transaction by hash
 */
export async function fetchTransaction(txHash: string): Promise<MantleTransaction | null> {
  try {
    const response = await fetch(
      `${NETWORK.explorerApiUrl}/transactions/${txHash}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Mantle API error: ${response.status}`);
    }

    const tx = await response.json();
    
    return {
      hash: tx.hash,
      blockNumber: tx.block_number || tx.block,
      blockHash: tx.block_hash,
      timestamp: new Date(tx.timestamp).getTime(),
      from: tx.from?.hash || tx.from,
      to: tx.to?.hash || tx.to,
      value: tx.value,
      gasUsed: tx.gas_used,
      gasPrice: tx.gas_price,
      status: tx.status === "ok" ? "success" : "failed",
      method: tx.method,
    };
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
}

/**
 * Fetch a specific block by number
 */
export async function fetchBlock(blockNumber: number): Promise<MantleBlock | null> {
  try {
    const response = await fetch(
      `${NETWORK.explorerApiUrl}/blocks/${blockNumber}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Mantle API error: ${response.status}`);
    }

    const block = await response.json();
    
    return {
      number: block.height,
      hash: block.hash,
      timestamp: new Date(block.timestamp).getTime(),
      transactionsCount: block.tx_count,
      gasUsed: block.gas_used,
      gasLimit: block.gas_limit,
      miner: block.miner?.hash || block.miner,
    };
  } catch (error) {
    console.error("Error fetching block:", error);
    return null;
  }
}

/**
 * Fetch network statistics
 */
export async function fetchNetworkStats(): Promise<{
  totalTransactions: number;
  totalBlocks: number;
  avgBlockTime: number;
  gasPrice: string;
} | null> {
  try {
    const response = await fetch(
      `${NETWORK.explorerApiUrl}/stats`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Mantle API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      totalTransactions: data.total_transactions,
      totalBlocks: data.total_blocks,
      avgBlockTime: data.average_block_time,
      gasPrice: data.gas_prices?.average || "0",
    };
  } catch (error) {
    console.error("Error fetching network stats:", error);
    return null;
  }
}

/**
 * Generate explorer URLs
 */
export function getExplorerTxUrl(txHash: string): string {
  return `${NETWORK.explorerUrl}/tx/${txHash}`;
}

export function getExplorerBlockUrl(blockNumber: number): string {
  return `${NETWORK.explorerUrl}/block/${blockNumber}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${NETWORK.explorerUrl}/address/${address}`;
}

/**
 * Make RPC call to Mantle Network
 */
export async function rpcCall(method: string, params: any[] = []): Promise<any> {
  try {
    const response = await fetch(NETWORK.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error(`RPC error: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.result;
  } catch (error) {
    console.error("RPC call error:", error);
    return null;
  }
}

/**
 * Get latest block number via RPC
 */
export async function getLatestBlockNumber(): Promise<number> {
  const result = await rpcCall('eth_blockNumber');
  return result ? parseInt(result, 16) : 0;
}

/**
 * Get gas price via RPC
 */
export async function getGasPrice(): Promise<string> {
  const result = await rpcCall('eth_gasPrice');
  return result || "0";
}

// API Documentation for README
export const MANTLE_API_DOCUMENTATION = `
## Mantle Network API Integration

### Explorer API (Primary)
- **Endpoint**: https://explorer.mantle.xyz/api/v2
- **Used For**: Fetching transactions, blocks, and account data
- **Documentation**: https://docs.mantle.xyz/network/for-devs/resources-and-tooling/explorers

### RPC API
- **Endpoint**: https://rpc.mantle.xyz
- **Chain ID**: 5000
- **Used For**: Direct blockchain queries
- **Documentation**: https://docs.mantle.xyz/network/for-devs/network-information/rpc-url

### Endpoints Used:
1. \`/transactions\` - Get latest transactions
2. \`/blocks\` - Get latest blocks
3. \`/transactions/{hash}\` - Get specific transaction
4. \`/blocks/{number}\` - Get specific block
5. \`/stats\` - Get network statistics

### RPC Methods:
1. \`eth_blockNumber\` - Get latest block number
2. \`eth_gasPrice\` - Get current gas price
3. \`eth_getTransactionByHash\` - Get transaction details
4. \`eth_getBlockByNumber\` - Get block details

### Implementation:
\`\`\`typescript
// Fetch latest Mantle transactions
const transactions = await fetchLatestTransactions(10);
console.log("Latest tx:", transactions[0]?.hash);

// Get block details
const block = await fetchBlock(12345678);
console.log("Block hash:", block?.hash);

// Make RPC call
const blockNumber = await getLatestBlockNumber();
console.log("Current block:", blockNumber);
\`\`\`
`;
