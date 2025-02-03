import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import { NextFunction, Request, Response } from "express";

export const authenticateCookie = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Authenticating token | inside middleware");
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    logger.info("No token found in authorization header | inside middleware");
    res
      .status(401)
      .json({
        status: false,
        message: "No token found in authorization header",
      });
    return;
  }

  try {
    logger.info("Verifying token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    logger.info("Token verified successfully | inside middleware");
    next();
  } catch (error) {
    logger.error("Token verification failed");
    res
      .status(401)
      .json({ status: false, message: "Token verification failed" });
  }
};
