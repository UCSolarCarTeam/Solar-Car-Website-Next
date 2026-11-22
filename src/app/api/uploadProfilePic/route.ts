import { NextResponse } from "next/server";

import { env } from "@/env";
import { uploadImageAsWebp } from "@/server/upload-image";

import type { UploadFilePicBody } from "../uploadSponsorPic/route";

export async function POST(req: Request) {
  try {
    const { fileContent, fileName } = (await req.json()) as UploadFilePicBody;
    const publicUrl = await uploadImageAsWebp({
      bucket: env.PROFILE_PICTURE_BUCKET,
      fileContent,
      fileName,
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
