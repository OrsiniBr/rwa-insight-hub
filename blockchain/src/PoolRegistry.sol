// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PoolRegistry
 * @dev Registry for managing RWA pool metadata and underlying assets
 * Separate from NAVRegistry to keep concerns separated
 */
contract PoolRegistry is Ownable {

    struct Asset {
        bytes32 assetId;           // Unique asset identifier (matches OracleAggregator)
        uint256 balance;           // Amount held by pool
        uint8 decimals;            // Token decimals
        string assetType;          // "Crypto", "RealEstate", "Bond", "Cash"
        bool isActive;             // Whether asset is currently held
    }

    struct PoolMetadata {
        bytes32 poolId;            // Unique pool identifier
        address tokenAddress;      // ERC-20 token contract
        string name;               // Pool name
        string category;           // "Real Estate", "Fixed Income", "Mixed"
        string strategyURI;        // IPFS link to investment strategy doc
        uint256 inceptionDate;     // When pool was created
        uint256 totalAssets;       // Count of different assets held
        bool isActive;             // Whether pool is active
    }

    // Pool ID => PoolMetadata
    mapping(bytes32 => PoolMetadata) public pools;
    
    // Pool ID => Asset ID => Asset
    mapping(bytes32 => mapping(bytes32 => Asset)) public poolAssets;
    
    // Pool ID => array of asset IDs
    mapping(bytes32 => bytes32[]) public poolAssetIds;
    
    // List of all pool IDs
    bytes32[] public allPoolIds;
    
    // Category => pool IDs
    mapping(string => bytes32[]) public poolsByCategory;

    // Events
    event PoolRegistered(
        bytes32 indexed poolId,
        address indexed tokenAddress,
        string name,
        string category
    );

    event PoolMetadataUpdated(
        bytes32 indexed poolId,
        string strategyURI
    );

    event AssetAdded(
        bytes32 indexed poolId,
        bytes32 indexed assetId,
        string assetType,
        uint256 balance
    );

    event AssetBalanceUpdated(
        bytes32 indexed poolId,
        bytes32 indexed assetId,
        uint256 oldBalance,
        uint256 newBalance
    );

    event AssetRemoved(
        bytes32 indexed poolId,
        bytes32 indexed assetId
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register a new RWA pool
     * @param poolId Unique identifier (e.g., keccak256("real-estate-pool-1"))
     * @param tokenAddress ERC-20 token contract address
     * @param name Pool name
     * @param category Pool category
     * @param strategyURI IPFS link to strategy document
     */
    function registerPool(
        bytes32 poolId,
        address tokenAddress,
        string memory name,
        string memory category,
        string memory strategyURI
    ) external onlyOwner {
        require(pools[poolId].tokenAddress == address(0), "Pool exists");
        require(tokenAddress != address(0), "Invalid token");
        require(bytes(name).length > 0, "Name required");

        pools[poolId] = PoolMetadata({
            poolId: poolId,
            tokenAddress: tokenAddress,
            name: name,
            category: category,
            strategyURI: strategyURI,
            inceptionDate: block.timestamp,
            totalAssets: 0,
            isActive: true
        });

        allPoolIds.push(poolId);
        poolsByCategory[category].push(poolId);

        emit PoolRegistered(poolId, tokenAddress, name, category);
    }

    /**
     * @dev Add or update asset held by pool
     * @param poolId Pool identifier
     * @param assetId Asset identifier (matches OracleAggregator)
     * @param balance Current balance of asset
     * @param decimals Asset decimals
     * @param assetType Type of asset
     */
    function updatePoolAsset(
        bytes32 poolId,
        bytes32 assetId,
        uint256 balance,
        uint8 decimals,
        string memory assetType
    ) external onlyOwner {
        require(pools[poolId].isActive, "Pool not active");

        Asset storage asset = poolAssets[poolId][assetId];
        
        // New asset
        if (!asset.isActive) {
            asset.assetId = assetId;
            asset.decimals = decimals;
            asset.assetType = assetType;
            asset.isActive = true;
            
            poolAssetIds[poolId].push(assetId);
            pools[poolId].totalAssets++;
            
            emit AssetAdded(poolId, assetId, assetType, balance);
        } else {
            // Update existing asset
            uint256 oldBalance = asset.balance;
            emit AssetBalanceUpdated(poolId, assetId, oldBalance, balance);
        }
        
        asset.balance = balance;
    }

    /**
     * @dev Remove asset from pool
     * @param poolId Pool identifier
     * @param assetId Asset identifier
     */
    function removePoolAsset(bytes32 poolId, bytes32 assetId)
        external
        onlyOwner
    {
        require(poolAssets[poolId][assetId].isActive, "Asset not active");
        
        poolAssets[poolId][assetId].isActive = false;
        poolAssets[poolId][assetId].balance = 0;
        
        // Note: We don't remove from poolAssetIds array to preserve history
        // Just mark as inactive
        
        pools[poolId].totalAssets--;
        
        emit AssetRemoved(poolId, assetId);
    }

    /**
     * @dev Get all assets for a pool
     * @param poolId Pool identifier
     * @return Array of Asset structs (only active assets)
     */
    function getPoolAssets(bytes32 poolId)
        external
        view
        returns (Asset[] memory)
    {
        bytes32[] memory assetIds = poolAssetIds[poolId];
        uint256 activeCount = 0;
        
        // Count active assets
        for (uint256 i = 0; i < assetIds.length; i++) {
            if (poolAssets[poolId][assetIds[i]].isActive) {
                activeCount++;
            }
        }
        
        // Build array of active assets
        Asset[] memory assets = new Asset[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < assetIds.length; i++) {
            Asset memory asset = poolAssets[poolId][assetIds[i]];
            if (asset.isActive) {
                assets[index] = asset;
                index++;
            }
        }
        
        return assets;
    }

    /**
     * @dev Get pool metadata
     * @param poolId Pool identifier
     */
    function getPool(bytes32 poolId)
        external
        view
        returns (PoolMetadata memory)
    {
        require(pools[poolId].tokenAddress != address(0), "Pool not found");
        return pools[poolId];
    }

    /**
     * @dev Get all pools
     */
    function getAllPools() external view returns (bytes32[] memory) {
        return allPoolIds;
    }

    /**
     * @dev Get pools by category
     * @param category Category name
     */
    function getPoolsByCategory(string memory category)
        external
        view
        returns (bytes32[] memory)
    {
        return poolsByCategory[category];
    }

    /**
     * @dev Get total supply of pool tokens
     * @param poolId Pool identifier
     */
    function getPoolTokenSupply(bytes32 poolId)
        external
        view
        returns (uint256)
    {
        address tokenAddress = pools[poolId].tokenAddress;
        require(tokenAddress != address(0), "Pool not found");
        
        return IERC20(tokenAddress).totalSupply();
    }

    /**
     * @dev Update pool strategy URI
     * @param poolId Pool identifier
     * @param newStrategyURI New IPFS URI
     */
    function updateStrategyURI(bytes32 poolId, string memory newStrategyURI)
        external
        onlyOwner
    {
        require(pools[poolId].tokenAddress != address(0), "Pool not found");
        pools[poolId].strategyURI = newStrategyURI;
        
        emit PoolMetadataUpdated(poolId, newStrategyURI);
    }

    /**
     * @dev Set pool active status
     * @param poolId Pool identifier
     * @param isActive New status
     */
    function setPoolStatus(bytes32 poolId, bool isActive)
        external
        onlyOwner
    {
        require(pools[poolId].tokenAddress != address(0), "Pool not found");
        pools[poolId].isActive = isActive;
    }

    /**
     * @dev Get complete pool info with assets
     * @param poolId Pool identifier
     */
    function getCompletePoolInfo(bytes32 poolId)
        external
        view
        returns (
            PoolMetadata memory metadata,
            Asset[] memory assets,
            uint256 tokenSupply
        )
    {
        require(pools[poolId].tokenAddress != address(0), "Pool not found");
        
        // Get metadata
        metadata = pools[poolId];
        
        // Get active assets
        bytes32[] memory assetIds = poolAssetIds[poolId];
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < assetIds.length; i++) {
            if (poolAssets[poolId][assetIds[i]].isActive) {
                activeCount++;
            }
        }
        
        assets = new Asset[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < assetIds.length; i++) {
            Asset memory asset = poolAssets[poolId][assetIds[i]];
            if (asset.isActive) {
                assets[index] = asset;
                index++;
            }
        }
        
        // Get token supply
        tokenSupply = IERC20(metadata.tokenAddress).totalSupply();
        
        return (metadata, assets, tokenSupply);
    }
}