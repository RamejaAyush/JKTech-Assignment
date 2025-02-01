import express, { Router } from "express";

import { authRouter } from "./auth/auth.router";
import { blogsRouter } from "./blogs/blogs.router";

export const router: Router = express.Router({ mergeParams: true });

router.use("/auth", authRouter);
router.use("/blogs", blogsRouter);
