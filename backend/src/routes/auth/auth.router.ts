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
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    logger.info("--- Token generated ---");
    res.redirect(`/auth/callback?token=${token}`);
    return;
  }
);

authRouter.get("/logout", (req: Request, res: Response) => {
  logger.info("--- Inside GET /auth/logout ---");

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    logger.error("--- No token found, user already logged out ---");
    res.status(400).json({
      status: false,
      message: "No active session found",
    });
    return;
  }

  logger.info("--- Logged out successfully ---");
  res.status(200).json({
    status: true,
    message: "Logged out successfully",
  });
  return;
});

authRouter.get("/mine", (req: Request, res: Response) => {
  logger.info("--- Inside GET /auth/mine ---");

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      logger.error("--- No token found in authorization header ---");
      res.status(401).json({ status: false, message: "No token found" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    logger.info("--- Token verified ---");

    res.status(200).json({
      status: true,
      message: "Token verified",
      user: decoded,
    });
  } catch (error: any) {
    logger.error(error, "Error in GET /auth/mine");
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});
