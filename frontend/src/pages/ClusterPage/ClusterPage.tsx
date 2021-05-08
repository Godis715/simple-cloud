import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { appendNode, appendUser, ClusterResp, fetchCluster } from "../../remote/cluster";
import "./ClusterPage.scss";

export default function ClusterPage(): JSX.Element {
    const { clusterId } = useParams<{ clusterId: string }>();
    const [cluster, setCluster] = useState<ClusterResp | null>(null);
    const [clusterError, setClusterError] = useState<Error | null>(null);
    const [isFetchingCluster, setIsFecthingCluster] = useState(false);

    const [username, setUsername] = useState("");
    const [host, setHost] = useState("");
    const [port, setPort] = useState("");
    const [login, setLogin] = useState("");

    const [isSubmittingNode, setIsSubmittingNode] = useState(false);
    const [isSubmittingUser, setIsSubmittingUser] = useState(false);

    useEffect(() => {
        setIsFecthingCluster(true);

        fetchCluster(clusterId)
            .then(setCluster)
            .catch(setClusterError)
            .finally(() => setIsFecthingCluster(false));

    }, [clusterId]);

    const onNodeSubmit = () => {
        if (!username || !host || !port) {
            return;
        }

        setIsSubmittingNode(true);

        const node = { username, host, port: parseInt(port) };
        appendNode(clusterId, node)
            .then(() => {
                setCluster((c) => c
                ? {
                    ...c,
                    nodes: [node, ...c.nodes]
                }
                : c);
            })
            .catch((err) => console.error(err))
            .finally(() => setIsSubmittingNode(false));
    };

    const onLoginSubmit = () => {
        if (!login) {
            return;
        }

        setIsSubmittingUser(true);
        appendUser(clusterId, login)
            .then(() => {
                setCluster((c) => c
                ? {
                    ...c,
                    members: [login, ...c.members]
                }
                : c);
            })
            .catch((err) => console.error(err))
            .finally(() => setIsSubmittingUser(false));
    }

    return (
        <div className="ClusterPage">
            <Typography variant="h5" gutterBottom style={{ marginLeft: "16px" }}>
                Cluster "{cluster?.name || ''}"
            </Typography>
            <div>
                <Typography variant="h6" gutterBottom style={{ marginLeft: "16px" }}>
                    Nodes
                </Typography>

                <List>
                    <ListItem className="ClusterPage-NewNode">
                        <TextField
                            size="small"
                            label="Username"
                            value={username}
                            onChange={(ev) => setUsername(ev.target.value)}
                        />
                        <Typography>@</Typography>
                        <TextField
                            size="small"
                            label="Host"
                            value={host}
                            onChange={(ev) => setHost(ev.target.value)}
                        />
                        <TextField
                            size="small"
                            label="Port"
                            type="number"
                            value={port}
                            onChange={(ev) => setPort(ev.target.value)}
                        />
                        <Button
                            variant="contained"
                            disabled={!username || !host || !port || isSubmittingNode}
                            onClick={onNodeSubmit}
                        >
                            {isSubmittingNode ? "Loading..." : "Add"}
                        </Button>
                    </ListItem>
                    {cluster?.nodes.map((n, i) => (
                        <ListItem className="ClusterPage-Node">
                            <Typography style={{ marginRight: "16px" }}>Node {i + 1}.</Typography>
                            <Typography
                                style={{ marginRight: "16px" }}
                            >Connection data</Typography>
                            <Typography>{n.username}@{n.host} -p {n.port}</Typography>
                        </ListItem>
                    ))}
                </List>
            </div>
            <div>
                <Typography variant="h6" gutterBottom style={{ marginLeft: "16px" }}>
                    Members
                </Typography>

                <List>
                    <ListItem>
                        <TextField
                            label="User's login"
                            size="small"
                            value={login}
                            onChange={(ev) => setLogin(ev.target.value)}
                        />
                        <Button
                            variant="contained"
                            className="ClusterPage-AddMember"
                            disabled={!login || isSubmittingUser}
                            onClick={onLoginSubmit}
                        >
                            {isSubmittingUser ? "Loading..." : "Add"}
                        </Button>
                    </ListItem>
                    {cluster?.members.map((member) => (
                        <ListItem>
                            <Typography>@{member}</Typography>
                            <div />
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>
    );
}
