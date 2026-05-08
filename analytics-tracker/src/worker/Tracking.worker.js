import mongoose from "mongoose";

import {
  connectRabbitMq,
  getChannel,
  Queue,
} from "../config/rabbitmq.js";

import { connectDb } from "../config/db.js";

import Tracking from "../modules/Tracking/Tracking.model.js";

import parseUserAgent from "../utils/parseUserAgent.js";

import getLocation from "../utils/geoLocation.js";

const startWorker = async () => {

  try {

    /*
      CONNECT DATABASE
    */

    await connectDb();

    /*
      CONNECT RABBITMQ
    */
   

    await connectRabbitMq('amqp://sameer:sameer_2005@localhost:5672');

    /*
      GET CHANNEL
    */

    const channel = getChannel();

    /*
      ENSURE QUEUE EXISTS
    */

    await channel.assertQueue(Queue);

    console.log(
      "Tracking Worker Started"
    );

    /*
      CONSUME QUEUE
    */

    channel.consume(
      Queue,

      async (message) => {

        if (!message) return;

        try {

          /*
            PARSE MESSAGE
          */

          const eventData = JSON.parse(
            message.content.toString()
          );

          console.log(
            "EVENT RECEIVED:",
            eventData.eventType
          );

          /*
            USER AGENT
          */

          const userAgent =
            eventData.userAgent;

          /*
            PARSE BROWSER INFO
          */

          const parsedData = userAgent
            ? parseUserAgent(userAgent)
            : {
                browser: "Unknown",
                os: "Unknown",
                device: "Unknown",
              };

          /*
            GEO LOOKUP
          */

          const ip =
            eventData.ip || "::1";

          const locationData =
            getLocation(ip);

          /*
            STORE EVENT
          */

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

          console.log(
            "EVENT SAVED:",
            savedEvent.eventType
          );

          /*
            ACKNOWLEDGE MESSAGE
          */

          channel.ack(message);

        } catch (error) {

          console.log(error);

          /*
            REJECT MESSAGE
          */

          channel.nack(message);
        }
      }
    );

  } catch (error) {

    console.log(error);
  }
};

startWorker()
