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
};

export default config;
