import { DataTypes, Model } from "sequelize";
import { db } from "../db";

class Token extends Model {}

Token.init(
  {
    address: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    symbol: DataTypes.STRING,
    name: DataTypes.STRING,
    decimals: DataTypes.INTEGER,

    priceUsd: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: true,
    },

    circulatingMarketCap: {
      type: DataTypes.DECIMAL(30, 8),
      allowNull: true,
    },

    totalSupply: {
      type: DataTypes.DECIMAL(40, 0),
      allowNull: true,
    },

    holders: {
      type: DataTypes.INTEGER,
    },

    iconUrl: DataTypes.STRING,

    type: DataTypes.STRING,

    network: {
      type: DataTypes.STRING,
      defaultValue: "mantle",
    },
  },
  {
    sequelize: db,
    tableName: "tokens",
    timestamps: true,
  }
);

export default Token;

