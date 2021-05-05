import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Node } from "./Node";
import { User } from "./User";

@Entity()
export class Cluster {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    name!: string;

    @ManyToOne(() => User, (user) => user.ownClusters)
    owner!: User;

    @ManyToMany(() => User, (user) => user.memberedClusters)
    @JoinTable()
    members!: User[];

    @OneToMany(() => Node, (node) => node.cluster)
    nodes!: Node[];
}
