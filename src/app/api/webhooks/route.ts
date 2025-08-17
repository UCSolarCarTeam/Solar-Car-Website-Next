import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { env } from "@/env";
import { clerkClient } from "@/server/api/trpc";
import { db } from "@/server/db";
import { type WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  if (!env.WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({
      status: 400,
      statusText: "Error occured -- no svix headers",
    });
  } else {
    const body = JSON.stringify(await req.json());

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
        const role = evt.data.public_metadata?.role;

        // update the users entry in supabase
        await db.user.create({
          data: {
            clerkUserId: evt.data.id,
            firstName: evt.data.first_name,
            lastName: evt.data.last_name,
          },
        });

        // update the users metadata with the role specified
        await clerkClient.users.updateUser(evt.data.id, {
          publicMetadata: {
            role,
          },
        });
      } else if (eventType === "user.deleted") {
        // doing delete many because it wont throw an error if the user is not found or already deleted
        await db.user.deleteMany({
          where: {
            clerkUserId: evt.data.id,
          },
        });
      } else {
        NextResponse.json({
          response: "unknown event",
          status: 400,
        });
      }
      return NextResponse.json({ response: "ok", status: 200 });
    } catch (err) {
      global.console.error(err);
      return NextResponse.json({ err, status: 400 });
    }
  }
}
