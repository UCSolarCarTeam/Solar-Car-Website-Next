import { type NextApiRequest, type NextApiResponse } from "next/types";

import { env } from "@/env";
import { supabase } from "@/utils/api";

interface UploadFilePicBody {
  fileName: string;
  fileType: string;
  fileContent: string;
}

export default async function UploadProfilePic(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { fileContent, fileName, fileType } = req.body as UploadFilePicBody;
    const base64Data = fileContent.split(",")[1];
    if (base64Data) {
      const buffer = Buffer.from(base64Data, "base64");

      if (!buffer) {
        throw new Error("Error converting base64 data to buffer.");
      }

      const { data: fileUpload, error } = await supabase.storage
        .from(env.PROFILE_PICTURE_BUCKET)
        .upload(fileName, buffer, {
          contentType: fileType,
          upsert: true,
        });

      if (!error) {
        const { data: url } = supabase.storage
          .from(env.PROFILE_PICTURE_BUCKET)
          .getPublicUrl(fileUpload.path);

        return res.status(200).json(url);
      }

      return res.status(500).json({ error });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
}
