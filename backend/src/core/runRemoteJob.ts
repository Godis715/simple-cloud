import { resolve } from "path";
import { dockerToSingularity } from "./dockerToSingularity";
import { v4 as uuidv4 } from "uuid";
import { Client, ClientChannel } from "ssh2";
import { sendSingularityImage } from "./sendSingularityImage";
import { ensureSingularity } from "./ensureSingularity";
import { readFileSync } from "fs";
import { runSingularityImage } from "./runSingularityImage";

export default async function runRemoteJob(
    username: string,
    host: string,
    port: number,
    keyPath: string,
    dirPath: string
): Promise<ClientChannel> {
    console.log("[rumRemoteJob]: Started");
    console.log("[rumRemoteJob]: username: ", username);
    console.log("[rumRemoteJob]: host: ", host);
    console.log("[rumRemoteJob]: port: ", port);
    console.log("[rumRemoteJob]: keyPath: ", keyPath);
    console.log("[rumRemoteJob]: dirPath: ", dirPath);

    try {
        // 0. connect to node
        const conn = new Client();
        await new Promise<void>((res, rej) => {
            conn
                .on("ready", res)
                .on("error", rej)
                .connect({
                    host,
                    port,
                    username,
                    privateKey: readFileSync(keyPath)
                });
        });
        console.log("[rumRemoteJob]: connected to node");

        // 1. convert dockerfile to singulairty
        await dockerToSingularity(dirPath);
        console.log("[rumRemoteJob]: converted dockerfile to singularity");

        const singImagePath = resolve(dirPath, "image.sif")

        // 2. generate name for singularity file
        const singUniqueName = `${uuidv4()}.sif`;
        console.log("[rumRemoteJob]: singularity unique name", singUniqueName);

        // 3. send singularity file
        await sendSingularityImage(
            username,
            host,
            port,
            keyPath,
            singImagePath,
            singUniqueName
        );
        console.log("[rumRemoteJob]: sent sibgularity file");

        // 4. ensure that singaulrity exists
        await ensureSingularity(conn);
        console.log("[rumRemoteJob]: eunsured that singularity installed");

        // 5. run singularity image
        const outputStream = await runSingularityImage(conn, `/tmp/${singUniqueName}`);
        console.log("[rumRemoteJob]: started singularity job");

        outputStream.stderr.on("data", (data) => console.error(data.toString()));

        return outputStream;
    }
    catch (err) {
        console.error(err.toString());
        throw err;
    }
}
