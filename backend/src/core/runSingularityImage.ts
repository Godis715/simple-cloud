import { Client, ClientChannel } from "ssh2";

export async function runSingularityImage(conn: Client, imageRemotePath: string): Promise<ClientChannel> {
    return new Promise((res, rej) => {
        conn.exec(
            `singularity run --pwd / ${imageRemotePath}`,
            (err, stream) => {
                if (err) {
                    rej(err);
                    return;
                }
    
                res(stream);
            }
        );
    });
}
