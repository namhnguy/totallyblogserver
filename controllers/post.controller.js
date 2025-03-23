import ImageKit from "imagekit";
import {
  getPostsService,
  getPostService,
  createPostService,
  deletePostService,
  featurePostService,
} from "../services/post.service.js";

export const getPostsController = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const category = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  try {
    const postData = await getPostsService(
      page,
      limit,
      category,
      author,
      searchQuery,
      sortQuery,
      featured
    );

    res.status(200).json(postData);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getPostController = async (req, res) => {
  const post = await getPostService(req.params.slug);
  res.status(200).json(post);
};

export const createPostController = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated.");
  }

  const slug = req.body.title.replace(/ /g, "-").toLowerCase();

  try {
    const post = await createPostService(clerkUserId, slug, req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const deletePostController = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.id;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated.");
  }

  if (!postId) {
    return res.status(400).json("Post ID is required.");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  try {
    const deletedPost = await deletePostService(clerkUserId, role, postId);
    if (!deletedPost) {
      return res.status(403).json("Unable to delete post");
    }
    res.status(200).json("Post deleted");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const featurePostController = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;
  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  if (role !== "admin") {
    return res.status(403).json("You cannot feature posts!");
  }

  if (!postId) {
    return res.status(400).json("Post ID is required!");
  }

  try {
    const updatedPost = await featurePostService(postId);
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuthController = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();

  try {
    res.send(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
