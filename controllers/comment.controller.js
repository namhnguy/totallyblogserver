import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import {
  getPostCommentsService,
  addCommentService,
} from "../services/comment.service.js";

export const getPostCommentsController = async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    return res.status(400).json("Post ID is required");
  }

  const comments = getPostCommentsService(postId);
  res.status(200).json(comments);
};

export const addCommentController = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  if (!postId) {
    return res.status(400).json("Post ID is required");
  }

  try {
    const savedComment = await addCommentService(clerkUserId, req.body, postId);
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const deleteCommentController = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const id = req.params.id;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json("Comment has been deleted");
  }

  const user = User.findOne({ clerkUserId });

  const deletedComment = await Comment.findOneAndDelete({
    _id: id,
    user: user._id,
  });

  if (!deletedComment) {
    return res.status(403).json("You can delete only your comment!");
  }

  res.status(200).json("Comment deleted");
};
