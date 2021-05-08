import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Terminal from "../../components/Terminal";
import { fetchJob, JobResponse, subscribeJobOutput, unsubscribeJobOutput } from "../../remote/job";
import "./JobPage.scss";

export default function JobPage(): JSX.Element {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<JobResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isFetchingJob, setIsFecthingJob] = useState(false);

    useEffect(() => {
        setIsFecthingJob(true);
        fetchJob(jobId)
            .then((j) => {
                setJob(j);
                if (j.status !== "in-process") {
                    return;
                }
                subscribeJobOutput(
                    j.id,
                    (prevOutput) => setJob(
                        (currJob) => currJob && { ...currJob, output: prevOutput }
                    ),
                    (output) => setJob(
                        (currJob) => currJob && { ...currJob, output: currJob.output + output }
                    )
                );
            })
            .catch(setError)
            .finally(() => setIsFecthingJob(false));
        
        return () => unsubscribeJobOutput(jobId);
    }, [jobId]);

    return (
        <div className="JobPage">
            <Typography variant="h5" gutterBottom>
                Job's output
            </Typography>
            <div className="JobPage-TerminalContainer">
                <Terminal stdout={job?.output || ""} />
            </div>
        </div>
    );
}
