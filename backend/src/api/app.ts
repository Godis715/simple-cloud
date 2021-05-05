import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createConnection } from "typeorm";
import authRouter from "./routes/auth";
import clusterRouter from "./routes/cluster";
import withUser from "./middlewares/withUser";

const PORT = 8000;
const ORIGIN = "http://localhost:3000";

/**
 * Для работы с typeorm требуется лишь один раз создать соединение
 * Закрывать соединение не обязательно, согласно документации
 */
createConnection()
    .then(() => {
        console.log("[Server]: DB is connected");
    })
    .catch((err) => {
        console.error(err);
    });

const app = express()
    // чтобы работать с телом запроса
    .use(express.json())
    // чтоб работать с параметрами запроса
    .use(express.urlencoded({ extended: false }))
    // чтобы работать с куки ответа
    .use(cookieParser())
    .use(cors({
        origin: "*",
        credentials: true,
        exposedHeaders: ["Content-Disposition"]
    }));

app.use("/auth", authRouter);
app.use("/cluster", withUser, clusterRouter);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
