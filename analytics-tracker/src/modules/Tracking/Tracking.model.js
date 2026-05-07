import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      default: "pageview",
    },
    siteId: String,

    apiKey: String,

    visitorId: String,

    sessionId: String,

    url: String,

    referrer: String,

    userAgent: String,

    browser: String,

    os: String,

    device: String,

    country: String,

    city: String,
    duration: Number,

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Tracking = mongoose.model("Tracking", trackingSchema);

export default Tracking;