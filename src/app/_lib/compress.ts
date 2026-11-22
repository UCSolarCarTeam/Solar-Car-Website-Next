import imageCompression, { type Options } from "browser-image-compression";

async function compress(file: File) {
  // Canvas-based compression flattens animated GIFs. Keep the original bytes
  // so the upload API can convert all frames into an animated WebP.
  if (file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif")) {
    return file;
  }

  // Run some compression algorithm on the file
  const options: Options = {
    maxSizeMB: 4,
    maxWidthOrHeight: 1600, // PIXELS
    useWebWorker: true,
  };
  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}

export { compress };
