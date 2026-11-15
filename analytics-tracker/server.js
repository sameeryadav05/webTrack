
import "dotenv/config";

import express from "express";
import morgan from "morgan";
import cors from "cors";

import { connectDb } from "./src/config/db.js";
import { connectRabbitMq } from "./src/config/rabbitmq.js";
import { connectRedis } from "./src/config/redis.js";

import { startTrackingConsumer } from "./src/worker/Tracking.worker.js";

import trackingRoutes from "./src/modules/Tracking/Tracking.routes.js";
import SiteRouter from "./src/modules/Sites/site.routes.js";
import AnalyticsRouter from "./src/modules/Analytics/Analyrics.routes.js";
import AuthRouter from "./src/modules/Auth/auth.routes.js";


const app = express();


// Middleware
app.use(express.json());

app.use(express.text({
    type: "text/plain"
}));

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan("dev"));

app.use(express.static("public"));

app.use(cors({
    origin: "*"
}));


// Routes
app.use("/track", trackingRoutes);

app.use("/site", SiteRouter);

app.use("/analytics", AnalyticsRouter);

app.use("/auth", AuthRouter);


// Health check
app.get("/check", (req, res) => {

    res.status(200).json({

        success: true,

        message: "WebTrack Server Running"

    });

});


// Server configuration
const PORT = process.env.PORT || 5000;


// Start application
const startServer = async () => {

    try {

        console.log("[Server] Starting WebTrack...");


        // 1. Connect MongoDB
        await connectDb();


        // 2. Connect RabbitMQ
        await connectRabbitMq(
            process.env.RABBITMQ_URL
        );


        // 3. Connect Redis
        await connectRedis();


        // 4. Start RabbitMQ consumer
        await startTrackingConsumer();


        // 5. Start Express server
        const server = app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log(
                    `[Server] Running on port ${PORT}`
                );

                console.log(
                    "[Server] API and Worker started successfully"
                );

            }
        );


        // Handle server errors
        server.on("error", (error) => {

            console.error(
                "[Server] HTTP server error:",
                error
            );

            process.exit(1);

        });


    } catch (error) {

        console.error(
            "[Server] Startup failed:",
            error
        );

        process.exit(1);

    }

};


startServer();
