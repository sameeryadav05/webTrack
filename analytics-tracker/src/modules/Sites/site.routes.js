import express from "express";
import { createSite } from "./site.controller.js";


const SiteRouter = express.Router();

SiteRouter.post("/", createSite);

export default SiteRouter;