import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {

      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

    siteName: {
      type: String,
      required: true,
    },

    domain: {
      type: String,
      required: true,
      unique:true
    },

    siteId: {
      type: String,
      required: true,
      unique: true,
    },

    apiKey: {
      type: String,
      required: true,
      unique:true
    },
  },
  {
    timestamps: true,
  }
);

const Site = mongoose.model("Site", siteSchema);

export default Site;