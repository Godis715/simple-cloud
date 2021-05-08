import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { fetchAllJobs, JobInfoResponse, JobStatus, postJob } from "../../remote/job";
import "./JobsExplorerPage.scss";
import { useHistory } from "react-router-dom";
import { fecthMemberedClusters, ClusterInfoResp } from "../../remote/cluster";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";

function jobStatusToLabel(status: JobStatus): string {
    if (status === "in-process") {
        return "In process";
    }

    if (status === "succeed") {
        return "Completed";
    }

    return "Error";
}

function formatTime(date: Date): string {
    return `${date.toLocaleDateString("ru")} ${date.toLocaleTimeString("ru")}`;
}

export default function JobsExplorerPage(): JSX.Element {
    const [jobs, setJobs] = useState<JobInfoResponse[] | null>(null);
    const [isFetchingJobs, setIsFetchingJobs] = useState(false);
    const [jobError, setJobError] = useState<Error | null>(null);

    const [clusters, setClusters] = useState<ClusterInfoResp[] | null>(null);
    const [isFetchingClusters, setIsFetchingClusters] = useState(false);
    const [clusterError, setClusterError] = useState<Error | null>(null);

    const [cluster, setCluster] = useState("");

    const [file, setFile] = useState<File | null>(null);

    const history = useHistory();

    useEffect(() => {
        setIsFetchingJobs(true);
        setIsFetchingClusters(true);

        fetchAllJobs()
            .then(setJobs)
            .catch(setJobError)
            .finally(() => setIsFetchingJobs(false));

        fecthMemberedClusters()
            .then(setClusters)
            .catch(setClusterError)
            .finally(() => setIsFetchingClusters(false));
    }, []);

    const submitJob = () => {
        if (!file || !cluster) {
            return;
        }

        postJob(cluster, file)
            .then((res) => history.push(`/job/${res.jobId}`))
            .catch((err) => console.error(err));
    };
    
    return (
        <div className="JobsExplorerPage">
            <Typography variant="h5" gutterBottom style={{ marginLeft: "16px" }}>
                Jobs
            </Typography>
            <List>
                <ListItem divider className="JobsExplorerPage-UploadDockerfile">
                    <Typography>New job</Typography>
                    <Select
                        id="select-cluster"
                        onChange={(ev) => setCluster(ev.target.value)}
                        size="small"
                        value={cluster}
                        style={{ minWidth: "15em" }}
                    >
                        {clusters?.map((c) => (
                            <MenuItem value={c.id}>{c.name}</MenuItem>
                        ))}
                    </Select>
                    <div>
                        <input
                            type="file"
                            id="dockerfile-upload"
                            onChange={(ev) => setFile(ev.target.files?.item(0) || null)}
                            style={{ display: "none" }}
                        />
                        <Button
                            component="label"
                            htmlFor="dockerfile-upload"
                            style={{ textTransform: "none" }}
                        >
                            {file ? file.name : "CHOOSE DOCKERFILE"}
                        </Button>
                    </div>
                    <Button
                        variant="contained"
                        disabled={!file || !cluster}
                        onClick={submitJob}
                    >
                        Submit
                    </Button>
                </ListItem>
                {jobs?.map((j) => (
                    <ListItem divider className="JobsExplorerPage-ListItem">
                        <Typography>{jobStatusToLabel(j.status)}</Typography>
                        <Typography variant="caption" color="textSecondary">
                            {formatTime(new Date())}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                history.push(`/job/${j.id}`)
                            }}
                        >
                            Open
                        </Button>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
