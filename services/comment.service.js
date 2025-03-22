import { findUserByClerkId } from "../data/user.data";
import { saveComment, getComments } from "../data/comment.data";

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
