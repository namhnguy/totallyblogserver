import { findUserByClerkId, updateUserSavedPosts } from "../data/user.data.js";

export const getUserSavedPostsService = async (clerkUserId) => {
  const user = await findUserByClerkId(clerkUserId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.savedPosts;
};

export const savePostService = async (clerkUserId, postId) => {
  const user = await findUserByClerkId(clerkUserId);
  if (!user) {
    throw new Error("User not found");
  }

  const isSaved = user.savedPosts.some((p) => p === postId);
  const updateAction = isSaved ? "$pull" : "$push";

  await updateUserSavedPosts(user._id, updateAction, postId);

  return isSaved ? "Post unsaved" : "Post saved";
};
