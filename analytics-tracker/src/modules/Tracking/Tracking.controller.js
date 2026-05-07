import getLocation from "../../utils/geoLocation.js";
import parseUserAgent from "../../utils/parseUserAgent.js";

import Tracking from "./Tracking.model.js";

export const trackEvent = async (req, res) => {
  try {

    /*
      HANDLE BOTH fetch() AND sendBeacon()
    */


    /*
      USER AGENT
    */

    const { userAgent } = req.body;

    /*
      PARSE USER AGENT
    */

    const parsedData = userAgent
      ? parseUserAgent(userAgent)
      : {
          browser: "Unknown",
          os: "Unknown",
          device: "Unknown",
        };

    /*
      GET IP
    */

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

    /*
      GET LOCATION
    */

    const locationData = getLocation(ip);

    /*
      STORE EVENT
    */

    const event = await Tracking.create({
      ...req.body,

      browser: parsedData.browser,

      os: parsedData.os,

      device: parsedData.device,

      country: locationData.country,

      city: locationData.city,
    });

    console.log("EVENT TYPE:", event.eventType);

    res.status(201).json({
      success: true,
      event,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};