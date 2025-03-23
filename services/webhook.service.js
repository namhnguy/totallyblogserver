import { Webhook } from "svix";
import { createUser, deleteUserAndRelatedData } from "../data/webhook.data.js";

export const verifyWebhookService = (payload, headers, secret) => {
  const wh = new Webhook(secret);
  return wh.verify(payload, headers);
};

export const processWebhookEventService = async (event) => {
  const { id, type, data } = event;

  if (type === "user.created") {
    const userData = {
      clerkUserId: id,
      username: data.username || data.email_addresses[0].email_address,
      email: data.email_addresses[0].email_address,
      img: data.profile_image_url,
    };
    await createUser(userData);
    return { success: true, message: "User created" };
  } else if (type === "user.deleted") {
    await deleteUserAndRelatedData(id);
    return { success: true, message: "User deleted" };
  } else {
    return { success: false, message: "Event type not supported" };
  }
};
