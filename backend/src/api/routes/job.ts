import express from "express";
import { getRepository } from "typeorm";
import { SSH_PRIVATE_KEY_PATH } from "../../config";
import runRemoteJob from "../../core/runRemoteJob";
import { Cluster } from "../../entity/Cluster";
import { Job, JobStatus } from "../../entity/Job";
import { User } from "../../entity/User";
import { resolve } from "path";
import jobOutputStore from "../../store/jobOutputStore";
import io from "../socket";
import fs from "fs";
import { UploadedFile } from "express-fileupload";

const jobRouter = express.Router();

type PostJobQueryParams = {
    clusterId: string
};

type PostJobResponseBody = {
    jobId: string
};

jobRouter.post<never, PostJobResponseBody, never, PostJobQueryParams>("/", async (
    request,
    response
) => {
    const dockerfile = request.files?.dockerfile;
    if (!dockerfile) {
        response.sendStatus(400);
        return;
    }

    const { clusterId } = request.query;
    if (!clusterId) {
        response.sendStatus(400);
        return;
    }

    const user = response.locals.user as User;
    const cluster = await getRepository(Cluster).findOne(clusterId, { relations: ["members", "nodes"] });
    if (!cluster) {
        response.sendStatus(404);
        return;
    }

    if (!cluster.members.some((u) => u.id === user.id)) {
        response.sendStatus(403);
        return;
    }

    const { nodes } = cluster;
    const randIdx = Math.floor(nodes.length * Math.random()) % nodes.length;
    const node = nodes[randIdx];
    
    const jobRepository = getRepository(Job);
    const job = new Job();
    job.author = user;
    job.status = JobStatus.IN_PROCESS;
    await jobRepository.save(job);

    jobOutputStore.newJob(job.id);

    const jobDirName = `${cluster.name}--${job.id}`;
    const jobDirPath = resolve("data", jobDirName);

    await new Promise<void>((res, rej) => {
        fs.mkdir(jobDirPath, (err) => {
            if (err) {
                rej(err);
                return;
            }
            res();
        });
    });

    const dockerFilePath = resolve(jobDirPath, "Dockerfile");
    await (dockerfile as UploadedFile).mv(dockerFilePath);

    runRemoteJob(
        node.username,
        node.host,
        node.port,
        SSH_PRIVATE_KEY_PATH,
        jobDirPath
    ).then(
        (stream) => {
            stream.stdout.on("data", (data: Buffer) => {
                const str = data.toString();
                jobOutputStore.append(job.id, str);
                io.to(`job:${job.id}`).emit("job-output", str);
            });

            stream.stderr.on("data", (data: Buffer) => {
                const str = data.toString();
                jobOutputStore.append(job.id, str);
                io.to(`job:${job.id}`).emit("job-output", str);
            });

            stream.on("close", async () => {
                job.status = JobStatus.SUCCEED;
                job.output = jobOutputStore.getOutput(job.id);
                await jobRepository.save(job);
            });
        }
    );

    response
        .status(200)
        .send({
            jobId: job.id
        });
});

jobRouter.get<never, string[]>("/", async (_, response) => {
    const user = response.locals.user as User;

    try {
        const _user = await getRepository(User).findOne(user, { relations: ["jobs"] });
        
        if (!_user) {
            response.sendStatus(401);
            return;
        }
        
        const jobs = _user.jobs;

        response
            .status(200)
            .send(jobs.map((j) => j.id));
    }
    catch (err) {
        console.error("[Server::getJobs::error", err);
        response.sendStatus(400);
    }
});

type GetJobResponseBody = {
    id: string,
    status: JobStatus,
    output?: string
};

type GetJobParams = {
    jobId: string
};

jobRouter.get<GetJobParams, GetJobResponseBody>("/:jobId", async (request, response) => {
    const user = response.locals.user as User;
    const { jobId } = request.params;

    try {
        const job = await getRepository(Job).findOne(jobId, { relations: ["author"] });

        if (!job) {
            response.sendStatus(404);
            return;
        }

        if (job.author.id !== user.id) {
            response.sendStatus(403);
            return;
        }
        
        response
            .status(200)
            .send({
                id: job.id,
                status: job.status,
                output: job.output
            });
    }
    catch (err) {
        console.error("[Server::getJob::error", err);
        response.sendStatus(400);
    }
});

export default jobRouter;
