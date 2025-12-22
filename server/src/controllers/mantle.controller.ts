import mantleService from "../services/mantle.service";

export const getMantleTokens = async (req, res) => {
    try {
        let tokens = await mantleService.getTokensFromDB();

        if (!tokens.length) {
            const fetchedTokens = await mantleService.fetchMantleTokens();
            await mantleService.saveTokens(fetchedTokens);
            tokens = await mantleService.getTokensFromDB();
        }

        res.json(tokens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
