import { Sequelize } from "sequelize";
import { Config } from "../config";


export const db = new Sequelize(Config.DB_NAME,Config.DB_USER,Config.DB_PASSWORD,{
    dialect: "postgres",    
    logging: false,
    host : Config.DB_HOST
});

export const initDB = async () => {
    try {
        await db.authenticate();
        console.log("Database connection established successfully!");
        await db.sync({ force: false });
        console.log("Tables synced!");
    } catch (error) {
        console.error("DB connection error:", error);
    }
};
