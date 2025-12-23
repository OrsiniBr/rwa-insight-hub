"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_model_1 = __importDefault(require("../models/token.model"));
const BASE_URL = "https://explorer.mantle.xyz/api/v2/tokens";
class MantleService {
    async fetchTopMantleTokens() {
        try {
            const allTokens = [];
            let params = "";
            let pageCount = 0;
            while (pageCount < 3) {
                const res = await fetch(`${BASE_URL}${params}`);
                const data = (await res.json());
                allTokens.push(...data.items);
                if (!data.next_page_params)
                    break;
                const p = data.next_page_params;
                params = `?contract_address_hash=${p.contract_address_hash}&items_count=${p.items_count}`;
                pageCount++;
            }
            const filtered = allTokens
                .filter((t) => t.type === "ERC-20" &&
                t.exchange_rate !== null &&
                t.circulating_market_cap !== null)
                .sort((a, b) => Number(b.circulating_market_cap) - Number(a.circulating_market_cap))
                .slice(0, 100);
            return filtered;
        }
        catch (error) {
            console.error("Failed to fetch top Mantle tokens:", error);
            return [];
        }
    }
    async saveTokens(tokens) {
        const records = tokens.map((t) => ({
            address: t.address,
            symbol: t.symbol,
            name: t.name,
            decimals: Number(t.decimals),
            priceUsd: Number(t.exchange_rate),
            circulatingMarketCap: Number(t.circulating_market_cap),
            totalSupply: t.total_supply,
            holders: Number(t.holders),
            iconUrl: t.icon_url,
            type: t.type,
            network: "mantle",
        }));
        await token_model_1.default.bulkCreate(records, {
            updateOnDuplicate: [
                "symbol",
                "name",
                "priceUsd",
                "circulatingMarketCap",
                "holders",
                "iconUrl",
                "totalSupply"
            ],
        });
    }
    async getTokensFromDB() {
        return token_model_1.default.findAll({
            where: { network: "mantle" },
            order: [["circulatingMarketCap", "DESC"]],
            limit: 100,
        });
    }
}
exports.default = new MantleService();
//# sourceMappingURL=mantle.service.js.map