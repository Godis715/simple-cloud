import React, { useState } from "react";
import TextField from "@material-ui/core/TextField/TextField";
import { login as apiLogin } from "../remote/auth";
import Button from "@material-ui/core/Button/Button";
import "./AuthPage.scss";
import Typography from "@material-ui/core/Typography";

type Props = {
    onSubmitSuccess: () => void
}

export default function AuthPage(props: Props): JSX.Element {
    const {
        onSubmitSuccess
    } = props;

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        if (!login || !password) {
            return;
        }

        apiLogin(login, password)
            .then(onSubmitSuccess)
            .catch((err) => console.log("Cannot login :(", err));
    };

    return (
        <div className="AuthPage">
            <div className="AuthPage-AuthPanel">
                <Typography variant="h4" gutterBottom>Simple Cloud</Typography>
                <Typography fontSize={18} gutterBottom>Войдите в систему</Typography>

                <TextField
                    className="AuthPage-Login"
                    id="login"
                    size="small"
                    label="Логин"
                    value={login}
                    onChange={(ev) => setLogin(ev.target.value)}
                />
                <TextField
                    className="AuthPage-Password"
                    id="password"
                    size="small"
                    label="Пароль"
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                />

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!login || !password}
                    className="AuthPage-Submit"
                >
                    Войти
                </Button>
            </div>
        </div>
    );
}
