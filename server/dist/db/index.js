"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = exports.db = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
exports.db = new sequelize_1.Sequelize(config_1.Config.DB_NAME, config_1.Config.DB_USER, config_1.Config.DB_PASSWORD, {
    dialect: "postgres",
    logging: false,
    host: config_1.Config.DB_HOST
});
const initDB = async () => {
    try {
        await exports.db.authenticate();
        console.log("Database connection established successfully!");
        await exports.db.sync({ force: false });
        console.log("Tables synced!");
    }
    catch (error) {
        console.error("DB connection error:", error);
    }
};
exports.initDB = initDB;
//# sourceMappingURL=index.js.map