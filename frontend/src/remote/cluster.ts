import axiosInst from "./__axiosInst";

export type ClusterInfoResp = {
    id: string,
    name: string
};

export async function fecthMemberedClusters(): Promise<ClusterInfoResp[]> {
    return (await axiosInst.get<ClusterInfoResp[]>("/cluster/membered")).data;
}

export async function fecthOwnClusters(): Promise<ClusterInfoResp[]> {
    return (await axiosInst.get<ClusterInfoResp[]>("/cluster/own")).data;
}

export type NodeResp = {
    host: string,
    port: number,
    username: string
};

export type AppendNodeResponse = {
    nodes: NodeResp[]
};

export async function appendNode(clusterId: string, node: NodeResp): Promise<AppendNodeResponse> {
    return (await axiosInst.post(
        `/cluster/${clusterId}/node`,
        node
    )).data.nodes;
}

export async function appendUser(clusterId: string, login: string): Promise<void> {
    await axiosInst.put(`/cluster/${clusterId}/member/${login}`);
}

export type ClusterResp = {
    id: string,
    name: string,
    members: string[],
    nodes: NodeResp[]
}

export async function fetchCluster(clusterId: string): Promise<ClusterResp> {
    return (await axiosInst.get<ClusterResp>(`/cluster/${clusterId}`)).data;
}

export async function createCluster(clusterName: string): Promise<string> {
    return (await axiosInst.post<{ clusterId: string }>(`/cluster`, { name: clusterName })).data.clusterId;
}
