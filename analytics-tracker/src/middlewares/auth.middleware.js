import jwt from "jsonwebtoken";

import User from
"../modules/Auth/User.model.js";

const authMiddleware =
  async (req, res, next) => {

    try {

      /*
        GET TOKEN
      */

      const authHeader =
        req.headers.authorization;

      if (!authHeader) {

        return res.status(401)
          .json({
            success: false,

            message:
              "No token provided",
          });
      }

      /*
        FORMAT:
        Bearer TOKEN
      */

      const token =
        authHeader.split(" ")[1];

      /*
        VERIFY TOKEN
      */

      const decoded =
        jwt.verify(
          token,

          process.env.JWT_SECRET
        );

      /*
        FIND USER
      */

      const user =
        await User.findById(
          decoded.id
        ).select("-password");

      if (!user) {

        return res.status(401)
          .json({
            success: false,

            message:
              "User not found",
          });
      }

      /*
        ATTACH USER
      */

      req.user = user;

      next();

    } catch (error) {

      console.log(error);

      res.status(401).json({
        success: false,

        message:
          "Unauthorized",
      });
    }
};

export default authMiddleware;