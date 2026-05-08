import { v4 as uuidv4 } from "uuid";

import Site from "./site.model.js";

export const createSite = async (req,res) => {

  try {

    const {siteName,domain,} = req.body;

    const newSite =
      await Site.create({

        siteName,

        domain,

        siteId:
          `site_${uuidv4()}`,

        apiKey:
          `key_${uuidv4()}`,
      });

        const script =
  `<script src="http://localhost:5000/tracker.js" data-site-id="${newSite.siteId}" data-api-key="${newSite.apiKey}"></script>`;
            console.log(script);


    res.status(201).json({
      success: true,
      site: newSite,
      script,
    });

  } 
  catch (error) {

  if (error.code === 11000) {

    return res.status(400).json({
      success: false,
      message:
        "Domain already registered",
    });
  }

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};