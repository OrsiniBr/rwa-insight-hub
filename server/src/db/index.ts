import { Sequelize } from "sequelize";

import BetterSQLite3 from "better-sqlite3";

export const db = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    dialectModule: BetterSQLite3,
});

export const initDB = async () => {
    try {
        await db.authenticate();
        console.log("Database connected!");
        await db.sync({ force: false });
        console.log("Tables synced!");
    } catch (error) {
        console.error("DB connection error:", error);
    }
};
