import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import { NextFunction, Request, Response } from "express";

export const authenticateCookie = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Authenticating cookie");
  const token = req.cookies.jwt;
  logger.info("Token: ", token);

  if (!token) {
    logger.info("No token found in cookies");
    res.redirect("/auth/google");
    return;
  }

  try {
    logger.info("Verifying token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Token verification failed");
    res
      .status(401)
      .json({ status: false, message: "Token verification failed" });
  }
};
