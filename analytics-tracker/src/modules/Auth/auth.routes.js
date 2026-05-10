import express from "express";

import {
  register,
  login,
} from "./auth.controller.js";

const AuthRouter =
  express.Router();

/*
  REGISTER
*/

AuthRouter.post(
  "/register",

  register
);

/*
  LOGIN
*/

AuthRouter.post(
  "/login",

  login
);

export default AuthRouter;