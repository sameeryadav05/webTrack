import { v4 as uuidv4 } from "uuid";

import Site from "./site.model.js";


export const createSite =
  async (req, res) => {

    try {

      const {
        siteName,
        domain,
      } = req.body;


      let cleanDomain;

          try {

            cleanDomain =
              new URL(domain).origin;

          } catch {

            return res.status(400)
              .json({
                success: false,

                message:
                  "Invalid domain URL",
              });
          }

      /*
        CHECK EXISTING
      */

      const existingSite =
        await Site.findOne({
          domain:cleanDomain,
        });

      if (existingSite) {

        return res.status(400)
          .json({
            success: false,

            message:
              "Site already exists",
          });
      }

      /*
        CREATE SITE
      */

      const newSite =
        await Site.create({

          user:
            req.user._id,

          siteName,

          domain:cleanDomain,

          siteId:
            `site_${crypto.randomUUID()}`,

          apiKey:
            `key_${crypto.randomUUID()}`,
        });

      /*
        SCRIPT
      */

      const script = `
<script
  src='http://localhost:5000/tracker.js'
  data-site-id="${newSite.siteId}"
  data-api-key="${newSite.apiKey}"
></script>
`;

      res.status(201).json({
        success: true,

        site: newSite,

        script,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
};



export const getMySites =
  async (req, res) => {

    try {

      /*
        FIND USER SITES
      */

      const sites =
        await Site.find({

          user:
            req.user._id,
        });

      res.status(200).json({
        success: true,

        count:
          sites.length,

        sites,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
};