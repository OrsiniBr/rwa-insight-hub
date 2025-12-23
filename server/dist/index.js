"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const mantle_routes_1 = require("./routes/mantle.routes");
const config_1 = require("./config");
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./config/logger"));
const cronJobs_1 = __importDefault(require("./utils/cronJobs"));
dotenv_1.default.config({
    path: process.env.NODE_ENV === "development" ? ".env" : ".env.test",
    override: true,
    debug: false,
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1", mantle_routes_1.router);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Route ${req.method} ${req.path} not found`,
        timestamp: new Date().toISOString(),
    });
});
app.use(errorHandler_middleware_1.errorHandler);
async function bootstrap(app) {
    try {
        logger_1.default.info("Initializing LedgerFlow application...", {
            environment: config_1.Config.NODE_ENV,
            port: config_1.Config.PORT,
        });
        await (0, db_1.initDB)();
        app.listen(config_1.Config.PORT, () => {
            logger_1.default.info(`Server started successfully`, {
                port: config_1.Config.PORT,
                environment: config_1.Config.NODE_ENV,
                url: `http://localhost:${config_1.Config.PORT}`,
            });
        });
        cronJobs_1.default.start();
    }
    catch (error) {
        logger_1.default.error("Failed to start application", {
            error: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
}
bootstrap(app);
//# sourceMappingURL=index.js.map