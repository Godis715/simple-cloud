class JobOutputStore {
    private store: Record<string, string> = {};

    newJob(jobId: string): void {
        this.store[jobId] = "";
    }

    append(jobId: string, data: string): void {
        if (this.store[jobId] === undefined) {
            throw Error(`Job ${jobId} is not initialized!`);
        }
        this.store[jobId] += data;
    }

    remove(jobId: string): void {
        if (this.store[jobId] === undefined) {
            throw Error(`Job ${jobId} is not initialized!`);
        }
        delete this.store[jobId];
    }

    getOutput(jobId: string): string {
        if (this.store[jobId] === undefined) {
            throw Error(`Job ${jobId} is not initialized!`);
        }
        return this.store[jobId];
    }
}

export default new JobOutputStore();
