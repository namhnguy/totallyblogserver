import Post from "../models/post.model.js";

export const getPosts = async (query, sortObj, limit, page) => {
  return await Post.find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);
};

export const getTotalPosts = async () => {
  return await Post.countDocuments();
};

export const getPostBySlug = async (slug) => {
  return await Post.findOne({ slug: slug }).populate("user", "username img");
};

export const getPostById = async (postId) => {
  return await Post.findById(postId);
};

export const createPost = async (user, slug, body) => {
  const newPost = new Post({ user: user._id, slug, ...body });
  return await newPost.save();
};

export const adminDeletePost = async (postId) => {
  return await Post.findByIdAndDelete({ _id: postId });
};

export const userDeletePost = async (postId, userId) => {
  return await Post.findOneAndDelete({
    _id: postId,
    user: userId,
  });
};

export const updatePostFeatured = async (postId, isFeatured) => {
  return await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    { new: true }
  );
};
