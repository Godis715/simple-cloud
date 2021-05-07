import axiosInst from "./__axiosInst";

export type JobStatus = "in-process" | "succeed" | "failed";
export type JobInfoResponse = {
    id: string,
    status: JobStatus
};

export async function fetchAllJobs(): Promise<JobInfoResponse[]> {
    return (await axiosInst.get("/job")).data;
}
