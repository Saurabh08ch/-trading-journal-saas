import crypto from "node:crypto";
import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";

const UPLOAD_ROOT = path.resolve(process.cwd(), "uploads");
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const MIME_TYPES: Record<string, string> = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function resolveUploadPath(relativePath: string) {
  const normalizedRelativePath = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const absolutePath = path.resolve(UPLOAD_ROOT, normalizedRelativePath);

  if (!absolutePath.startsWith(UPLOAD_ROOT)) {
    throw new Error("Invalid upload path");
  }

  return {
    absolutePath,
    normalizedRelativePath,
  };
}

export function getMimeTypeForUpload(filePath: string) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

function extensionFromType(type: string) {
  return Object.entries(MIME_TYPES).find(([, mimeType]) => mimeType === type)?.[0] ?? "";
}

export async function saveScreenshot(file: File, userId: string) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are allowed.");
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Image size must be 5MB or less.");
  }

  const extension = path.extname(file.name).toLowerCase() || extensionFromType(file.type);

  if (!Object.keys(MIME_TYPES).includes(extension)) {
    throw new Error("Unsupported image type. Use PNG, JPG, JPEG, GIF, or WebP.");
  }

  const relativePath = path.posix.join("trades", userId, `${crypto.randomUUID()}${extension}`);
  const { absolutePath } = resolveUploadPath(relativePath);
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, buffer);

  return `/api/uploads/${relativePath}`;
}

export async function deleteUploadByUrl(uploadUrl?: string | null) {
  if (!uploadUrl || !uploadUrl.startsWith("/api/uploads/")) {
    return;
  }

  const relativePath = uploadUrl.replace("/api/uploads/", "");
  const { absolutePath } = resolveUploadPath(relativePath);

  try {
    await unlink(absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

export function getUploadAbsolutePath(slug: string[]) {
  return resolveUploadPath(slug.join("/")).absolutePath;
}
