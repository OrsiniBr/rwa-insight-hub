import fetch from "node-fetch";
import Token from "../models/token.model";
import InsightHubException from "../exception";

class MantleService {
    async fetchMantleTokens(): Promise<any[]> {
        try {
            const response = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true");
            const tokens = (await response.json()) as any[];
            return tokens.filter((token) => token.platforms?.mantle);
        } catch (error) { 
            throw new InsightHubException(error instanceof Error ? error.message : String(error));
        }
    }

    async saveTokens(tokens: any[]): Promise<void> {
        for (const token of tokens) {
            await Token.upsert({
                coingeckoId: token.id,
                symbol: token.symbol,
                name: token.name,
                address: token.platforms.mantle,
                network: "mantle",
            });
        }
    }

    async getTokensFromDB(): Promise<any[]> {
        return Token.findAll({ where: { network: "mantle" } });
    }
}

export default new MantleService();
