import express from "express";
import { trackEvent } from "./Tracking.controller.js";
import validateSite from "../../middlewares/validateSite.middleware.js";

const router = express.Router();

router.post("/",validateSite,trackEvent);

export default router;