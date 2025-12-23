import dotenv from "dotenv";

dotenv.config();
export const Config = {
  DB_NAME: process.env.DB_NAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_USER: process.env.DB_USER!,
  PORT: Number(process.env.PORT!),
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST,
};
