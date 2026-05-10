import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import User from "./User.model.js";

/*
  GENERATE JWT
*/

const generateToken = (user) => {

  return jwt.sign(
    {
      id: user._id,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );
};

/*
  REGISTER
*/

export const register =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body;

      /*
        CHECK USER
      */

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400)
          .json({
            success: false,

            message:
              "User already exists",
          });
      }

      /*
        HASH PASSWORD
      */

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      /*
        CREATE USER
      */

      const user =
        await User.create({

          name,

          email,

          password:
            hashedPassword,
        });

      /*
        TOKEN
      */

      const token =
        generateToken(user);

      res.status(201).json({
        success: true,

        token,

        user: {
          id: user._id,

          name: user.name,

          email: user.email,
        },
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

/*
  LOGIN
*/

export const login =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      /*
        FIND USER
      */

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(400)
          .json({
            success: false,

            message:
              "Invalid credentials",
          });
      }

      /*
        CHECK PASSWORD
      */

      const isMatch =
        await bcrypt.compare(
          password,

          user.password
        );

      if (!isMatch) {

        return res.status(400)
          .json({
            success: false,

            message:
              "Invalid credentials",
          });
      }

      /*
        GENERATE TOKEN
      */

      const token =
        generateToken(user);

      res.status(200).json({
        success: true,

        token,

        user: {
          id: user._id,

          name: user.name,

          email: user.email,
        },
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