import { exec } from "child_process";
import { resolve } from "path";

export async function sendSingularityImage(
    username: string,
    host: string,
    port: number,
    keyPath: string,
    source: string,
    dest: string
): Promise<void> {
    const script = resolve("src/scripts", "ssh-copy.sh");

    return new Promise((res, rej) => {
        exec(
            `sh ${script} ${username} ${host} ${port} ${keyPath} ${source} ${dest}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error('[sendSingularityImage::error]:', stderr);
                    rej(error);
                    return;
                }
                console.log('[sendSingularityImage::result]:', stdout);
                res();
            }
        );
    });
}
