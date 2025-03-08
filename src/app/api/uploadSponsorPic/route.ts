import { NextResponse } from "next/server";

import { env } from "@/env";
import { supabase } from "@/server/supabase";

export interface UploadFilePicBody {
  fileName: string;
  fileType: string;
  fileContent: string;
}

export async function POST(req: Request) {
  try {
    const { fileContent, fileName, fileType } =
      (await req.json()) as UploadFilePicBody;
    const base64Data = fileContent.split(",")[1];
    if (base64Data) {
      const buffer = Buffer.from(base64Data, "base64");

      if (!buffer) {
        throw new Error("Error converting base64 data to buffer.");
      }

      const { data: fileUpload, error } = await supabase.storage
        .from(env.SPONSORSHIP_PICTURE_BUCKET)
        .upload(fileName, buffer, {
          contentType: fileType,
          upsert: true,
        });

      if (!error) {
        const { data: url } = supabase.storage
          .from(env.SPONSORSHIP_PICTURE_BUCKET)
          .getPublicUrl(fileUpload.path);

        return NextResponse.json({
          publicUrl: url.publicUrl,
          status: 200,
        });
      }

      return NextResponse.json({
        error,
        status: 500,
      });
    }
  } catch (error) {
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
