import express from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../../repository/UserRepository";

export default async function withUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) {
    const accessToken = request.cookies["access-token"];
    const user = await getCustomRepository(UserRepository).getUserByToken(accessToken);

    if (!user) {
        response.sendStatus(401);
        return;
    }

    response.locals.user = user;
    next();
}
