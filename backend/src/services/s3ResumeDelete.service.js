import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Client.js";
import config from "../config/env.js";

const getS3KeyFromUrl = (fileUrl) => {
  try {
    const parsed = new URL(fileUrl);
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
};

export const deleteResumePdfByUrl = async (fileUrl) => {
  const key = getS3KeyFromUrl(fileUrl);
  if (!key || !config.bucket) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  );
};
