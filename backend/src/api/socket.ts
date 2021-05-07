import { getCustomRepository } from "typeorm";
import { Server } from "socket.io";
import cookie from "cookie";
import { UserRepository } from "../repository/UserRepository";
import { handleSubscribeJobOutput, handleUnsubscribeJobOutput } from "./listeners/job";
import server from "./server";

const io = new Server(server);

io.on("connection", async (socket) => {
    const cookies = socket.handshake.headers.cookie
        ? cookie.parse(socket.handshake.headers.cookie)
        : {};
    console.log("[Server::onSocketConnect]: cookies", cookies);

    const token = cookies["access-token"];
    if (!token) {
        return;
    }

    const user = await getCustomRepository(UserRepository).getUserByToken(token);
    if (!user) {
        return;
    }
    
    socket.on("subscribe-job-output", (data) => handleSubscribeJobOutput(socket, user, data));

    socket.on("unsubscribe-job-output", (data) => handleUnsubscribeJobOutput(socket, user, data));
});

export default io;
