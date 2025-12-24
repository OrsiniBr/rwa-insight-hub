import express, { Application } from "express";
import { initDB } from "./db";
import { router } from "./routes/mantle.routes";
import { Config } from "./config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import dotenv from "dotenv";
import logger from "./config/logger";
import mantleCron from "./utils/cronJobs";
import cors from "cors";

dotenv.config({
  path: process.env.NODE_ENV === "development" ? ".env" : ".env.test",
  override: true,
  debug: false,
});

const app = express();

app.use(
	cors({
		origin: [process.env.FRONTEND_URL??"http://localhost:3000","http://localhost:8080"],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true
	})
);
app.use(express.json());
app.use("/api/v1", router);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

async function bootstrap(app: Application): Promise<void> {
  try { 
    logger.info("Initializing LedgerFlow application...", {
      environment: Config.NODE_ENV,
      port: Config.PORT,
    });
    await initDB();
     
    app.listen(Config.PORT, () => {
      logger.info(`Server started successfully`, {
        port: Config.PORT,
        environment: Config.NODE_ENV,
        url: `http://localhost:${Config.PORT}`,
      });
    });
      
    mantleCron.start();  
  } catch (error: any) {
    logger.error("Failed to start application", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

bootstrap(app);
