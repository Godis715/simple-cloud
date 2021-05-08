import Typography from '@material-ui/core/Typography/Typography';
import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { logout, verifyToken } from '../remote/auth';
import AuthPage from '../pages/AuthPage/AuthPage';
import JobsExplorerPage from '../pages/JobsExplorerPage/JobsExplorerPage';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import JobPage from '../pages/JobPage/JobPage';
import ClustersExplorerPage from '../pages/ClustersExplorerPage/ClustersExplorerPage';
import ClusterPage from '../pages/ClusterPage/ClusterPage';
import './App.scss';

function App() {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const history = useHistory();

    useEffect(() => {
        verifyToken()
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false));
    }, []);

    const renderRoutes = () => {
        return (
            <Switch>
                <Route exact path="/cluster">
                    <ClustersExplorerPage />
                </Route>
                <Route exact path="/cluster/:clusterId">
                    <ClusterPage />
                </Route>
                <Route exact path="/job">
                    <JobsExplorerPage />
                </Route>
                <Route exact path="/job/:jobId">
                    <JobPage />
                </Route>
                <Route path="*">
                    <Redirect to="/job" />
                </Route>
            </Switch>
        );
    };

    const renderSidebar = () => {
        return (
            <Drawer style={{ width: "256px" }} variant="permanent">
                <Typography variant="h5" className="App-Title">
                    Simple Cloud
                </Typography>
                <Divider />
                <List>
                    <ListItem button onClick={() => history.push("/cluster")}>
                        <Typography>Clusters</Typography>
                    </ListItem>
                    <ListItem button onClick={() => history.push("/job")}>
                        <Typography>Jobs</Typography>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={() => {
                        logout().then(() => setIsAuth(false));
                    }}>
                        <Typography>Log out</Typography>
                    </ListItem>
                </List>
            </Drawer>
        );
    };

    return (
        <div className="App">
            {isAuth === false && (
                <AuthPage
                    onSubmitSuccess={() => setIsAuth(true)}
                />
            )}
            {isAuth === null && (
                <Typography>Loading...</Typography>
            )}
            {isAuth && (
                <>
                    {renderSidebar()}
                    {renderRoutes()}

                </>
            )}
        </div>
    );
}

export default App;
