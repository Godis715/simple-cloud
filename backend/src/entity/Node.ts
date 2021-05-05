import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Cluster } from "./Cluster";

@Entity()
export class Node {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Cluster, (cluster) => cluster.nodes)
    cluster!: Cluster;

    @Column()
    username!: string;

    @Column()
    host!: string;

    @Column()
    port!: number;
}
