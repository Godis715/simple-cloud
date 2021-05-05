import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./User";

export enum JobStatus {
    IN_PROCESS = "in-process",
    SUCCEED = "succeed",
    FAILED = "failed"
}

@Entity()
export class Job {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, (user) => user.jobs)
    author!: User;

    @Column({ type: "text" })
    status!: JobStatus;

    @Column({ nullable: true })
    output?: string;
}
