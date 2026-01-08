import mongoose from "mongoose";
import config from "../config/env.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(config.mongoUri);
    if (!connectionInstance) console.log(` MongoDb connection failed `);

    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host} !! ${connectionInstance.connection.name}`
    );
  } catch (error) {
    console.log(" MongoDB connection failed: ", error);
    process.exit(1);
  }
};

export default connectDb;
