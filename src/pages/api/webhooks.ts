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
        console.error("Error verifying webhook:", err);
        return res.status(400).json({ err });
      }
    }
  }
}

// {
//   "data": {
//     "birthday": "",
//     "created_at": 1654012591514,
//     "email_addresses": [
//       {
//         "email_address": "example@example.org",
//         "id": "idn_29w83yL7CwVlJXylYLxcslromF1",
//         "linked_to": [],
//         "object": "email_address",
//         "verification": {
//           "status": "verified",
//           "strategy": "ticket"
//         }
//       }
//     ],
//     "external_accounts": [],
//     "external_id": "567772",
//     "first_name": "Example",
//     "gender": "",
//     "id": "user_29w83sxmDNGwOuEthce5gg56FcC",
//     "image_url": "https://img.clerk.com/xxxxxx",
//     "last_name": "Example",
//     "last_sign_in_at": 1654012591514,
//     "object": "user",
//     "password_enabled": true,
//     "phone_numbers": [],
//     "primary_email_address_id": "idn_29w83yL7CwVlJXylYLxcslromF1",
//     "primary_phone_number_id": null,
//     "primary_web3_wallet_id": null,
//     "private_metadata": {},
//     "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
//     "public_metadata": {},
//     "two_factor_enabled": false,
//     "unsafe_metadata": {},
//     "updated_at": 1654012591835,
//     "username": null,
//     "web3_wallets": []
//   },
//   "event_attributes": {
//     "http_request": {
//       "client_ip": "0.0.0.0",
//       "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
//     }
//   },
//   "object": "event",
//   "timestamp": 1654012591835,
//   "type": "user.created"
// }
