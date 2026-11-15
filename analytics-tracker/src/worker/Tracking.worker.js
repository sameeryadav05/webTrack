
import {
    getChannel,
    Queue
} from "../config/rabbitmq.js";

import {
    getRedisClient
} from "../config/redis.js";

import Tracking from "../modules/Tracking/Tracking.model.js";

import parseUserAgent from "../utils/parseUserAgent.js";

import getLocation from "../utils/geoLocation.js";

import { normalizeIpFromString } from "../utils/clientIp.js";


export const startTrackingConsumer = async () => {

    const channel = getChannel();

    await channel.assertQueue(Queue);

    await channel.prefetch(10);

    console.log("[Worker] Tracking consumer started");
    console.log(`[Worker] Waiting for messages in ${Queue}`);

    await channel.consume(
        Queue,

        async (message) => {

            if (!message) return;

            try {

                const eventData = JSON.parse(
                    message.content.toString()
                );

                console.log(
                    "[Worker] Event received:",
                    eventData.eventType
                );

                const userAgent = eventData.userAgent;

                const parsedData = userAgent
                    ? parseUserAgent(userAgent)
                    : {
                        browser: "Unknown",
                        os: "Unknown",
                        device: "Unknown"
                    };

                const ip =
                    normalizeIpFromString(eventData.ip) || null;

                const locationData = getLocation(ip);

                const redis = getRedisClient();

                const activeVisitorKey =
                    `site:${eventData.siteId}:active_visitors`;

                if (eventData.eventType === "pageview") {

                    await redis.sAdd(
                        activeVisitorKey,
                        eventData.visitorId
                    );

                }

                if (eventData.eventType === "page_exit") {

                    await redis.sRem(
                        activeVisitorKey,
                        eventData.visitorId
                    );

                }

                const savedEvent = await Tracking.create({

                    ...eventData,

                    browser: parsedData.browser,

                    os: parsedData.os,

                    device: parsedData.device,

                    country: locationData.country,

                    city: locationData.city

                });

                console.log(
                    "[Worker] Event saved:",
                    savedEvent.eventType
                );

                channel.ack(message);

            } catch (error) {

                console.error(
                    "[Worker] Event processing failed:",
                    error
                );

                channel.nack(message, false, true);

            }

        },

        {
            noAck: false
        }

    );

};
