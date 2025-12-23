# RWA Insight Hub - Server

A robust Node.js/Express backend API for the RWA (Real World Assets) Insight Hub platform. This server manages blockchain data aggregation, token information from the Mantle network, and provides RESTful endpoints for the client application.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Scheduled Jobs](#scheduled-jobs)
- [Middleware & Error Handling](#middleware--error-handling)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

The RWA Insight Hub Server is a backend service that:

- **Aggregates Token Data**: Fetches real-time token information from the Mantle blockchain network via the Mantle Explorer API
- **Manages Data Persistence**: Stores token data in a PostgreSQL database
- **Provides REST API**: Exposes endpoints to retrieve token information and insights
- **Runs Scheduled Tasks**: Automatically updates token data every 20 minutes via cron jobs
- **Handles Errors**: Implements comprehensive error handling and logging
- **Supports Real-time Updates**: Manages data synchronization for the client application

## 🛠 Tech Stack

### Core Framework
- **Express.js** (^5.2.1) - Web framework for Node.js
- **TypeScript** (^5.9.3) - JavaScript with static typing

### Database & ORM
- **PostgreSQL** - Primary relational database
- **Sequelize** (^6.37.7) - ORM for database operations
- **TypeORM** (^0.3.28) - Optional TypeORM support
- **better-sqlite3** (^12.5.0) - Lightweight database for local development

### Utilities
- **Winston** (^3.19.0) - Logging library
- **node-cron** - Scheduled task execution
- **Zod** (^4.2.1) - Schema validation
- **node-fetch** (^3.3.2) - HTTP client for API calls
- **jsonwebtoken** (^9.0.3) - JWT authentication support
- **express-rate-limit** (^8.2.1) - Rate limiting middleware
- **CORS** (^2.8.5) - Cross-Origin Resource Sharing

### Development Tools
- **Nodemon** (^3.1.11) - Auto-reload during development
- **ts-node** (^10.9.2) - TypeScript execution for Node.js

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v8 or higher) - Package manager - [Install](https://pnpm.io/installation)
- **PostgreSQL** (v12 or higher) - Database - [Download](https://www.postgresql.org/download/)

Verify installations:
```bash
node --version
pnpm --version
psql --version
```

## 🚀 Installation

### 1. Navigate to Server Directory
```bash
cd server
```

### 2. Install Dependencies
```bash
pnpm install
```

This will install all required packages listed in `package.json`.

### 3. Verify Installation
Check the `node_modules` folder is created and all dependencies are installed:
```bash
pnpm list
```

## ⚙️ Environment Configuration

### Create Environment Files

Create a `.env` file in the `server` directory for development:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rwa_insight_hub_dev
DB_USER=postgres
DB_PASSWORD=your_password_here

# Server Configuration
PORT=3000
NODE_ENV=development


```


### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL server host | `localhost` |
| `DB_PORT` | PostgreSQL server port | `5432` |
| `DB_NAME` | Database name | `rwa_insight_hub_dev` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment type | `development` or `test` |

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── index.ts           # Configuration management
│   │   └── logger.ts          # Winston logger setup
│   ├── controllers/
│   │   └── mantle.controller.ts # Route handlers for Mantle endpoints
│   ├── db/
│   │   └── index.ts           # Database initialization & connection
│   ├── models/
│   │   └── token.model.ts     # Token data model (Sequelize)
│   ├── services/
│   │   └── mantle.service.ts  # Business logic for token operations
│   ├── routes/
│   │   └── mantle.routes.ts   # API route definitions
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces & types
│   ├── middlewares/
│   │   └── errorHandler.middleware.ts # Global error handling
│   ├── utils/
│   │   ├── cronJobs.ts        # Scheduled cron jobs
│   │   ├── apiResponse.ts     # Standard API response format
│   │   └── index.ts           # Utility functions
│   ├── exception/
│   │   └── index.ts           # Custom exception classes
│   └── index.ts               # Application entry point
├── package.json
├── tsconfig.json
└── README.md
```

### Key Folders Explained

**config/** - Centralized configuration management
- Loads environment variables
- Provides Config object used throughout the app

**controllers/** - Request handlers
- Processes HTTP requests
- Calls service layer for business logic
- Returns API responses

**services/** - Business logic layer
- Fetches data from Mantle Explorer API
- Saves/retrieves data from database
- Implements core application logic

**models/** - Database models
- Defines data structure using Sequelize ORM
- Manages database table schema

**routes/** - API routing
- Defines endpoint paths and HTTP methods
- Maps routes to controller functions

**middlewares/** - Express middleware
- Error handling
- Request validation
- CORS and rate limiting

**utils/** - Helper utilities
- Cron job scheduling
- API response formatting
- General utility functions

## Running the Server

### Development Mode

Start the server with hot-reload enabled:

```bash
pnpm dev
```

Expected output:
```
[INFO] Initializing LedgerFlow application...
[INFO] Server started successfully
[INFO] Database connection established successfully!
[INFO] [MantleCron] Cron job started: Every 20 minutes
Server listening on http://localhost:3000
```

### Production Mode

Build and run the compiled JavaScript:

```bash
# Build TypeScript to JavaScript
pnpm build

# Start the compiled server
pnpm start
```

### Verify Server is Running

Test the server with a simple request:

```bash
curl http://localhost:3000/api/v1/mantle/tokens
```

## 🔌 API Endpoints

### Get Mantle Tokens

Retrieves the top 100 ERC-20 tokens from the Mantle network, sorted by market cap.

**Endpoint:**
```
GET /api/v1/mantle/tokens
```

**Response (200 OK):**
```json
[
  {
    "address": "0x1234567890abcdef...",
    "symbol": "MNT",
    "name": "Mantle",
    "decimals": 18,
    "priceUsd": 0.75,
    "circulatingMarketCap": "750000000",
    "totalSupply": "1000000000",
    "holders": 5000,
    "iconUrl": "https://...",
    "type": "ERC-20",
    "network": "mantle",
    "createdAt": "2025-12-23T10:00:00Z",
    "updatedAt": "2025-12-23T10:20:00Z"
  }
]
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Route GET /api/v1/invalid-route not found",
  "timestamp": "2025-12-23T10:00:00.000Z"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/mantle/tokens
```

**JavaScript Fetch Example:**
```javascript
fetch('http://localhost:3000/api/v1/mantle/tokens')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

## 💾 Database

### Database Setup

#### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql shell, create database
CREATE DATABASE rwa_insight_hub_dev;
CREATE DATABASE rwa_insight_hub_test;

# Exit psql
\q
```

#### 2. Verify Connection

Test the connection string:
```bash
psql -U postgres -h localhost -d rwa_insight_hub_dev
```

#### 3. Automatic Schema Creation

Sequelize will automatically create tables on first run. Check the database:

```bash
psql -U postgres -d rwa_insight_hub_dev -c "\dt"
```

You should see a `tokens` table created.

### Database Schema

**Tokens Table:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `address` | VARCHAR | PRIMARY KEY | Token smart contract address |
| `symbol` | VARCHAR | - | Token symbol (e.g., MNT) |
| `name` | VARCHAR | - | Token full name |
| `decimals` | INTEGER | - | Token decimal places |
| `priceUsd` | DECIMAL(20,8) | NULLABLE | Current USD price |
| `circulatingMarketCap` | DECIMAL(30,8) | NULLABLE | Market cap in USD |
| `totalSupply` | DECIMAL(40,0) | NULLABLE | Total token supply |
| `holders` | INTEGER | - | Number of token holders |
| `iconUrl` | VARCHAR | - | Token icon/logo URL |
| `type` | VARCHAR | - | Token type (ERC-20, etc.) |
| `network` | VARCHAR | DEFAULT: "mantle" | Blockchain network |
| `createdAt` | TIMESTAMP | - | Record creation timestamp |
| `updatedAt` | TIMESTAMP | - | Last update timestamp |

## ⏰ Scheduled Jobs

### Mantle Token Sync Cron Job

The server runs an automated cron job that fetches and updates Mantle tokens every **20 minutes**.

**Schedule:** `*/20 * * * *` (Every 20 minutes)

**What it does:**
1. Fetches top 100 tokens from Mantle Explorer API
2. Filters for ERC-20 tokens with price data
3. Sorts by market capitalization (highest first)
4. Saves/updates tokens in the database

**Logs:**
The cron job logs its execution to the console:
```
[INFO] [MantleCron] Fetching top Mantle tokens...
[INFO] [MantleCron] Successfully saved 100 Mantle tokens
```

**Start/Stop:**
- Cron job starts automatically when the server boots
- Runs throughout the application lifetime
- Stops when the server is shut down

**Manual Data Fetch:**
To trigger a manual fetch, call the API endpoint:
```bash
curl http://localhost:3000/api/v1/mantle/tokens
```

## 🔧 Middleware & Error Handling

### Global Middlewares

1. **Express JSON Parser**
   - Parses incoming JSON requests
   - Limit: Default (100kb)

2. **CORS Middleware**
   - Enables cross-origin requests
   - Allows requests from the client application

3. **Rate Limiter**
   - Prevents API abuse
   - Configurable per endpoint

4. **Error Handler**
   - Catches all errors globally
   - Returns standardized error responses
   - Logs errors with Winston

### Error Response Format

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "timestamp": "2025-12-23T10:00:00.000Z",
  "error": {
    "message": "Database connection failed",
    "stack": "..."
  }
}
```

### Common Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad Request | Invalid query parameters |
| 404 | Not Found | Route or resource doesn't exist |
| 500 | Internal Server Error | Database or server error |
| 503 | Service Unavailable | Mantle API unreachable |

## 🛠 Development

### Useful Commands

**Format Code (if ESLint configured):**
```bash
pnpm lint
```

**Run Type Checking:**
```bash
npx tsc --noEmit
```

**Clean Build:**
```bash
rm -rf dist
pnpm build
```

**Check Dependencies:**
```bash
pnpm list --depth=0
```

### Code Organization Best Practices

1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Implement business logic
3. **Models** - Define data structures
4. **Routes** - Define API endpoints
5. **Middleware** - Handle cross-cutting concerns
6. **Utils** - Reusable helper functions

### Adding New Endpoints

**Step 1:** Create a controller function in `controllers/`
```typescript
export const getMyData = async (req: Request, res: Response) => {
  // Logic here
};
```

**Step 2:** Add route in `routes/mantle.routes.ts`
```typescript
router.get("/my-data", getMyData);
```

**Step 3:** Test the endpoint
```bash
curl http://localhost:3000/api/v1/my-data
```

## 🐛 Troubleshooting

### Issue: "Database connection error"

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   psql -U postgres -c "SELECT version();"
   ```
2. Check `.env` credentials match your PostgreSQL setup
3. Ensure database exists:
   ```bash
   psql -U postgres -l | grep rwa_insight_hub
   ```

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
# Clear and reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Linux/Mac - Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or change the PORT in `.env` to a different port (e.g., 3001)

### Issue: TypeScript compilation errors

**Solution:**
```bash
# Check TypeScript version
npx tsc --version

# Rebuild
rm -rf dist
pnpm build
```

### Issue: Cron job not running

**Check logs:**
```bash
# Restart server and watch logs
pnpm dev
```

Expected output:
```
[MantleCron] Cron job started: Every 20 minutes
```

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mantle Network](https://mantle.xyz/)
- [Mantle Explorer API](https://explorer.mantle.xyz/)

## 📝 License

ISC

---

**Last Updated:** December 23, 2025

For issues or questions, please check the troubleshooting section or refer to the main project documentation.
