import { Router } from "express";
import { getMantleTokens } from "../controllers/mantle.controller";

export const router = Router();

router.get("/mantle/tokens", getMantleTokens);

