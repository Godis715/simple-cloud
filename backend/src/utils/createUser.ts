import "reflect-metadata";
import { createConnection, getCustomRepository } from "typeorm";
import { UserRepository } from "../repository/UserRepository";

const conn = createConnection();

const args = process.argv.slice(2);

if (args.length !== 3 && args.length !== 2) {
    throw new Error(`Expected 2 or 3 arguments, but got ${args.length}`);
}

const [login, password, role] = process.argv.slice(2);

if (role && role !== "--admin") {
    throw new Error(`3d argument is expected to be '--admin', but got ${role}`);
}

(async () => {
    try {
        await conn;
        const userRepository = getCustomRepository(UserRepository);
        const user = await userRepository.createUser(login, password, Boolean(role));
        console.log(`User '${user.login}' was successfully created`);
    }
    catch (err) {
        console.error("Couldn't create user", err);
    }
})();
