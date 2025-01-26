import logger from "./utils/logger";
import { IHealthResponse, IResponse } from "./interfaces/IResponse";

import express, { Application, Request, Response } from "express";

const app: Application = express();

app.get("/", (_: Request, res: Response<IResponse>) => {
  logger.info("--- Inside GET / ---");
  res.status(200).json({
    status: true,
    message: "Hello JKTech",
  });
});

app.get("/health", (_: Request, res: Response<IHealthResponse>) => {
  logger.info("--- Inside GET /health ---");
  res.status(200).json({
    status: true,
    message: "JKTech backend is running healthy",
    uptime: Math.floor(process.uptime()),
  });
});

export default app;
