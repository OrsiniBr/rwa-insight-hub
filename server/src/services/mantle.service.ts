import Token from "../models/token.model";
import InsightHubException from "../exception";

const BASE_URL = "https://explorer.mantle.xyz/api/v2/tokens";

class MantleService {
  async fetchTopMantleTokens(): Promise<any[]> {
    try {
      const allTokens: any[] = [];
      let params = "";

      for (let i = 0; i < 3; i++) {
        const res = await fetch(`${BASE_URL}${params}`);
        const data = await res.json();

        allTokens.push(...data.items);

        if (!data.next_page_params) break;

        const p = data.next_page_params;
        params = `?contract_address_hash=${p.contract_address_hash}&items_count=${p.items_count}`;
      }

      const filtered = allTokens
        .filter(
          (t) =>
            t.type === "ERC-20" &&
            t.exchange_rate !== null &&
            t.circulating_market_cap !== null
        )
        .sort(
          (a, b) =>
            Number(b.circulating_market_cap) -
            Number(a.circulating_market_cap)
        )
        .slice(0, 100);

      return filtered;
    } catch (error) {
      throw new InsightHubException(
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  async saveTokens(tokens: any[]): Promise<void> {
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

    await Token.bulkCreate(records, {
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

  async getTokensFromDB(): Promise<any[]> {
    return Token.findAll({
      where: { network: "mantle" },
      order: [["circulatingMarketCap", "DESC"]],
      limit: 100,
    });
  }
}

export default new MantleService();
