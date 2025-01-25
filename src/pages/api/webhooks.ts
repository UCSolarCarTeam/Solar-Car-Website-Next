import { type NextApiRequest, type NextApiResponse } from "next";
import { Webhook } from "svix";

import { env } from "@/env";
import { db } from "@/server/db";
import { type WebhookEvent } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).end();
  } else {
    if (!env.WEBHOOK_SECRET) {
      throw new Error(
        "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
      );
    }
    // Get the Svix headers for verification
    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res
        .status(400)
        .json({ error: "Error occured -- no svix headers" });
    } else {
      const body = JSON.stringify(req.body);

      // Create a new Svix instance
      const wh = new Webhook(env.WEBHOOK_SECRET);
      let evt: WebhookEvent;

      // Verify the incoming webhook
      try {
        evt = wh.verify(body, {
          "svix-id": svix_id,
          "svix-signature": svix_signature,
          "svix-timestamp": svix_timestamp,
        }) as WebhookEvent;
        const eventType = evt.type;
        if (eventType === "user.created") {
          await db.user.create({
            data: {
              clerkUserId: evt.data.id,
              firstName: evt.data.first_name,
              lastName: evt.data.last_name,
            },
          });
        } else if (eventType === "user.deleted") {
          await db.user.delete({
            where: {
              clerkUserId: evt.data.id,
            },
          });
        }
        return res.status(200).json({ response: "ok" });
      } catch (err) {
        return res.status(400).json({ err });
      }
    }
  }
}
