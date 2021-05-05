import { Column, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Node } from "./Node";
import { User } from "./User";

export class Cluster {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    name!: string;

    @ManyToOne(() => User, (user) => user.ownClusters)
    owner!: User;

    @ManyToMany(() => User, (user) => user.memberedClusters)
    members!: User[];

    @OneToMany(() => Node, (node) => node.cluster)
    nodes!: Node[];
}
