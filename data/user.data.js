import User from "../models/user.model.js";

export const findUserByClerkId = async (clerkUserId) => {
  return await User.findOne({ clerkUserId });
};

export const findUserIdByAuthor = async (author) => {
  const userId = await User.findOne({ username: author }).select("_id");
  return userId;
};

export const updateUserSavedPosts = async (userId, action, postId) => {
  return await User.findByIdAndUpdate(userId, {
    [action]: { savedPosts: postId },
  });
};
