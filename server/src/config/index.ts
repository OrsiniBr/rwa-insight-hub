import dotenv from "dotenv";

dotenv.config();
export const Config = {
  DB_NAME: process.env.DA_NAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_USER: process.env.DB_USER!,
  PORT: Number(process.env.PORT!),
  NODE_ENV: process.env.NODE_ENV,
};
