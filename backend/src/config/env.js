const requiredEnvVars = ["PORT"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV || "development",
};

export default config;
