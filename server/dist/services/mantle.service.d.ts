import { TokenItem } from "../types";
declare class MantleService {
    fetchTopMantleTokens(): Promise<TokenItem[]>;
    saveTokens(tokens: any[]): Promise<void>;
    getTokensFromDB(): Promise<any[]>;
}
declare const _default: MantleService;
export default _default;
//# sourceMappingURL=mantle.service.d.ts.map