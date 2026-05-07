import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
    },

    domain: {
      type: String,
      required: true,
    },

    siteId: {
      type: String,
      required: true,
      unique: true,
    },

    apiKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Site = mongoose.model("Site", siteSchema);

export default Site;