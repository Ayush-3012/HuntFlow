import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import config from "./config/env.js";

app.listen(config.port, () => {
  console.log(`Server is listening to server ${config.port}`);
});
