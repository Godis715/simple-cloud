import { exec } from "child_process";
import { resolve } from "path";

export async function copyScripts(username: string, host: string, port: number, keyPath: string): Promise<void> {
    const script = resolve("src/scripts", "copy-scripts.sh");

    return new Promise((res, rej) => {
        exec(
            `sudo sh ${script} ${username} ${host} ${port} ${keyPath}`,
            {
    
            },
            (error, stdout, stderr) => {
                if (error) {
                    console.error('[copyScripts::error]:', stderr);
                    rej(error);
                    return;
                }
                console.log('[copyScripts::result]:', stdout);
                res();
            }
        );
    });
}
