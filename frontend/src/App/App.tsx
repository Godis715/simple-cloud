import Typography from '@material-ui/core/Typography/Typography';
import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { verifyToken } from '../remote/auth';
import AuthPage from '../pages/AuthPage/AuthPage';
import JobsExplorerPage from '../pages/JobsExplorerPage/JobsExplorerPage';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
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
                    <div>Обзор кластеров</div>
                </Route>
                <Route exact path="/cluster/:clusterId">
                    <div>Настройка кластера</div>
                </Route>
                <Route exact path="/job">
                    <JobsExplorerPage />
                </Route>
                <Route exact path="/job/:jobId">
                    <div>Просмотр результата выполнения задачи</div>
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
                        <Typography>Кластеры</Typography>
                    </ListItem>
                    <ListItem button onClick={() => history.push("/job")}>
                        <Typography>Задачи</Typography>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button>
                        <Typography>Выход</Typography>
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
                <Typography>Загрузка...</Typography>
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
