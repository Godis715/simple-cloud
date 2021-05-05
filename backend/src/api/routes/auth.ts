import express from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../../repository/UserRepository";

const authRouter = express.Router();

type LoginRequestBody = {
    login: string,
    password: string
};

authRouter.post<never, never, LoginRequestBody>("/login", async (
    request,
    response
) => {
    const { login, password } = request.body;
    const userRepository = getCustomRepository(UserRepository);

    try {
        const token = await userRepository.generateToken(login, password);
        response
            .cookie("access-token", token, {
                maxAge: 86_400_000,
                httpOnly: true
            })
            .sendStatus(200);
    }
    catch (err) {
        console.error("[Server::login::error]: ", err);
        response.sendStatus(401);
    }
});

type VerifyTokenResponseBody = {
    isAdmin: boolean;
};

authRouter.get<never, VerifyTokenResponseBody>("/verify-token", async (
    request,
    response
) => {
    const token = request.cookies["access-token"];
    if (!token) {
        response.sendStatus(401);
        return;
    }

    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.getUserByToken(token);

    if (!user) {
        response.sendStatus(401);
    }
    else {
        response
            .status(200)
            .send({
                isAdmin: user.isAdmin
            });
    }
});

export default authRouter;
