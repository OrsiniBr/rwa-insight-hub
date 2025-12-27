// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title NavRegistry
/// @notice Tracks asset NAVs. Backend updates NAVs.
contract NAVRegistry is Ownable {
    struct Asset {
        string name;
        string symbol;
        uint256 nav; // NAV in smallest unit (e.g., wei)
        bool exists;
    }

    // assetId => Asset
    mapping(bytes32 => Asset) public assets;

    // events
    event AssetAdded(bytes32 indexed assetId, string name, string symbol);
    event NavUpdated(bytes32 indexed assetId, uint256 oldNav, uint256 newNav);

    constructor() Ownable(msg.sender) {}


    /// @notice Add a new asset
    function addAsset(bytes32 assetId, string calldata name, string calldata symbol) external onlyOwner {
        require(!assets[assetId].exists, "Asset exists");
        assets[assetId] = Asset({name: name, symbol: symbol, nav: 0, exists: true});
        emit AssetAdded(assetId, name, symbol);
    }

    /// @notice Update the NAV of an asset
    function updateNav(bytes32 assetId, uint256 newNav) external onlyOwner {
        Asset storage asset = assets[assetId];
        require(asset.exists, "Asset not found");
        uint256 oldNav = asset.nav;
        asset.nav = newNav;
        emit NavUpdated(assetId, oldNav, newNav);
    }

    /// @notice Check if an asset exists
    function isAsset(bytes32 assetId) external view returns (bool) {
        return assets[assetId].exists;
    }

    /// @notice Get NAV of an asset
    function getNav(bytes32 assetId) external view returns (uint256) {
        require(assets[assetId].exists, "Asset not found");
        return assets[assetId].nav;
    }
}



// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.28;

// import "@openzeppelin/contracts/access/Ownable.sol";

// /// @title NavRegistry
// /// @notice Tracks asset NAVs. Backend updates NAVs.
// contract NAVRegistry is Ownable {
//     struct Asset {
//         string name;
//         string symbol;
//         uint256 nav; // NAV in smallest unit (e.g., wei)
//         bool exists;
//     }

//     // assetId => Asset
//     mapping(bytes32 => Asset) public assets;

//     // events
//     event AssetAdded(bytes32 indexed assetId, string name, string symbol);
//     event NavUpdated(bytes32 indexed assetId, uint256 oldNav, uint256 newNav);

//     constructor() Ownable(msg.sender) {}


//     /// @notice Add a new asset
//     function addAsset(bytes32 assetId, string calldata name, string calldata symbol) external onlyOwner {
//         require(!assets[assetId].exists, "Asset exists");
//         assets[assetId] = Asset({name: name, symbol: symbol, nav: 0, exists: true});
//         emit AssetAdded(assetId, name, symbol);
//     }

//     /// @notice Update the NAV of an asset
//     function updateNav(bytes32 assetId, uint256 newNav) external onlyOwner {
//         Asset storage asset = assets[assetId];
//         require(asset.exists, "Asset not found");
//         uint256 oldNav = asset.nav;
//         asset.nav = newNav;
//         emit NavUpdated(assetId, oldNav, newNav);
//     }

//     /// @notice Check if an asset exists
//     function isAsset(bytes32 assetId) external view returns (bool) {
//         return assets[assetId].exists;
//     }

//     /// @notice Get NAV of an asset
//     function getNav(bytes32 assetId) external view returns (uint256) {
//         require(assets[assetId].exists, "Asset not found");
//         return assets[assetId].nav;
//     }
// }