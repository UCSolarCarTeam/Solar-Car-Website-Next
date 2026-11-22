import "server-only";

import { randomUUID } from "node:crypto";
import sharp from "sharp";

import { supabase } from "@/server/supabase";

interface UploadImageParams {
  bucket: string;
  fileContent: string;
  fileName: string;
  objectPrefix?: string;
}

function webpFileName(fileName: string): string {
  const extensionlessName = fileName.replace(/\.[^/.]+$/, "");
  return `${extensionlessName || fileName}.webp`;
}

export async function uploadImageAsWebp({
  bucket,
  fileContent,
  fileName,
  objectPrefix = "",
}: UploadImageParams): Promise<string> {
  const match = /^data:image\/[^;,]+;base64,([\s\S]+)$/.exec(fileContent);
  if (!match?.[1]) {
    throw new Error("Invalid image data.");
  }

  const input = Buffer.from(match[1], "base64");
  if (input.length === 0) {
    throw new Error("Image data is empty.");
  }

  const image = sharp(input, { animated: true });
  const metadata = await image.metadata();
  if (!metadata.format) {
    throw new Error("Unsupported or invalid image format.");
  }

  const webpBuffer = await image.webp({ quality: 80 }).toBuffer();
  const storagePath = `${objectPrefix}${webpFileName(fileName)}`;
  const { data: fileUpload, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, webpBuffer, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) throw error;

  const { data: url } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileUpload.path);
  const freshUrl = new URL(url.publicUrl);
  freshUrl.searchParams.set("cacheNonce", randomUUID());
  return freshUrl.toString();
}
