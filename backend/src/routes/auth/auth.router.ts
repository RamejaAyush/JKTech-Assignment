import logger from "../../utils/logger";

import jwt from "jsonwebtoken";
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
  (req: Request, res: Response) => {
    logger.info("--- Inside GET /auth/google/callback ---");

    const user = req.user as any;

    if (!user) {
      logger.error("--- No user data ---");
      res.status(401).json({ status: false, message: "No user data" });
      return;
    }

    logger.info("--- User data retrieved ---");
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "1h" }
    );

    logger.info("--- Token generated ---");
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

    logger.info("--- Token set as cookie, redirecting to blogs ---");
    res.redirect("http://localhost:8080/blogs");
    return;
  }
);
