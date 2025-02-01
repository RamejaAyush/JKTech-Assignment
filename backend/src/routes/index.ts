import express, { Router } from "express";

import { authRouter } from "./auth/auth.router";
import { postRouter } from "./post/post.router";

export const router: Router = express.Router({ mergeParams: true });

router.use("/auth", authRouter);
router.use("/posts", postRouter);
