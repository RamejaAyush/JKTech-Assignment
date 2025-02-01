import logger from "../../utils/logger";
import express, { Router, Request, Response } from "express";

import { authenticateCookie } from "../../middleware/authenticate.cookie";

export const blogsRouter: Router = express.Router({ mergeParams: true });

blogsRouter.get("/", authenticateCookie, (req: Request, res: Response) => {
  logger.info("--- Inside GET /blogs ---");
  const user = req.user as any;

  res.status(200).json({
    status: true,
    message: "Blogs retrieved successfully",
    user,
  });
});
