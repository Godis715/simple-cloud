import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { fetchAllJobs, JobInfoResponse, JobStatus } from "../../remote/job";
import "./JobsExplorerPage.scss";
import { useHistory } from "react-router-dom";

function jobStatusToLabel(status: JobStatus): string {
    if (status === "in-process") {
        return "В процессе";
    }

    if (status === "succeed") {
        return "Завершено";
    }

    return "Ошибка";
}

function formatTime(date: Date): string {
    return `${date.toLocaleDateString("ru")} ${date.toLocaleTimeString("ru")}`;
}

export default function JobsExplorerPage(): JSX.Element {
    const [jobs, setJobs] = useState<JobInfoResponse[] | null>(null);
    const [isFetchingJobs, setIsFetchingJobs] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const history = useHistory();

    useEffect(() => {
        setIsFetchingJobs(true);

        fetchAllJobs()
            .then(setJobs)
            .catch(setError)
            .finally(() => setIsFetchingJobs(false));
    }, []);

    console.log(isFetchingJobs, jobs, error);
    
    return (
        <div className="JobsExplorerPage">
            <Typography variant="h5" gutterBottom style={{ marginLeft: "16px" }}>
                Список задач
            </Typography>
            <List>
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
                            Открыть
                        </Button>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
