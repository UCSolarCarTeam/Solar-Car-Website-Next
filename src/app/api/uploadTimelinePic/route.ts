import { NextResponse } from "next/server";

import { env } from "@/env";
import { uploadImageAsWebp } from "@/server/upload-image";

export interface UploadFilePicBody {
  fileName: string;
  fileType: string;
  fileContent: string;
}

export async function POST(req: Request) {
  try {
    const { fileContent, fileName } = (await req.json()) as UploadFilePicBody;
    const publicUrl = await uploadImageAsWebp({
      bucket: env.SPONSORSHIP_PICTURE_BUCKET,
      fileContent,
      fileName,
      objectPrefix: "timeline/",
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
