import Site from
"../modules/Sites/site.model.js";

const siteAccessMiddleware =
  async (req, res, next) => {

    try {

      const { siteId } =
        req.params;

      /*
        FIND SITE
      */

      const site =
        await Site.findOne({
          siteId,
        });

      /*
        SITE NOT FOUND
      */

      if (!site) {

        return res.status(404)
          .json({
            success: false,

            message:
              "Site not found",
          });
      }

      /*
        CHECK OWNERSHIP
      */

      if (
        site.user.toString()
        !==
        req.user._id.toString()
      ) {

        return res.status(403)
          .json({
            success: false,

            message:
              "Access denied",
          });
      }

      /*
        ATTACH SITE
      */

      req.site = site;

      next();

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
};

export default
siteAccessMiddleware;