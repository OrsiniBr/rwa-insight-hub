import { Router } from "express";
import { getMantleTokens } from "../controllers/mantle.controller";

const router = Router();

router.get("/mantle/tokens", getMantleTokens);

export default router;
