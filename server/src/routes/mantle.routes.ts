import { Router } from "express";
import { getMantleTokens } from "../controllers/mantle.controller";

export const router: Router = Router();

router.get("/mantle/tokens", getMantleTokens);

