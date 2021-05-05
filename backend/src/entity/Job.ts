import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export enum JobStatus {
    IN_PROCESS = "in-process",
    SUCCEED = "succeed",
    FAILED = "failed"
}

export class Job {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, (user) => user.jobs)
    author!: User;

    @Column({ type: "string" })
    status!: JobStatus;

    @Column({ nullable: true })
    output?: string;
}
