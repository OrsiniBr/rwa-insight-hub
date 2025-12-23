import mantleService from "../services/mantle.service";
import ApiResponse from "../utils/apiResponse";

export const getMantleTokens = async (_req, res) => {
    try {
        let tokens = await mantleService.getTokensFromDB();
        if (!tokens.length) {
            const fetchedTokens = await mantleService.fetchMantleTokens();
            await mantleService.saveTokens(fetchedTokens);
            tokens = await mantleService.getTokensFromDB();
        }
        return ApiResponse.success(res,tokens,200);
    } catch (error) {
        return ApiResponse.error(res,400,error,error instanceof Error? error.message: "Something went wrong");
    }
};
