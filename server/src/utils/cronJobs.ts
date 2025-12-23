import cron, { ScheduledTask } from "node-cron";
import mantleService from "../services/mantle.service";
import logger from "../config/logger";

class MantleCron {
  private task: ScheduledTask | null = null;

  start() {
    if (this.task) return;
    this.task = cron.schedule("*/20 * * * *", async () => {
      try {
        logger.info("[MantleCron] Fetching top Mantle tokens...");
        const fetchedTokens = await mantleService.fetchTopMantleTokens();
        await mantleService.saveTokens(fetchedTokens);
        logger.info(`[MantleCron] Successfully saved ${fetchedTokens.length} Mantle tokens`);
      } catch (error: any) {
        logger.error("[MantleCron] Failed to fetch/save Mantle tokens", {
          error: error.message,
          stack: error.stack,
        });
      }
    });
    this.task.start();
    logger.info("[MantleCron] Cron job started: Every 20 minutes");
  }

  stop() {
    if (this.task) this.task.stop();
  }
}

export default new MantleCron();
