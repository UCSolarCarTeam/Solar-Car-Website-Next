import { NextResponse } from "next/server";

import { env } from "@/env";
import {
  requireAdminContext,
  requireAuthedContext,
} from "@/server/portal/context";
import { uploadImageAsWebp } from "@/server/upload-image";

import type { UploadFilePicBody } from "../uploadSponsorPic/route";

export async function POST(req: Request) {
  try {
    const { fileContent, fileName, profileId } =
      (await req.json()) as UploadFilePicBody & { profileId: string };

    if (typeof profileId !== "string") {
      throw new Error("A profile ID is required.");
    }

    const ctx = await requireAuthedContext();
    if (/^[1-9]\d*$/.test(profileId)) {
      const numericProfileId = Number(profileId);
      if (!Number.isSafeInteger(numericProfileId)) {
        throw new Error("Invalid profile ID.");
      }
      const profile = await ctx.db.user.findUnique({
        where: { id: numericProfileId },
        select: { clerkUserId: true },
      });
      if (!profile) throw new Error("Profile not found.");
      if (profile.clerkUserId !== ctx.user.id) await requireAdminContext();
    } else {
      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          profileId,
        )
      ) {
        throw new Error("Invalid profile ID.");
      }
      await requireAdminContext();
    }

    const publicUrl = await uploadImageAsWebp({
      bucket: env.PROFILE_PICTURE_BUCKET,
      fileContent,
      fileName,
      objectPrefix: `profiles/${profileId}/`,
    });

    return NextResponse.json({ publicUrl, status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : error,
        status: 500,
      },
      { status: 500 },
    );
  }
}
