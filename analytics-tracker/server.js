import express from "express";
import dotenv from 'dotenv'
dotenv.config();
import morgan from 'morgan'
import {connectDb} from './src/config/db.js'
import trackingRoutes from "./src/modules/Tracking/Tracking.routes.js";
import cors from 'cors'
import SiteRouter from "./src/modules/Sites/site.routes.js";

const app = express();

app.use(express.json());
app.use(express.text({ type: "text/plain" }));
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/track", trackingRoutes); // tracking routes
app.use('/sites',SiteRouter) // site routes

const PORT = process.env.PORT || 8080

connectDb().then(()=>{
    app.listen(PORT, () => {console.log(`server is running on http://localhost:${PORT}`)})
})


