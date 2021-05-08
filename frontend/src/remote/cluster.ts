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

export async function fetchClusterNodes(clusterId: string): Promise<NodeResp[]> {
    return (await axiosInst.get<NodeResp[]>(`/cluster/${clusterId}/node`)).data;
}

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
    await axiosInst.put(`/cluster/${clusterId}/member`, { params: { login } });
}

export async function fetchClusterMembers(clusterId: string): Promise<string[]> {
    return (await axiosInst.get(`/cluster/${clusterId}/member`)).data;
}
