import Site from "../modules/Sites/site.model.js";

const validateSite = async (req,res,next) => {
  try {

    const {
      siteId,
      apiKey,
    } = req.body;


    if (!siteId ||!apiKey) {

      return res.status(400).json({
        success: false,
        message:
          "siteId and apiKey required",
      });
    }


    const site =
      await Site.findOne({
        siteId,
        apiKey,
      });


    if (!site) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid site credentials",
      });
    }

      const requestOrigin =
      req.headers.origin;

      if (requestOrigin !==site.domain) {

          return res.status(403).json({
            success: false,

            message:
              "Domain not authorized",
          });
      }


    req.site = site;

    next();

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default validateSite;