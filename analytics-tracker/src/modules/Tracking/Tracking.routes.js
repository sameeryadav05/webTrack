import express from "express";
import { trackEvent } from "./Tracking.controller.js";

const router = express.Router();

router.post("/", trackEvent);

export default router;