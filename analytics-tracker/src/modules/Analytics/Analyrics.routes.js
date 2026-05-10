import express from "express";
import {
  getOverview,
  getActiveVisitors,
  getBrowsers,
  getCountries,
  getTopPages,
} from "./Analytics.controller.js";

import authMiddleware
from "../../middlewares/auth.middleware.js"

import siteAccessMiddleware
from "../../middlewares/siteAccess.middleware.js";

const AnalyticsRouter =
  express.Router();


AnalyticsRouter.get("/overview/:siteId",authMiddleware,siteAccessMiddleware,getOverview);

AnalyticsRouter.get("/active-visitors/:siteId",authMiddleware,siteAccessMiddleware,getActiveVisitors);

AnalyticsRouter.get("/browsers/:siteId",authMiddleware,siteAccessMiddleware,getBrowsers);

AnalyticsRouter.get("/countries/:siteId",authMiddleware,siteAccessMiddleware,getCountries);

AnalyticsRouter.get("/pages/:siteId",authMiddleware,siteAccessMiddleware,getTopPages);

export default AnalyticsRouter;