import express from "express";
import cors from "cors";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import upload from "./middlewares/multer.middleware.js";

const app = express();

const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true)
        } else {
            callback(new Error("Not Allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

import jobRouter from "./routes/job.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import applicationRouter from "./routes/application.routes.js";
import mailRouter from "./routes/mail.routes.js";
import webHookRouter from "./routes/webhook.routes.js";
// import healthRouter from "./routes/health.routes.js";
import mainRouter from "./routes/main.routes.js";

// app.use(healthRouter);
app.use("/api/main", mainRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/mails", mailRouter);
app.use("/webhooks", upload.none(), webHookRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
