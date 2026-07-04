import Image, { type StaticImageData } from "next/image";
import React, { memo, useCallback } from "react";

import Upload from "../../svgs/Upload";
import styles from "./index.module.scss";

interface DropZoneProps {
  currentImage: string | StaticImageData;
  handleFileUpload: (file: File) => void;
}

const DropZone = ({ currentImage, handleFileUpload }: DropZoneProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
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
    },
    [handleFileUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [handleFileUpload],
  );

  return (
    <div
      className={styles.dropzoneContainer}
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
      <label className={styles.label} htmlFor="fileInput">
        <Upload />
        <div>
          <div className={styles.headerText}>
            Drop images here or click to upload
          </div>
          <p className={styles.fileSupport}>Supports JPEG, PNG, WebP</p>
        </div>
      </label>
    </div>
  );
};

export default memo(DropZone);
