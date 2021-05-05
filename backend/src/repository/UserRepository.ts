import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY must be provided as environmental variable");
}

const SALT_ROUNDS = 10;
const ACCESS_EXPIRED_IN = "1h";

type JWTPayload = {
    login: string
};

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async findByLogin(login: string): Promise<User | null> {
        return await this.findOne({ login }) || null;
    }

    async createUser(login: string, password: string, isAdmin: boolean): Promise<User> {
        const user = await this.findByLogin(login);
    
        if (user) {
            throw new Error("User is already exist.");
        }
    
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        const newUser = new User();
        newUser.login = login;
        newUser.isAdmin = isAdmin;
        newUser.passwordHash = passwordHash;
        newUser.memberedClusters = [];
        newUser.jobs = [];
        newUser.ownClusters = [];
    
        await this.save(newUser);

        return newUser;
    }

    async generateToken(login: string, password: string): Promise<string> {
        const user = await this.findByLogin(login);
    
        if (!user) {
            throw new Error("Invalid credentials.");
        }
    
        const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordIsValid) {
            throw new Error("Invalid credentials.");
        }
    
        const token = jwt.sign(
            { login } as JWTPayload,
            SECRET_KEY,
            { expiresIn: ACCESS_EXPIRED_IN }
        );

        return token;
    }

    async getUserByToken(token: string): Promise<User | null> {
        try {
            const { login } = jwt.verify(token, SECRET_KEY) as JWTPayload;
            if (!login) {
                return null;
            }

            return this.findByLogin(login);
        }
        catch (err) {
            console.error(err);
            return null;
        }
    }
}
