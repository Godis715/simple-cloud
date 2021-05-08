import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import { ClusterInfoResp, fecthOwnClusters } from "../../remote/cluster";
import TextField from "@material-ui/core/TextField";
import "./ClustersExplorerPage.scss";

export default function ClustersExplorerPage(): JSX.Element {
    const [clusters, setClusters] = useState<ClusterInfoResp[] | null>(null);
    const [isFetchingClusters, setIsFetchingClusters] = useState(false);
    const [clustersError, setClustersError] = useState<Error | null>(null);

    const [clusterName, setClusterName] = useState("");

    const history = useHistory();

    useEffect(() => {
        setIsFetchingClusters(true);

        fecthOwnClusters()
            .then(setClusters)
            .catch(setClustersError)
            .finally(() => setIsFetchingClusters(false));
    }, []);

    return (
        <div className="ClustersExplorerPage">
            <Typography variant="h5" gutterBottom style={{ marginLeft: "16px" }}>
                Список кластеров
            </Typography>
            <List>
                <ListItem divider className="ClustersExplorerPage-ListItem">
                    <TextField
                        size="small"
                        label="Название кластера"
                        value={clusterName}
                        onChange={(ev) => setClusterName(ev.target.value)}
                    />
                    <div />
                    <Button variant="contained" disabled={!clusterName}>Добавить</Button>
                </ListItem>
                {clusters?.map((c) => (
                    <ListItem divider className="ClustersExplorerPage-ListItem">
                        <Typography>{c.name}</Typography>
                        <div />
                        <Button
                            variant="outlined"
                            onClick={() => {
                                history.push(`/cluster/${c.id}`)
                            }}
                        >
                            Открыть
                        </Button>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
