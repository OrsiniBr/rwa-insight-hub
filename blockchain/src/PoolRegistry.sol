// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PoolRegistry
/// @notice Tracks pools and asset memberships
contract PoolRegistry is Ownable {
    struct Pool {
        string name;
        bytes32[] assets; // list of assetIds
        bool exists;
    }

    // poolId => Pool
    mapping(bytes32 => Pool) public pools;

    // assetId => poolIds (for quick lookup)
    mapping(bytes32 => bytes32[]) public assetToPools;

    // events
    event PoolCreated(bytes32 indexed poolId, string name);
    event AssetAddedToPool(bytes32 indexed poolId, bytes32 indexed assetId);

    constructor() Ownable(msg.sender) {}

    /// @notice Create a new pool
    function createPool(bytes32 poolId, string calldata name) external onlyOwner {
        require(!pools[poolId].exists, "Pool exists");
        pools[poolId].name = name;
        pools[poolId].exists = true;
        emit PoolCreated(poolId, name);
    }

    /// @notice Add asset to pool
    function addAssetToPool(bytes32 poolId, bytes32 assetId) external onlyOwner {
        require(pools[poolId].exists, "Pool not found");
        // avoid duplicates
        bytes32[] storage assets = pools[poolId].assets;
        for (uint256 i = 0; i < assets.length; i++) {
            require(assets[i] != assetId, "Asset already in pool");
        }
        assets.push(assetId);
        assetToPools[assetId].push(poolId);
        emit AssetAddedToPool(poolId, assetId);
    }

    /// @notice Get all assets in a pool
    function getPoolAssets(bytes32 poolId) external view returns (bytes32[] memory) {
        require(pools[poolId].exists, "Pool not found");
        return pools[poolId].assets;
    }

    /// @notice Get all pools an asset belongs to
    function getAssetPools(bytes32 assetId) external view returns (bytes32[] memory) {
        return assetToPools[assetId];
    }
}
