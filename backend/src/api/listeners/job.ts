import { Socket } from "socket.io";
import { getRepository } from "typeorm";
import { Job } from "../../entity/Job";
import { User } from "../../entity/User";
import jobOutputStore from "../../store/jobOutputStore";

type SubscribeJobData = {
    jobId: string
};

export async function handleSubscribeJobOutput(
    socket: Socket,
    user: User,
    data: SubscribeJobData
): Promise<void> {
    const { jobId } = data;
    const jobRepository = getRepository(Job);

    const job = await jobRepository.findOne(jobId, { relations: ["author"] });
    if (!job || job.author.id !== user.id) {
        return;
    }

    try {
        const previousOutput = jobOutputStore.getOutput(jobId);
        socket.emit("previous-job-output", previousOutput);
        socket.join(`job:${jobId}`);
    }
    catch (err) {
        return;
    }

}

export async function handleUnsubscribeJobOutput(
    socket: Socket,
    user: User,
    data: SubscribeJobData
): Promise<void> {
    const { jobId } = data;
    const jobRepository = getRepository(Job);

    const job = await jobRepository.findOne(jobId, { relations: ["author"] });
    if (!job || job.author.id !== user.id) {
        return;
    }

    socket.leave(`job:${jobId}`);
}
