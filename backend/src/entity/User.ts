import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany
} from "typeorm";
import { Cluster } from "./Cluster";
import { Job } from "./Job";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    login!: string;

    @Column()
    passwordHash!: string;

    @Column()
    isAdmin!: boolean

    @OneToMany(() => Cluster, (cluster) => cluster.owner)
    ownClusters!: Cluster[];

    @ManyToMany(() => Cluster, (cluster) => cluster.members)
    memberedClusters!: Cluster[];

    @OneToMany(() => Job, (job) => job.author)
    jobs!: Job[];
}
