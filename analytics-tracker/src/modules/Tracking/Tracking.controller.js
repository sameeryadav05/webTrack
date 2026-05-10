// import { getChannel, Queue } from "../../config/rabbitmq.js";
// import getLocation from "../../utils/geoLocation.js";
// import parseUserAgent from "../../utils/parseUserAgent.js";

// import Tracking from "./Tracking.model.js";

// export const trackEvent = async (req, res) => {
//   try {

//     const { userAgent } = req.body;

//     const parsedData = userAgent
//       ? parseUserAgent(userAgent)
//       : {
//           browser: "Unknown",
//           os: "Unknown",
//           device: "Unknown",
//         };



//     const ip =
//       req.headers["x-forwarded-for"] ||
//       req.socket.remoteAddress;



//     const locationData = getLocation(ip);

//     const channel = getChannel();
//     const queue = Queue;
//     if(!channel)
//     {
//       return res.send(500).json({success:false,message:"Failed to Get RabbitMQ Channel"})
//     }

//     const event = await Tracking.create({
//       ...req.body,

//       browser: parsedData.browser,

//       os: parsedData.os,

//       device: parsedData.device,

//       country: locationData.country,

//       city: locationData.city,
//     });

//     console.log("EVENT TYPE:", event.eventType);

//     res.status(201).json({
//       success: true,
//       event,
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import {
  getChannel,
  Queue,
} from "../../config/rabbitmq.js";

export const trackEvent = async (
  req,
  res
) => {

  try {

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const body = { ...req.body, ip };

    console.log(body.eventType);

    /*
      GET CHANNEL
    */

    const channel = getChannel();

    if (!channel) {

      return res.status(500).json({
        success: false,
        message:
          "RabbitMQ Channel Not Found",
      });
    }

    /*
      ENSURE QUEUE EXISTS
    */

    await channel.assertQueue(Queue);

    /*
      PUSH EVENT TO QUEUE
    */

    channel.sendToQueue(
      Queue,

      Buffer.from(
        JSON.stringify(body)
      )
    );

    console.log(
      "EVENT PUSHED TO QUEUE"
    );

    /*
      FAST RESPONSE
    */

    res.status(202).json({
      success: true,
      message:
        "Event Queued Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
