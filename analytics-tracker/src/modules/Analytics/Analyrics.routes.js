import express from "express";
import {
  getOverview,
  getActiveVisitors,
  getBrowsers,
  getCountries,
  getTopPages,
} from "./Analytics.controller.js";

const AnalyticsRouter =
  express.Router();


AnalyticsRouter.get("/overview/:siteId",getOverview);

AnalyticsRouter.get("/active-visitors/:siteId",getActiveVisitors);

AnalyticsRouter.get("/browsers/:siteId",getBrowsers);

AnalyticsRouter.get("/countries/:siteId",getCountries);

AnalyticsRouter.get("/pages/:siteId",getTopPages);

export default AnalyticsRouter;