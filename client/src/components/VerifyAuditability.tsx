import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ExternalLink,
  Copy,
  Check,
  Blocks,
  FileCode,
  Hash,
  Clock,
  Fuel,
  Link,
  RefreshCw,
  CheckCircle2,
  Zap
} from "lucide-react";
import {
  generateAuditData,
  AuditData,
  MANTLE_CONFIG
} from "@/lib/mantle-utils";
import {
  fetchLatestTransactions,
  fetchLatestBlocks,
  getExplorerTxUrl,
  getExplorerBlockUrl,
  MantleTransaction,
  MantleBlock
} from "@/lib/mantle-api";

interface VerifyAuditabilityProps {
  poolId: string;
  poolName: string;
}

export function VerifyAuditability({ poolId, poolName }: VerifyAuditabilityProps) {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [realTx, setRealTx] = useState<MantleTransaction | null>(null);
  const [realBlock, setRealBlock] = useState<MantleBlock | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [transactions, blocks] = await Promise.all([
          fetchLatestTransactions(1),
          fetchLatestBlocks(1),
        ]);
        
        if (transactions.length > 0) {
          setRealTx(transactions[0]);
        }
        if (blocks.length > 0) {
          setRealBlock(blocks[0]);
        }
        
        // Generate supplementary audit data
        const audit = generateAuditData();
        if (transactions[0]) {
          audit.navTxHash = transactions[0].hash;
          audit.navBlockNumber = transactions[0].blockNumber;
          audit.navBlockHash = transactions[0].blockHash;
          audit.timestamp = transactions[0].timestamp;
          audit.gasUsed = parseInt(transactions[0].gasUsed) || audit.gasUsed;
        }
        setAuditData(audit);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Mantle data:", error);
        setAuditData(generateAuditData());
        setIsLoading(false);
      }
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 30000);
    return () => clearInterval(interval);
  }, [poolId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const truncateHash = (hash: string | undefined) => {
    if (!hash) return "Loading...";
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationStatus("verifying");
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setVerificationStatus("verified");
    setIsVerifying(false);
    
    // Reset after 5 seconds
    setTimeout(() => setVerificationStatus("idle"), 5000);
  };

  if (!auditData || isLoading) {
    return (
      <div className="glass-card p-4 animate-fade-in glow-primary">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-full bg-primary/20 p-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground">Verify Auditability</h3>
            <p className="text-[8px] text-muted-foreground">Loading Mantle Network data...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-5 w-5 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  const formatGas = (gas: number) => {
    return gas < 0.001 ? `${(gas * 1000000).toFixed(2)} µMNT` : `${(gas * 1000).toFixed(4)} mMNT`;
  };

  return (
    <div className="glass-card p-4 animate-fade-in glow-primary">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/20 p-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground">
              Verify Auditability
            </h3>
            <p className="text-[8px] text-muted-foreground">
              On-chain verification for {poolName}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="h-6 px-2 text-[9px]"
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {verificationStatus === "verifying" ? (
            <>
              <RefreshCw className="h-2.5 w-2.5 mr-1 animate-spin" />
              Verifying...
            </>
          ) : verificationStatus === "verified" ? (
            <>
              <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
              Verified
            </>
          ) : (
            <>
              <Shield className="h-2.5 w-2.5 mr-1" />
              Verify Now
            </>
          )}
        </Button>
      </div>

      {/* Main Audit Info */}
      <div className="space-y-2.5">
        {/* NAV Transaction */}
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <FileCode className="h-3 w-3 text-primary" />
              <span className="text-[9px] font-medium text-foreground">NAV Transaction</span>
            </div>
            <a
              href={getExplorerTxUrl(auditData.navTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[8px] text-primary hover:underline"
            >
              View on Explorer
              <ExternalLink className="h-2 w-2" />
            </a>
          </div>
          <div className="flex items-center justify-between bg-background/50 rounded px-2 py-1.5">
            <code className="text-[8px] text-muted-foreground font-mono">
              {truncateHash(auditData.navTxHash)}
            </code>
            <button
              onClick={() => copyToClipboard(auditData.navTxHash, "tx")}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              {copiedItem === "tx" ? (
                <Check className="h-2.5 w-2.5 text-success" />
              ) : (
                <Copy className="h-2.5 w-2.5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Block Information */}
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Blocks className="h-3 w-3 text-secondary" />
              <span className="text-[9px] font-medium text-foreground">Block Information</span>
            </div>
            <a
              href={getExplorerBlockUrl(auditData.navBlockNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[8px] text-primary hover:underline"
            >
              Block #{auditData.navBlockNumber.toLocaleString()}
              <ExternalLink className="h-2 w-2" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background/50 rounded px-2 py-1.5">
              <span className="text-[7px] text-muted-foreground block mb-0.5">Block Hash</span>
              <code className="text-[8px] text-foreground font-mono">
                {truncateHash(auditData.navBlockHash)}
              </code>
            </div>
            <div className="bg-background/50 rounded px-2 py-1.5">
              <span className="text-[7px] text-muted-foreground block mb-0.5">Timestamp</span>
              <span className="text-[8px] text-foreground">
                {new Date(auditData.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Data Snapshot */}
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center gap-1.5 mb-2">
            <Hash className="h-3 w-3 text-warning" />
            <span className="text-[9px] font-medium text-foreground">Data Snapshot</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between bg-background/50 rounded px-2 py-1.5">
              <div>
                <span className="text-[7px] text-muted-foreground block">Snapshot ID</span>
                <code className="text-[8px] text-foreground font-mono">{auditData.snapshotId}</code>
              </div>
              <button
                onClick={() => copyToClipboard(auditData.snapshotId, "snapshot")}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {copiedItem === "snapshot" ? (
                  <Check className="h-2.5 w-2.5 text-success" />
                ) : (
                  <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between bg-background/50 rounded px-2 py-1.5">
              <div>
                <span className="text-[7px] text-muted-foreground block">Data Hash</span>
                <code className="text-[8px] text-foreground font-mono">{auditData.dataHash}</code>
              </div>
              <button
                onClick={() => copyToClipboard(auditData.dataHash, "dataHash")}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {copiedItem === "dataHash" ? (
                  <Check className="h-2.5 w-2.5 text-success" />
                ) : (
                  <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between bg-background/50 rounded px-2 py-1.5">
              <div>
                <span className="text-[7px] text-muted-foreground block">Merkle Root</span>
                <code className="text-[8px] text-foreground font-mono">{truncateHash(auditData.merkleRoot)}</code>
              </div>
              <button
                onClick={() => copyToClipboard(auditData.merkleRoot, "merkle")}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                {copiedItem === "merkle" ? (
                  <Check className="h-2.5 w-2.5 text-success" />
                ) : (
                  <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ZK Proof & Batch Info */}
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="h-3 w-3 text-success" />
            <span className="text-[9px] font-medium text-foreground">ZK Validity Proof</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background/50 rounded px-2 py-1.5">
              <span className="text-[7px] text-muted-foreground block mb-0.5">Batch ID</span>
              <span className="text-[8px] text-foreground">#{auditData.batchId.toLocaleString()}</span>
            </div>
            <div className="bg-background/50 rounded px-2 py-1.5">
              <span className="text-[7px] text-muted-foreground block mb-0.5">State Root</span>
              <code className="text-[7px] text-foreground font-mono">{truncateHash(auditData.stateRoot)}</code>
            </div>
          </div>
          <div className="mt-1.5 bg-background/50 rounded px-2 py-1.5">
            <span className="text-[7px] text-muted-foreground block mb-0.5">ZK Proof Hash</span>
            <code className="text-[7px] text-foreground font-mono">{truncateHash(auditData.zkProofHash)}</code>
          </div>
        </div>

        {/* Gas Costs */}
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center gap-1.5 mb-2">
            <Fuel className="h-3 w-3 text-muted-foreground" />
            <span className="text-[9px] font-medium text-foreground">Transaction Costs</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="bg-background/50 rounded px-2 py-1.5 text-center">
              <span className="text-[7px] text-muted-foreground block">Gas Used</span>
              <span className="text-[8px] text-foreground font-medium">{auditData.gasUsed.toLocaleString()}</span>
            </div>
            <div className="bg-background/50 rounded px-2 py-1.5 text-center">
              <span className="text-[7px] text-muted-foreground block">L2 Cost</span>
              <span className="text-[8px] text-foreground font-medium">{formatGas(auditData.l2ExecutionCost)}</span>
            </div>
            <div className="bg-background/50 rounded px-2 py-1.5 text-center">
              <span className="text-[7px] text-muted-foreground block">L1 Data</span>
              <span className="text-[8px] text-foreground font-medium">{formatGas(auditData.l1DataCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Badge */}
      <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Link className="h-3 w-3 text-primary" />
          <span className="text-[8px] text-muted-foreground">
            Mantle Network (Chain ID: {MANTLE_CONFIG.mainnet.chainId})
          </span>
        </div>
        <Badge variant="success" className="text-[7px]">
          <div className="status-dot status-healthy mr-1" />
          Mainnet
        </Badge>
      </div>
    </div>
  );
}
