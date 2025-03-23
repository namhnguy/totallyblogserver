import {
  getPostCommentsService,
  addCommentService,
  deleteCommentService,
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
  const commentId = req.params.id;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  if (!commentId) {
    return res.status(400).json("Comment ID is required");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  try {
    const deletedComment = await deleteCommentService(
      clerkUserId,
      role,
      commentId
    );
    if (!deletedComment) {
      return res.status(403).json("Unable to delete comment");
    }
    res.status(200).json("Comment deleted");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
