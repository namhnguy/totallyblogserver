import express from "express";
import {
  addCommentController,
  deleteCommentController,
  getPostCommentsController,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/:postId", getPostCommentsController);
router.post("/:postId", addCommentController);
router.delete("/:id", deleteCommentController);

export default router;
