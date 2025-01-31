import logger from "../../utils/logger";
import { IUserResponse } from "../../interfaces/IResponse";

import passport from "passport";
import express, { Router, Request, Response } from "express";

export const authRouter: Router = express.Router({ mergeParams: true });

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response<IUserResponse>) => {
    logger.info("--- Inside GET /auth/google/callback ---");
    const user = req.user as any;
    res.status(200).json({
      status: true,
      message: "Successfully logged in",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }
);
