# 🏗️ Mantle RWA Infrastructure – NAV & Pool Registries

This repository contains the core on-chain registry contracts for a Real-World Asset (RWA) protocol being built on Mantle Network.

The goal of this project is to provide a clean, modular, and gas-efficient foundation for tracking asset values and organizing assets into multiple investment pools. These contracts are designed to act as infrastructure primitives that higher-level vaults, indexes, and strategies can build on top of.

---

## 🌍 Why Mantle?

Mantle offers low transaction costs, strong Ethereum compatibility, and a scalable execution environment, making it well-suited for RWA protocols that rely on frequent off-chain updates such as NAV recalculations and asset rebalancing.

This architecture follows an off-chain computation + on-chain verification model, where trusted backends or governance mechanisms update on-chain state.

---

## 🧠 High-Level Architecture

Backend / Oracle  
→ updates asset values and metadata  
→ writes to registries on Mantle  

On-chain registries  
- NAVRegistry (asset valuation)
- PoolRegistry (asset categorization)

Future layers  
- Vaults (ERC4626-style)
- Index products
- Governance
- Frontend dashboards

---

## 📦 Contracts Overview

### 1. NAVRegistry

NAVRegistry is responsible for tracking assets and their Net Asset Value (NAV).

Each asset is identified by a `bytes32 assetId` and stores basic metadata alongside its NAV. The NAV is expected to be updated by a trusted backend, oracle, or governance-controlled owner.

There is no pricing logic or math on-chain. This keeps gas costs low and avoids unnecessary complexity.

**Responsibilities**
- Register new assets
- Update asset NAVs
- Expose read-only NAV data to other contracts

**Typical Use Cases**
- Vault share price calculations
- Index and basket valuation
- Frontend display of asset values

**Key Functions**
- `addAsset(assetId, name, symbol)`
- `updateNav(assetId, newNav)`
- `getNav(assetId)`
- `isAsset(assetId)`

---

### 2. PoolRegistry

PoolRegistry tracks pools and the assets that belong to them.

A pool represents a logical grouping or strategy category (e.g. stable yield, real estate, growth). Assets can belong to multiple pools at the same time.

This contract does not perform any financial logic. It only manages relationships between pools and assets.

**Responsibilities**
- Create pools
- Assign assets to pools
- Allow querying of pool memberships

**Key Features**
- One asset can belong to many pools
- Pool → assets lookup
- Asset → pools lookup

**Key Functions**
- `createPool(poolId, name)`
- `addAssetToPool(poolId, assetId)`
- `getPoolAssets(poolId)`
- `getAssetPools(assetId)`

---

## 🔗 How the Contracts Work Together

NAVRegistry answers: “What is this asset worth?”

PoolRegistry answers: “Where does this asset belong?”

The contracts are intentionally decoupled. This makes the system easier to extend, audit, and upgrade. Vaults and strategies can consume both registries without them being tightly coupled.

---

## 🧩 What This Enables

These registries form the data layer for a larger RWA protocol. They are intended to be consumed by:

- Asset-backed vaults
- Index and basket products
- Yield strategies
- Governance systems
- Off-chain APIs and analytics dashboards

Future contracts can pull NAV data from NAVRegistry and asset groupings from PoolRegistry to compute TVL, exposure, share prices, and risk metrics.

---

## 🔐 Trust & Security Model

- Both contracts are Ownable
- The owner is expected to be a multisig, DAO, or trusted backend
- No user funds are held in these contracts
- Contracts are designed to be simple and auditable

---

## 🛠️ Tech Stack

- Solidity ^0.8.28
- OpenZeppelin Ownable
- Foundry
- Target network: Mantle

---

## 📄 License

MIT

---

## ✨ Design Philosophy

Simple registries first.  
Financial logic later.  
Composable by default.

This repository represents the foundational data layer of an RWA protocol on Mantle.
