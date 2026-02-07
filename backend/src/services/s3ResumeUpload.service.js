import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Client.js";
import config from "../config/env.js";

export const uploadResumePdf = async ({ resumeId, version, pdfBuffer }) => {
  const key = `resumes/${resumeId}/Ayush_Kumar-Resume-${version}.pdf`;

  await s3.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: pdfBuffer,
      contentType: "application/pdf",
    }),
  );

  const fileUrl = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;

  return fileUrl;
};
