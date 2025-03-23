import express from "express";
import {
  getPostsController,
  getPostController,
  createPostController,
  deletePostController,
  uploadAuthController,
  featurePostController,
} from "../controllers/post.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";

const router = express.Router();

router.get("/upload-auth", uploadAuthController);
router.get("/", getPostsController);
router.get("/:slug", increaseVisit, getPostController);
router.post("/", createPostController);
router.delete("/:id", deletePostController);
router.patch("/feature", featurePostController);

export default router;
