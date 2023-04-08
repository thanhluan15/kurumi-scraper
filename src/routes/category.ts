/** @format */

import express, { Request, Response } from "express";
import {
  Prisma,
  PrismaClient,
  Category,
  CategoriesOnPosts,
} from "@prisma/client";
import verify from "../middlewares/verifyToken";
const router = express.Router();

const prisma = new PrismaClient();

// GET ALL CATEGORY
router.get("/", async (req: Request, res: Response) => {
  try {
    const posts = await prisma.category.findMany();
    res.status(201).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POST BY CATEGORY
router.get("/:name", async (req: Request, res: Response) => {
  const { categoryId, postId }: CategoriesOnPosts = req.body;
  const { name } = req.params;
  console.log(name);
  // @ts-ignore
  try {
    const posts = await prisma.categoriesOnPosts.findMany({
      where: {
        category: {
          name: name,
        },
      },
      include: { post: true, category: true },
    });
    res.status(201).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE A CATEGORY
router.post("/", verify, async (req: Request, res: Response) => {
  const { name }: Category = req.body;
  // @ts-ignore
  if (req?.user?.Role === "ADMIN") {
    try {
      await prisma.category.create({
        data: {
          name,
        },
      });
      res.status(201).json("Create category successful!");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("Unable to post category!");
  }
});

// ADD A POST INTO CATEGORY
router.post("/add", verify, async (req: Request, res: Response) => {
  const { categoryId, postId }: CategoriesOnPosts = req.body;
  // @ts-ignore
  if (req?.user?.Role === "ADMIN") {
    try {
      await prisma.categoriesOnPosts.create({
        data: {
          categoryId,
          postId,
        },
      });
      res.status(201).json("Create category successful!");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("Unable to post category!");
  }
});

export default router;
