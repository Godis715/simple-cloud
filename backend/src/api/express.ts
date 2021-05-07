import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth";
import clusterRouter from "./routes/cluster";
import withUser from "./middlewares/withUser";
import fileUpload from "express-fileupload";
import jobRouter from "./routes/job";

const app = express()
    // чтобы работать с телом запроса
    .use(express.json())
    // чтоб работать с параметрами запроса
    .use(express.urlencoded({ extended: false }))
    // чтобы работать с куки ответа
    .use(cookieParser())
    .use(fileUpload())
    .use(cors({
        origin: "*",
        credentials: true,
        exposedHeaders: ["Content-Disposition"]
    }));

app.use("/auth", authRouter);
app.use("/cluster", withUser, clusterRouter);
app.use("/job", withUser, jobRouter);

export default app;
