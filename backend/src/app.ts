import { router } from "./routes";
import logger from "./utils/logger";
import "./routes/auth/auth.strategy";
import { IHealthResponse } from "./interfaces/IResponse";

import cors from "cors";
import path from "path";
import passport from "passport";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../build")));

app.get("/health", (_: Request, res: Response<IHealthResponse>) => {
  logger.info("--- Inside GET /health ---");
  res.status(200).json({
    status: true,
    message: "JKTech backend is running healthy",
    uptime: Math.floor(process.uptime()),
  });
});

app.use("/", router);

app.get("*", (req: Request, res: Response) => {
  if (req.headers.accept?.includes("application/json")) {
    logger.info("--- Route not found: %s ---", req.originalUrl);
    res.status(404).json({
      status: false,
      message: "Route not found",
    });
  }

  const filePath = path.join(__dirname, "../build", "index.html");
  logger.info("--- Sending file: %s ---", filePath);
  res.sendFile(filePath);
});

export default app;
