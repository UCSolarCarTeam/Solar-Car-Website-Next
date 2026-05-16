"use client";

import toast from "react-hot-toast";

import { compress } from "@/app/_lib/compress";
import { tryCatch } from "@/app/_lib/utils";
import { useMutation } from "@tanstack/react-query";

interface UploadProfilePicParams {
  file: File;
  fileName: string;
}

interface UploadProfilePicResponse {
  publicUrl: string;
}

export const useUploadProfilePic = () => {
  return useMutation({
    mutationFn: async ({ file, fileName }: UploadProfilePicParams) => {
      const compressedFile = await compress(file);

      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const fileContent = e.target?.result;
          const { data, error } = await tryCatch(
            fetch("/api/uploadProfilePic", {
              body: JSON.stringify({
                fileContent,
                fileName,
                fileType: file.type,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            }).then((res) => res.json() as Promise<UploadProfilePicResponse>),
          );

          if (error) {
            reject(error);
            return;
          }

          resolve(data.publicUrl);
        };

        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(compressedFile);
      });
    },
    onError: () => {
      toast.error(
        "There was an error saving your image. Please contact Telemetry Team.",
      );
    },
  });
};
