import {
  getUserSavedPostsService,
  savePostService,
} from "../services/user.service.js";

export const getUserSavedPostsController = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    const savedPosts = await getUserSavedPostsService(clerkUserId);
    res.status(200).json(savedPosts);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const savePostController = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  if (!postId) {
    return res.status(400).json("Post ID is required");
  }

  try {
    const message = await savePostService(clerkUserId, postId);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
