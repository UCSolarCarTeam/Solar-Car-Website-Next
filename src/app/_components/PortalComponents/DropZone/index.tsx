import Image, { type StaticImageData } from "next/image";
import type React from "react";

import Upload from "../../svgs/Upload";
import { portal } from "@/lib/portal-classes";

interface DropZoneProps {
  currentImage: string | StaticImageData;
  handleFileUpload: (file: File) => void;
}

const DropZone = ({ currentImage, handleFileUpload }: DropZoneProps) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files)
      .filter(
        (file) =>
          file.type.startsWith("image/") ||
          file.name.toLowerCase().endsWith("jxl"),
      )
      .map((file) => ({
        file,
      }));
    if (files[0]?.file) {
      handleFileUpload(files[0]?.file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        id: crypto.randomUUID(),
      }));
    if (files[0]?.file) {
      handleFileUpload(files[0]?.file);
    }
    e.target.value = "";
  };

  return (
    <div
      className={portal.dropzoneContainer}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        accept="image/*"
        className="hidden"
        id="fileInput"
        onChange={handleFileInput}
        type="file"
      />
      {currentImage && (
        <Image
          alt="profile image"
          fill
          src={currentImage}
          style={{ objectFit: "cover" }}
        />
      )}
      <label className={portal.dropzoneLabel} htmlFor="fileInput">
        <Upload />
        <div>
          <div className={portal.dropzoneHeaderText}>
            Drop images here or click to upload
          </div>
          <p className={portal.dropzoneFileSupport}>Supports JPEG, PNG, WebP</p>
        </div>
      </label>
    </div>
  );
};

export default DropZone;
