import Typography from '@material-ui/core/Typography/Typography';
import React, { useEffect, useState } from 'react';
import AuthPage from '../pages/AuthPage';
import { verifyToken } from '../remote/auth';
import './App.scss';

function App() {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
        verifyToken()
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false));
    }, []);

    return (
        <div className="App">
            {isAuth === null && (
                <Typography>Загрузка...</Typography>
            )}
            {isAuth && (
                <Typography>Вход выполнен!</Typography>
            )}
            {isAuth === false && (
                <AuthPage
                    onSubmitSuccess={() => setIsAuth(true)}
                />
            )}
        </div>
    );
}

export default App;
