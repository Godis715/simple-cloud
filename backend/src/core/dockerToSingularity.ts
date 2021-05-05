import { spawn } from "child_process";
import { resolve } from "path";

export async function dockerToSingularity(dirPath: string): Promise<void> {
    const script = resolve("src/scripts", "docker-to-singularity.sh");

    return new Promise((res, rej) => {
        const process = spawn(`sh`, [script, dirPath]);
        process.stdout.on("data", (data) => console.log(data.toString()));
        process.stderr.on("data", (data) => console.error(data.toString()));
        process.on("exit", (code) => {
            if (code === 0) {
                res();
            }
            else {
                rej();
            }
        });

    });
}
