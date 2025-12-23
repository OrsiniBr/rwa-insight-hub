"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const mantle_service_1 = __importDefault(require("../services/mantle.service"));
const logger_1 = __importDefault(require("../config/logger"));
class MantleCron {
    constructor() {
        this.task = null;
    }
    start() {
        if (this.task)
            return;
        this.task = node_cron_1.default.schedule("*/20 * * * *", async () => {
            try {
                logger_1.default.info("[MantleCron] Fetching top Mantle tokens...");
                const fetchedTokens = await mantle_service_1.default.fetchTopMantleTokens();
                await mantle_service_1.default.saveTokens(fetchedTokens);
                logger_1.default.info(`[MantleCron] Successfully saved ${fetchedTokens.length} Mantle tokens`);
            }
            catch (error) {
                logger_1.default.error("[MantleCron] Failed to fetch/save Mantle tokens", {
                    error: error.message,
                    stack: error.stack,
                });
            }
        });
        this.task.start();
        logger_1.default.info("[MantleCron] Cron job started: Every 20 minutes");
    }
    stop() {
        if (this.task)
            this.task.stop();
    }
}
exports.default = new MantleCron();
//# sourceMappingURL=cronJobs.js.map