import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(healthRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
export default app;
