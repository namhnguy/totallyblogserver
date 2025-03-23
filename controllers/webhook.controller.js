import {
  verifyWebhookService,
  processWebhookEventService,
} from "../services/webhook.service.js";

export const clerkWebHookController = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.log(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
    );
    return res.status(500).json("Error: Missing signing secret");
  }

  try {
    const headers = req.headers;
    const payload = req.body;

    const event = verifyWebhookService(payload, headers, WEBHOOK_SECRET);
    const result = await processWebhookEventService(event);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.log("Error: Could not verify webhook:", err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
