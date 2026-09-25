import type { Area } from "react-easy-crop";

export const cropImage = async (source: string, area: Area, rotation: number): Promise<Blob> => {
  if (
    ![area.x, area.y, area.width, area.height, rotation].every(Number.isFinite) ||
    area.width <= 0 ||
    area.height <= 0
  ) {
    throw new Error("Choose a valid crop area.");
  }
  const image = new Image();
  image.src = source;
  await image.decode();
  if (
    !image.naturalWidth ||
    !image.naturalHeight ||
    image.naturalWidth * image.naturalHeight > 24000000
  ) {
    throw new Error("Choose an image smaller than 24 megapixels.");
  }
  const radians = (rotation * Math.PI) / 180;
  const rotatedWidth =
    Math.abs(Math.cos(radians)) * image.naturalWidth +
    Math.abs(Math.sin(radians)) * image.naturalHeight;
  const rotatedHeight =
    Math.abs(Math.sin(radians)) * image.naturalWidth +
    Math.abs(Math.cos(radians)) * image.naturalHeight;
  const scale = Math.min(1, 1920 / Math.max(area.width, area.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(area.width * scale));
  canvas.height = Math.max(1, Math.round(area.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image cropping is unavailable in this browser.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.setTransform(scale, 0, 0, scale, -area.x * scale, -area.y * scale);
  context.translate(rotatedWidth / 2, rotatedHeight / 2);
  context.rotate(radians);
  context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Unable to crop this image. Try another file."));
        else if (blob.size > 3 * 1024 * 1024)
          reject(new Error("Cropped image exceeds 3 MB. Choose a smaller image."));
        else resolve(blob);
      },
      "image/jpeg",
      0.9,
    );
  });
};
