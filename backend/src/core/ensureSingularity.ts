import { Client } from "ssh2";

const WORKDIR = "/tmp/scripts"

async function checkSingularity(conn: Client): Promise<boolean> {
    return new Promise((res, rej) => {
        conn.exec(
            `${WORKDIR}/check-command.sh singularity`,
            (err, stream) => {
                if (err) {
                    rej(err);
                    return;
                }

                stream
                    .on('close', (code: number) => {
                        // script returns 0 exit code, if singularity exists
                        res(code === 0);
                    })
                    .on('data', (data: string) => console.log(data.toString()))
                    .stderr.on('data', (data) => console.error(data.toString()));
            }
        );
    });
}

async function installSingularity(conn: Client): Promise<void> {
    return new Promise((res, rej) => {
        conn.exec(`${WORKDIR}/install-singularity.sh`, (err, stream) => {
            if (err) {
                rej(err);
                return;
            }

            stream
                .on('close', (code: number) => {
                    if (code === 0) {
                        res();
                    }
                    else {
                        rej();
                    }
                })
                .on('data', (data: string) => {
                    console.log(data.toString());
                })
                .stderr.on('data', (data) => {
                    console.error(data.toString());
                });
        });
    });
}

export async function ensureSingularity(conn: Client): Promise<void> {
    const isExist = await checkSingularity(conn);
    console.log(isExist);
    if (!isExist) {
        await installSingularity(conn);
    }
}
