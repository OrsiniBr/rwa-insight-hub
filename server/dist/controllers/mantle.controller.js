"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMantleTokens = void 0;
const mantle_service_1 = __importDefault(require("../services/mantle.service"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const getMantleTokens = async (_req, res) => {
    try {
        let tokens = await mantle_service_1.default.getTokensFromDB();
        if (!tokens.length) {
            const fetchedTokens = await mantle_service_1.default.fetchTopMantleTokens();
            await mantle_service_1.default.saveTokens(fetchedTokens);
            tokens = await mantle_service_1.default.getTokensFromDB();
        }
        return apiResponse_1.default.success(res, tokens, 200);
    }
    catch (error) {
        return apiResponse_1.default.error(res, 400, error, error instanceof Error ? error.message : "Something went wrong");
    }
};
exports.getMantleTokens = getMantleTokens;
//# sourceMappingURL=mantle.controller.js.map