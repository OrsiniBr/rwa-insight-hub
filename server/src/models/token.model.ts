import { DataTypes } from "sequelize";
import { db } from "../db";

const Token = db.define("Token", {
    coingeckoId: DataTypes.STRING,
    symbol: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    network: DataTypes.STRING,
});

export default Token;
