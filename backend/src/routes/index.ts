import express, { Router } from "express";

import { authRouter } from "./auth/auth.router";

export const router: Router = express.Router({ mergeParams: true });

router.use("/auth", authRouter);
