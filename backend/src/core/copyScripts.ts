import { exec } from "child_process";
import { resolve } from "path";

export async function copyScripts(username: string, host: string, port: number, keyPath: string): Promise<void> {
    const script = resolve("src/scripts", "copy-scripts.sh");
    exec(
        `sudo sh ${script} ${username} ${host} ${port} ${keyPath}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error('[copyScripts::error]:', stderr);
                throw error;
            }
            console.log('[copyScripts::result]:', stdout);
        }
    );
}

copyScripts("root", "localhost", 49154, "/home/denis/Godis/footloose/cluster-key");
