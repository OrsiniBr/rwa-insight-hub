// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title NAVRegistry
 * @dev Core contract for storing and managing Net Asset Value (NAV) calculations
 * for RWA pools. Designed for transparency and verifiability.
 */
contract NAVRegistry is AccessControl, Pausable, ReentrancyGuard {
    
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Maximum allowed NAV change per update (in basis points, e.g., 1000 = 10%)
    uint256 public maxNavChangePercent = 1000; // 10%

    // Minimum time between updates (in seconds)
    uint256 public minUpdateInterval = 1 hours;

    /**
     * @dev Structure for each NAV update
     */
    struct NAVUpdate {
        uint256 navValue;              // NAV in wei (18 decimals)
        uint256 timestamp;             // When this NAV was calculated
        uint256 blockNumber;           // Block number of update
        bytes32 dataHash;              // Hash of all input data sources
        address[] oracleFeeds;         // Oracle contract addresses used
        uint256[] oraclePrices;        // Prices from oracles at calculation time
        string explanationURI;         // IPFS/Arweave link to AI explanation
        address updatedBy;             // Which agent updated this
    }

    /**
     * @dev Structure for each RWA pool
     */
    struct Pool {
        address tokenAddress;          // ERC-20 token contract address
        string name;                   // Pool name
        bool isActive;                 // Whether pool is active
        uint256 createdAt;             // When pool was registered
        uint256 latestNavIndex;        // Index of latest NAV update
        uint256 totalUpdates;          // Total number of NAV updates
    }

    // Pool ID => Pool info
    mapping(bytes32 => Pool) public pools;
    
    // Pool ID => array of NAV updates (complete history)
    mapping(bytes32 => NAVUpdate[]) public navHistory;
    
    // Array of all pool IDs for enumeration
    bytes32[] public poolIds;

    // Track last update time per pool
    mapping(bytes32 => uint256) public lastUpdateTime;

    // Events
    event PoolRegistered(
        bytes32 indexed poolId,
        address indexed tokenAddress,
        string name,
        uint256 timestamp
    );

    event NAVUpdated(
        bytes32 indexed poolId,
        uint256 navValue,
        uint256 timestamp,
        bytes32 dataHash,
        string explanationURI,
        address indexed updatedBy
    );

    event NAVValidationWarning(
        bytes32 indexed poolId,
        string reason,
        uint256 oldNav,
        uint256 newNav
    );

    event PoolStatusChanged(
        bytes32 indexed poolId,
        bool isActive
    );

    event MaxNavChangeUpdated(uint256 oldValue, uint256 newValue);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    /**
     * @dev Register a new RWA pool
     * @param poolId Unique identifier for the pool
     * @param tokenAddress Address of the pool's ERC-20 token
     * @param name Human-readable pool name
     */
    function registerPool(
        bytes32 poolId,
        address tokenAddress,
        string memory name
    ) external onlyRole(ADMIN_ROLE) {
        require(pools[poolId].tokenAddress == address(0), "Pool already exists");
        require(tokenAddress != address(0), "Invalid token address");
        require(bytes(name).length > 0, "Name required");

        pools[poolId] = Pool({
            tokenAddress: tokenAddress,
            name: name,
            isActive: true,
            createdAt: block.timestamp,
            latestNavIndex: 0,
            totalUpdates: 0
        });

        poolIds.push(poolId);

        emit PoolRegistered(poolId, tokenAddress, name, block.timestamp);
    }

    /**
     * @dev Update NAV for a pool
     * @param poolId Pool identifier
     * @param navValue New NAV value (in wei, 18 decimals)
     * @param oracleFeeds Array of oracle contract addresses used
     * @param oraclePrices Array of prices from those oracles
     * @param dataHash Hash of all input data for verification
     * @param explanationURI Link to AI-generated explanation (IPFS/Arweave)
     */
    function updateNAV(
        bytes32 poolId,
        uint256 navValue,
        address[] memory oracleFeeds,
        uint256[] memory oraclePrices,
        bytes32 dataHash,
        string memory explanationURI
    ) external onlyRole(AGENT_ROLE) whenNotPaused nonReentrant {
        Pool storage pool = pools[poolId];
        require(pool.isActive, "Pool not active");
        require(navValue > 0, "NAV must be positive");
        require(oracleFeeds.length == oraclePrices.length, "Oracle data mismatch");
        require(dataHash != bytes32(0), "Data hash required");
        
        // Check minimum update interval
        require(
            block.timestamp >= lastUpdateTime[poolId] + minUpdateInterval,
            "Update too frequent"
        );

        // Validate NAV change if there's previous data
        if (pool.totalUpdates > 0) {
            uint256 previousNav = navHistory[poolId][pool.latestNavIndex].navValue;
            _validateNavChange(poolId, previousNav, navValue);
        }

        // Create new NAV update
        NAVUpdate memory newUpdate = NAVUpdate({
            navValue: navValue,
            timestamp: block.timestamp,
            blockNumber: block.number,
            dataHash: dataHash,
            oracleFeeds: oracleFeeds,
            oraclePrices: oraclePrices,
            explanationURI: explanationURI,
            updatedBy: msg.sender
        });

        // Store update
        navHistory[poolId].push(newUpdate);
        pool.latestNavIndex = pool.totalUpdates;
        pool.totalUpdates++;
        lastUpdateTime[poolId] = block.timestamp;

        emit NAVUpdated(
            poolId,
            navValue,
            block.timestamp,
            dataHash,
            explanationURI,
            msg.sender
        );
    }

    /**
     * @dev Validate NAV change is within acceptable range
     */
    function _validateNavChange(
        bytes32 poolId,
        uint256 oldNav,
        uint256 newNav
    ) internal {
        // Calculate percentage change
        uint256 change;
        if (newNav > oldNav) {
            change = ((newNav - oldNav) * 10000) / oldNav;
        } else {
            change = ((oldNav - newNav) * 10000) / oldNav;
        }

        // Emit warning if change exceeds threshold
        if (change > maxNavChangePercent) {
            emit NAVValidationWarning(
                poolId,
                "NAV change exceeds threshold",
                oldNav,
                newNav
            );
        }
    }

    /**
     * @dev Get latest NAV for a pool
     * @param poolId Pool identifier
     * @return NAVUpdate struct
     */
    function getLatestNAV(bytes32 poolId) 
        external 
        view 
        returns (NAVUpdate memory) 
    {
        Pool memory pool = pools[poolId];
        require(pool.totalUpdates > 0, "No NAV data");
        return navHistory[poolId][pool.latestNavIndex];
    }

    /**
     * @dev Get NAV history for a pool
     * @param poolId Pool identifier
     * @param limit Maximum number of updates to return (0 = all)
     * @return Array of NAVUpdate structs
     */
    function getNAVHistory(bytes32 poolId, uint256 limit)
        external
        view
        returns (NAVUpdate[] memory)
    {
        Pool memory pool = pools[poolId];
        uint256 total = pool.totalUpdates;
        
        if (total == 0) {
            return new NAVUpdate[](0);
        }

        uint256 returnCount = (limit == 0 || limit > total) ? total : limit;
        NAVUpdate[] memory history = new NAVUpdate[](returnCount);

        // Return most recent updates first
        for (uint256 i = 0; i < returnCount; i++) {
            history[i] = navHistory[poolId][total - 1 - i];
        }

        return history;
    }

    /**
     * @dev Get pool information
     * @param poolId Pool identifier
     */
    function getPool(bytes32 poolId) 
        external 
        view 
        returns (
            address tokenAddress,
            string memory name,
            bool isActive,
            uint256 createdAt,
            uint256 latestNavValue,
            uint256 totalUpdates
        ) 
    {
        Pool memory pool = pools[poolId];
        require(pool.tokenAddress != address(0), "Pool does not exist");

        uint256 nav = 0;
        if (pool.totalUpdates > 0) {
            nav = navHistory[poolId][pool.latestNavIndex].navValue;
        }

        return (
            pool.tokenAddress,
            pool.name,
            pool.isActive,
            pool.createdAt,
            nav,
            pool.totalUpdates
        );
    }

    /**
     * @dev Get all pool IDs
     */
    function getAllPoolIds() external view returns (bytes32[] memory) {
        return poolIds;
    }

    /**
     * @dev Get total number of pools
     */
    function getTotalPools() external view returns (uint256) {
        return poolIds.length;
    }

    /**
     * @dev Verify NAV calculation by checking data hash
     * @param poolId Pool identifier
     * @param navIndex Index of NAV update to verify
     * @param inputData Raw input data to verify against stored hash
     */
    function verifyNAVCalculation(
        bytes32 poolId,
        uint256 navIndex,
        bytes memory inputData
    ) external view returns (bool) {
        require(navIndex < pools[poolId].totalUpdates, "Invalid index");
        
        NAVUpdate memory update = navHistory[poolId][navIndex];
        bytes32 computedHash = keccak256(inputData);
        
        return computedHash == update.dataHash;
    }

    /**
     * @dev Get oracle data used for a specific NAV update
     * @param poolId Pool identifier
     * @param navIndex Index of NAV update
     */
    function getOracleData(bytes32 poolId, uint256 navIndex)
        external
        view
        returns (address[] memory feeds, uint256[] memory prices)
    {
        require(navIndex < pools[poolId].totalUpdates, "Invalid index");
        NAVUpdate memory update = navHistory[poolId][navIndex];
        return (update.oracleFeeds, update.oraclePrices);
    }

    // ========== ADMIN FUNCTIONS ==========

    /**
     * @dev Set pool active status
     */
    function setPoolStatus(bytes32 poolId, bool isActive) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(pools[poolId].tokenAddress != address(0), "Pool does not exist");
        pools[poolId].isActive = isActive;
        emit PoolStatusChanged(poolId, isActive);
    }

    /**
     * @dev Update maximum allowed NAV change percentage
     */
    function setMaxNavChangePercent(uint256 newPercent) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(newPercent > 0 && newPercent <= 5000, "Invalid percentage"); // Max 50%
        uint256 oldValue = maxNavChangePercent;
        maxNavChangePercent = newPercent;
        emit MaxNavChangeUpdated(oldValue, newPercent);
    }

    /**
     * @dev Update minimum update interval
     */
    function setMinUpdateInterval(uint256 newInterval) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(newInterval >= 5 minutes, "Interval too short");
        minUpdateInterval = newInterval;
    }

    /**
     * @dev Pause contract (emergency)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Grant agent role to address
     */
    function addAgent(address agent) external onlyRole(ADMIN_ROLE) {
        grantRole(AGENT_ROLE, agent);
    }

    /**
     * @dev Revoke agent role from address
     */
    function removeAgent(address agent) external onlyRole(ADMIN_ROLE) {
        revokeRole(AGENT_ROLE, agent);
    }
}