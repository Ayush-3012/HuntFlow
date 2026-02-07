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

  sendGrid: process.env.SENDGRID_API_KEY,
  sendGridEmail: process.env.SENDGRID_FROM_EMAIL,

  openrouterkey: process.env.OPENROUTER_API_KEY,

  region: process.env.AWS_REGION,
  bucket: process.env.AWS_S3_BUCKET,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

export default config;
