// import mongoose from "mongoose";

import {
  connectRabbitMq,
  getChannel,
  Queue,
} from "../config/rabbitmq.js";
import dotenv from 'dotenv'
dotenv.config()

import { connectDb } from "../config/db.js";

import Tracking from "../modules/Tracking/Tracking.model.js";

import parseUserAgent from "../utils/parseUserAgent.js";

import getLocation from "../utils/geoLocation.js";
import { normalizeIpFromString } from "../utils/clientIp.js";
import { connectRedis, getRedisClient } from "../config/redis.js";

const startWorker = async () => {
  try {

    await connectDb();
    await connectRabbitMq(process.env.RABBITMQ_URL);
    await connectRedis();

    const channel = getChannel();

    await channel.assertQueue(Queue);

    console.log("Tracking Worker Started");
    channel.consume(Queue,
      async (message) => {
        if (!message) return;
        try {
          const eventData = JSON.parse(message.content.toString());

          console.log("EVENT RECEIVED:",eventData.eventType);



          const userAgent = eventData.userAgent;


          const parsedData = userAgent
            ? parseUserAgent(userAgent)
            : {
                browser: "Unknown",
                os: "Unknown",
                device: "Unknown",
              };


          const ip =
            normalizeIpFromString(eventData.ip) || null;

          const locationData =
            getLocation(ip);


          const redis = getRedisClient();
          const ActiveVisitorKey = `site:${eventData.siteId}:active_visitors`;

          if(eventData.eventType === 'pageview')
          {
            await redis.sAdd(
              ActiveVisitorKey,
              eventData.visitorId
            )
            console.log("VISITOR ADDED TO ACTIVE SET");
          }

          if(eventData.eventType === 'page_exit')
          {
            await redis.sRem(
              ActiveVisitorKey,
              eventData.visitorId
            )
            console.log("VISITOR REMOVED FROm ACTIVE SET");
          }





          const savedEvent =
            await Tracking.create({

              ...eventData,

              browser:
                parsedData.browser,

              os: parsedData.os,

              device:
                parsedData.device,

              country:
                locationData.country,

              city:
                locationData.city,
            });

          console.log("EVENT SAVED:",savedEvent.eventType);



          channel.ack(message);

        } 
        catch (error) {

          console.log(error);
          channel.nack(message);
        }
      }
    );

  } catch (error) {

    console.log(error);
  }
};


startWorker()
