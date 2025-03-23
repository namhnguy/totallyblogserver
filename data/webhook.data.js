import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

export const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

export const deleteUserAndRelatedData = async (clerkUserId) => {
  const deletedUser = await User.findOneAndDelete({ clerkUserId });
  if (deletedUser) {
    await Post.deleteMany({ user: deletedUser._id });
    await Comment.deleteMany({ user: deletedUser._id });
  }
  return deletedUser;
};
