import { findUserByClerkId } from "../data/user.data";
import {
  saveComment,
  getComments,
  adminDeleteComment,
  userDeleteComment,
} from "../data/comment.data";

export const getPostCommentsService = async (postId) => {
  return await getComments(postId);
};

export const addCommentService = async (clerkUserId, body, postId) => {
  const user = await findUserByClerkId(clerkUserId);

  if (!user) {
    throw new Error("User not found");
  }

  const savedComment = await saveComment(user, body, postId);
  return savedComment;
};

export const deleteCommentService = async (clerkUserId, role, commentId) => {
  const user = await findUserByClerkId(clerkUserId);

  if (!user) {
    throw new Error("User not found");
  }

  const deletedComment = null;

  if (role === "admin") {
    deletedComment = await adminDeleteComment(commentId);
  } else {
    deletedComment = await userDeleteComment(commentId, user._id);
  }

  return deletedComment;
};
