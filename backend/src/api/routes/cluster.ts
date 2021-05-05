import express, { response } from "express";
import { getRepository } from "typeorm";
import { SSH_PRIVATE_KEY_PATH } from "../../config";
import { copyScripts } from "../../core/copyScripts";
import { Cluster } from "../../entity/Cluster";
import { Node } from "../../entity/Node";
import { User } from "../../entity/User";
const clusterRouter = express.Router();

type PostClusterRequestBody = {
    name: string
};

type PostClusterResponseBody = {
    clusterId: string
};

clusterRouter.post<never, PostClusterResponseBody, PostClusterRequestBody>("/", async (
    request,
    response
) => {
    const user = response.locals.user as User;
    if (!user?.isAdmin) {
        response.sendStatus(403);
        return;
    }

    const cluster = new Cluster();
    cluster.name = request.body.name;
    cluster.owner = user;
    cluster.members = [user];
    
    try {
        await getRepository(Cluster).save(cluster);
        response
            .status(200)
            .send({
                clusterId: cluster.id
            });
    }
    catch (err) {
        console.error("[Server::postCluster::error", err);
        response.sendStatus(400);
    }
});

type GetClusterResponseBody = {
    id: string,
    name: string
}[];

clusterRouter.get<never, GetClusterResponseBody>("/own", async (
    request,
    response
) => {
    const user = response.locals.user as User;
    if (!user?.isAdmin) {
        response.sendStatus(403);
        return;
    }
    
    try {
        const _user = await getRepository(User)
            .findOne(user, { relations: ["ownClusters"] });
        
        if (!_user) {
            response.sendStatus(401);
            return;
        }
        
        const clusters = _user.ownClusters;

        response
            .status(200)
            .send(clusters.map(
                (c) => ({
                    id: c.id,
                    name: c.name
                })
            ));
    }
    catch (err) {
        console.error("[Server::getOwnClusters::error", err);
        response.sendStatus(400);
    }
});

clusterRouter.get<never, GetClusterResponseBody>("/membered", async (
    request,
    response
) => {
    const user = response.locals.user as User;

    try {
        const _user = await getRepository(User)
            .findOne(user, { relations: ["memberedClusters"] });
        
        if (!_user) {
            response.sendStatus(401);
            return;
        }
        
        const clusters = _user.memberedClusters;

        response
            .status(200)
            .send(clusters.map(
                (c) => ({
                    id: c.id,
                    name: c.name
                })
            ));
    }
    catch (err) {
        console.error("[Server::getMemberedClusters::error", err);
        response.sendStatus(400);
    }
});

type AppendNodeRequestBody = {
    username: string,
    host: string,
    port: number
};

type ClusterParams = {
    clusterId: string
};

type GetNodeResponseBody = {
    nodes: {
        id: string,
        host: string,
        username: string,
        port: number
    }[]
};

clusterRouter.post<ClusterParams, GetNodeResponseBody, AppendNodeRequestBody>("/:clusterId/node", async (
    request,
    response
) => {
    const { clusterId } = request.params;
    const user = response.locals.user as User;
    if (!user?.isAdmin) {
        response.sendStatus(403);
        return;
    }

    const clusterRepository = getRepository(Cluster);

    const cluster = await clusterRepository.findOne(clusterId, {
        relations: ["nodes", "owner"]
    });

    if (!cluster) {
        response.sendStatus(404);
        return;
    }

    if (user.id !== cluster.owner.id) {
        response.sendStatus(403);
        return;
    }

    const {
        host,
        username,
        port
    } = request.body;

    // init node

    try {
        await copyScripts(username, host, port, SSH_PRIVATE_KEY_PATH);
    }
    catch (err) {
        console.error("[Server::appendNode::error", err);
        response.sendStatus(400);
        return;
    }

    const node = new Node();
    node.host = host;
    node.username = username;
    node.port = port;
    node.cluster = cluster;

    cluster.nodes.push(node);
    
    try {
        await clusterRepository.save(cluster);
        await getRepository(Node).save(node);

        response
            .status(200)
            .send({
                nodes: cluster.nodes.map((n) => ({
                    id: n.id,
                    username: n.username,
                    host: n.host,
                    port: n.port
                }))
            });
    }
    catch (err) {
        console.error("[Server::appendNode::error", err);
        response.sendStatus(400);
    }
});

clusterRouter.get<ClusterParams, GetNodeResponseBody>("/:clusterId/node", async (
    request,
    response
) => {
    const { clusterId } = request.params;
    const user = response.locals.user as User;
    if (!user?.isAdmin) {
        response.sendStatus(403);
        return;
    }

    const clusterRepository = getRepository(Cluster);

    const cluster = await clusterRepository.findOne(clusterId, {
        relations: ["nodes", "owner"]
    });

    if (!cluster) {
        response.sendStatus(404);
        return;
    }

    if (user.id !== cluster.owner.id) {
        response.sendStatus(403);
        return;
    }
    
    response
        .status(200)
        .send({
            nodes: cluster.nodes.map((n) => ({
                id: n.id,
                username: n.username,
                host: n.host,
                port: n.port
            }))
        });
});

export default clusterRouter;
