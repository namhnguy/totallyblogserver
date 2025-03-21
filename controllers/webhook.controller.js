import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { Webhook } from "svix";

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET);

  // Get headers and body
  const headers = req.headers;
  const payload = req.body;

  //   // Get Svix headers for verification
  //   const svix_id = headers["svix-id"];
  //   const svix_timestamp = headers["svix-timestamp"];
  //   const svix_signature = headers["svix-signature"];

  //   // If there are no headers, error out
  //   if (!svix_id || !svix_timestamp || !svix_signature) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Error: Missing svix headers",
  //     });
  //   }

  let evt;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If verification fails, error out and return error code
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    console.log("Error: Could not verify webhook:", err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Do something with payload
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const newUser = new User({
      clerkUserId: id,
      username: evt.data.username || evt.data.email_addresses[0].email_address,
      email: evt.data.email_addresses[0].email_address,
      img: evt.data.profile_image_url,
    });

    await newUser.save();
  }

  if (eventType === "user.deleted") {
    const deletedUser = await User.findOneAndDelete({
      clerkUserId: id,
    });

    await Post.deleteMany({ user: deletedUser._id });
    await Comment.deleteMany({ user: deletedUser._id });
  }

  return res.status(200).json({
    success: true,
    message: "Webhook received",
  });
};
