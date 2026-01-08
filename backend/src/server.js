import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import config from "./config/env.js";
import connectDb from "./db/connectDb.js";

connectDb()
  .then(() => {
    app.listen(config.port, () => {
      console.log(` Server is listening to server ${config.port}`);
    });
  })
  .catch((err) => console.log(" MongoDB connection failed: ", err));
