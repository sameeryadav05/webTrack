import express from "express";
import dotenv from 'dotenv'
dotenv.config();
import morgan from 'morgan'
import {connectDb} from './src/config/db.js'
import trackingRoutes from "./src/modules/Tracking/Tracking.routes.js";
import cors from 'cors'
import SiteRouter from "./src/modules/Sites/site.routes.js";
import { connectRabbitMq } from "./src/config/rabbitmq.js";
import AnalyticsRouter from "./src/modules/Analytics/Analyrics.routes.js";

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
app.use('/site',SiteRouter) // site routes
app.use('/analytics',AnalyticsRouter);

const PORT = process.env.PORT || 8080;



connectDb().then(async ()=>{
    await connectRabbitMq('amqp://sameer:sameer_2005@localhost:5672');
    app.listen(PORT, () => {console.log(`server is running on http://localhost:${PORT}`)})
})


