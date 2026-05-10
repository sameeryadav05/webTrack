import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { createSite ,getMySites} from "./site.controller.js";


const SiteRouter = express.Router();

SiteRouter.post("/",authMiddleware,createSite);

SiteRouter.get("/my-sites",authMiddleware,getMySites);

export default SiteRouter;