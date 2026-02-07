import { S3Client } from "@aws-sdk/client-s3";
import config from "./env.js";

export const s3 = new S3Client({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});
