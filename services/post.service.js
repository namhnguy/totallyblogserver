import {
  adminDeletePost,
  createPost,
  getPostById,
  getPostBySlug,
  getPosts,
  getTotalPosts,
  userDeletePost,
  updatePostFeatured,
} from "../data/post.data";
import { findUserByClerkId, findUserIdByAuthor } from "../data/user.data";

export const getPostsService = async (
  page = 1,
  limit = 2,
  category,
  author,
  searchQuery,
  sortQuery,
  featured
) => {
  const query = {};

  let sortObj = { createdAt: -1 };

  if (category) {
    query.category = category;
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const userId = await findUserIdByAuthor(author);

    if (!userId) {
      return res.status(404).json("No post found for this author");
    }

    query.user = userId._id;
  }

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        break;
    }
  }

  if (featured) {
    query.isFeatured = true;
  }

  const posts = await getPosts(query, sortObj, limit, page);
  const totalPosts = await getTotalPosts();
  const hasMore = page * limit < totalPosts;

  return { posts, hasMore };
};

export const getPostService = async (slug) => {
  return await getPostBySlug(slug);
};

export const createPostService = async (clerkUserId, slug, body) => {
  const user = await findUserByClerkId(clerkUserId);

  if (!user) {
    throw new Error("User not found.");
  }

  let existingPost = await getPostBySlug(slug);

  let counter = 2;

  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await getPostBySlug(slug);
    counter++;
  }

  return await createPost(user, slug, body);
};

export const deletePostService = async (clerkUserId, role, postId) => {
  const user = await findUserByClerkId(clerkUserId);

  if (!user) {
    throw new Error("User not found.");
  }

  const deletedPost = null;

  if (role === "admin") {
    deletedPost = await adminDeletePost(postId);
  } else {
    deletedPost = await userDeletePost(postId, user._id);
  }

  return deletedPost;
};

export const featurePostService = async (postId) => {
  const post = await getPostById(postId);

  if (!post) {
    throw new Error("Post not found.");
  }

  const isFeatured = post.isFeatured;

  return await updatePostFeatured(postId, isFeatured);
};
