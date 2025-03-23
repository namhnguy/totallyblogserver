import express from "express";
import {
  getUserSavedPostsController,
  savePostController,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/saved", getUserSavedPostsController);
router.patch("/save", savePostController);

export default router;
