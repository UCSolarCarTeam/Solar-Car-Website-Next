import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { env } from "@/env";
import { db } from "@/server/db";
import { type WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ status: 405 });
  } else {
    if (!env.WEBHOOK_SECRET) {
      throw new Error(
        "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
      );
    }
    // Get the Svix headers for verification
    const svix_id = req.headers.get("svix-id");
    const svix_timestamp = req.headers.get("svix-timestamp");
    const svix_signature = req.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({
        status: 400,
        statusText: "Error occured -- no svix headers",
      });
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
          // doing delete many because it wont throw an error if the user is not found or already deleted
          await db.user.deleteMany({
            where: {
              clerkUserId: evt.data.id,
            },
          });
        }
        return NextResponse.json({ response: "ok", status: 200 });
      } catch (err) {
        return NextResponse.json({ err, status: 400 });
      }
    }
  }
}
