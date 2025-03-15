import imageCompression from "browser-image-compression";

async function compress(file: File) {
  // Run some compression algorithm on the file
  const options = {
    maxWidthOrHeight: 1600, // PIXELS
    useWebWorker: true,
  };
  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}

export { compress };
