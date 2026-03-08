import dotenv from "dotenv";
dotenv.config();
const requiredEnvVars = ["PORT"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,

  openrouterkey: process.env.OPENROUTER_API_KEY,

  region: process.env.AWS_REGION,
  bucket: process.env.AWS_S3_BUCKET,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFromEmail: process.env.SMTP_FROM_EMAIL,
  smtpFromName: process.env.SMTP_FROM_NAME || "HuntFlow",
};

export default config;
