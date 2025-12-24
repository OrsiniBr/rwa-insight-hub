import mantleService from "../services/mantle.service";
import ApiResponse from "../utils/apiResponse";
import { Request, Response } from "express";

export const getMantleTokens = async (_req: Request, res: Response) => {
    try {
        let tokens = await mantleService.getTokensFromDB();
        if (!tokens.length) {
            const fetchedTokens = await mantleService.fetchTopMantleTokens();
            await mantleService.saveTokens(fetchedTokens);
            tokens = await mantleService.getTokensFromDB();
        }
        return ApiResponse.success(res,tokens,200);
    } catch (error) {
        return ApiResponse.error(res,400,error,error instanceof Error? error.message: "Something went wrong");
    }
};
