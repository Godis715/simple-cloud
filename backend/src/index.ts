import { resolve } from "path";
import runRemoteJob from "./core/runRemoteJob";

runRemoteJob(
    "root",
    "localhost",
    49154,
    "/home/denis/Godis/footloose/cluster-key",
    resolve("data")
).then(
    (stream) => {
        stream.on("data", (data) => console.log(data.toString()))
    }
);
