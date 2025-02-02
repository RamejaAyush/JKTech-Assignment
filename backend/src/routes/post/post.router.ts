import logger from "../../utils/logger";
import prisma from "../../utils/prisma";
import express, { Router, Request, Response } from "express";

import { authenticateCookie } from "../../middleware/authenticate.cookie";

export const postRouter: Router = express.Router({ mergeParams: true });

postRouter.get("/", async (_req: Request, res: Response) => {
  try {
    logger.info("--- Inside GET /blogs ---");

    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: true },
    });

    res.status(200).json({
      status: true,
      message: "Posts retrieved successfully",
      posts,
    });
  } catch (error: any) {
    logger.error(error, "Error in GET /blogs");
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

postRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    logger.info("--- Inside GET /blogs/:id ---");

    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { author: true },
    });

    if (!post) {
      logger.error("--- No post found with id: %s ---", req.params.id);
      res.status(404).json({
        status: false,
        message: "No post found with id",
      });
      return;
    }

    logger.info("--- Post found with id: %s ---", req.params.id);
    res.status(200).json({
      status: true,
      message: "Post retrieved successfully",
      post,
    });
  } catch (error: any) {
    logger.error(error, "Error in GET /blogs/:id");
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

postRouter.post(
  "/",
  authenticateCookie,
  async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (!user) {
      logger.error("--- No user data ---");
      res.status(401).json({ status: false, message: "No user data" });
      return;
    }

    const { title, content, published } = req.body;

    if (!title || !content) {
      logger.error("--- Missing title or content ---");
      res.status(400).json({
        status: false,
        message: "Missing title or content",
      });
      return;
    }

    try {
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          published: published ?? false,
          authorId: user.userId,
        },
      });
      res.status(201).json(newPost);
    } catch (error: any) {
      logger.error(error, "Error in POST /blogs");
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }
);

postRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    logger.info("--- Inside PATCH /blogs/:id ---");

    const { title, content, published } = req.body;

    if (!title || !content) {
      logger.error("--- Missing title or content ---");
      res.status(400).json({
        status: false,
        message: "Missing title or content",
      });
      return;
    }

    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        content,
        published: published ?? false,
      },
    });

    res.status(200).json({
      status: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error: any) {
    logger.error(error, "Error in PATCH /blogs/:id");
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

postRouter.delete(
  "/:id",
  authenticateCookie,
  async (req: Request, res: Response) => {
    logger.info("--- Inside DELETE /blogs/:id ---");

    const { id } = req.params;
    const user = (req as any).user;

    try {
      const existingPost = await prisma.post.findUnique({
        where: { id: Number(id) },
      });

      if (!existingPost) {
        logger.error("--- Post not found ---");
        res.status(404).json({ status: false, error: "Post not found" });
      }

      if (existingPost?.authorId! !== user.userId) {
        logger.error("--- User does not own this post ---");
        res
          .status(403)
          .json({ status: false, error: "You do not own this post." });
      }

      logger.info("--- Deleting post with id: %s ---", id);
      await prisma.post.delete({
        where: { id: Number(id) },
      });

      logger.info("--- Post deleted successfully ---");
      res.json({ status: true, message: "Post deleted successfully" });
    } catch (error: any) {
      logger.error(error, "Error in DELETE /blogs/:id");
      res
        .status(500)
        .json({ error: "An error occurred while deleting the post." });
    }
  }
);
