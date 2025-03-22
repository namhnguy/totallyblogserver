import Comment from "../models/comment.model";

export const getComments = async (postId) => {
  const comments = await Comment.find({ post: postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });

  return comments;
};

export const saveComment = async (user, body, postId) => {
  const newComment = new Comment({
    user: user._id,
    post: postId,
    body,
  });

  const savedComment = await newComment.save();

  return savedComment;
};
