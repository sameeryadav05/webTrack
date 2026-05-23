import express from "express";
import dotenv from 'dotenv'
dotenv.config();
import morgan from 'morgan'
import {connectDb} from './src/config/db.js'
import trackingRoutes from "./src/modules/Tracking/Tracking.routes.js";
import cors from 'cors'
import SiteRouter from "./src/modules/Sites/site.routes.js";
import { connectRabbitMq } from "./src/config/rabbitmq.js";
import { connectRedis } from "./src/config/redis.js";
import AnalyticsRouter from "./src/modules/Analytics/Analyrics.routes.js";
import AuthRouter from "./src/modules/Auth/auth.routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.text({ type: "text/plain" }));
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(
  cors({
    origin: "https://web-track-client.vercel.app",
    methods: ["GET", "POST","PUT","PATCH","DELETE"],
    credentials:true
  })
);

app.use("/track", trackingRoutes); // tracking routes
app.use('/site',SiteRouter) // site routes
app.use('/analytics',AnalyticsRouter);
app.use('/auth',AuthRouter)

const PORT = process.env.PORT || 8080;

connectDb().then(async ()=>{
    await connectRabbitMq(process.env.RABBITMQ_URL);
    await connectRedis();
    app.listen(PORT, () => {console.log(`server is running on http://localhost:${PORT}`)})
})


