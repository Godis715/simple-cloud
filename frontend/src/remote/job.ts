import axiosInst from "./__axiosInst";
import io from "socket.io-client";

const socket = io("http://localhost:8000", {
    withCredentials: true
});
socket.on("connect", () => {
    console.log("Socket connected check", socket.connected);
});

export type JobStatus = "in-process" | "succeed" | "failed";
export type JobInfoResponse = {
    id: string,
    status: JobStatus
};

export async function fetchAllJobs(): Promise<JobInfoResponse[]> {
    return (await axiosInst.get("/job")).data;
}

export type JobResponse = {
    id: string,
    status: JobStatus,
    output?: string
};

export async function fetchJob(jobId: string): Promise<JobResponse> {
    return (await axiosInst.get(`/job/${jobId}`)).data;
}

export function subscribeJobOutput(
    jobId: string,
    prevOutputListener: (output: string) => void,
    outputListener: (output: string) => void
): void {
    socket.on("previous-job-output", prevOutputListener);
    socket.on("job-output", outputListener);

    socket.emit("subscribe-job-output", { jobId });
}

export function unsubscribeJobOutput(jobId: string): void {
    socket.emit("unsubscribe-job-output", { jobId });
}

export type SubmitJobResp = {
    jobId: string;
};

export async function postJob(clusterId: string, file: File): Promise<SubmitJobResp> {
    const formData = new FormData();
    formData.append("dockerfile", file);

    return (await axiosInst.post<SubmitJobResp>("/job", formData, { params: { clusterId } })).data;
}
