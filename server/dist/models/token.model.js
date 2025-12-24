"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class Token extends sequelize_1.Model {
}
Token.init({
    address: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    symbol: sequelize_1.DataTypes.STRING,
    name: sequelize_1.DataTypes.STRING,
    decimals: sequelize_1.DataTypes.INTEGER,
    priceUsd: {
        type: sequelize_1.DataTypes.DECIMAL(20, 8),
        allowNull: true,
    },
    circulatingMarketCap: {
        type: sequelize_1.DataTypes.DECIMAL(30, 8),
        allowNull: true,
    },
    totalSupply: {
        type: sequelize_1.DataTypes.DECIMAL(40, 0),
        allowNull: true,
    },
    holders: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    iconUrl: sequelize_1.DataTypes.STRING,
    type: sequelize_1.DataTypes.STRING,
    network: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "mantle",
    },
}, {
    sequelize: db_1.db,
    tableName: "tokens",
    timestamps: true,
});
exports.default = Token;
//# sourceMappingURL=token.model.js.map