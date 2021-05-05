if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY wasn't provided");
}

export const SECRET_KEY = process.env.SECRET_KEY;

if (!process.env.SSH_PRIVATE_KEY_PATH) {
    throw new Error("SSH_PRIVATE_KEY_PATH wasn't provided");
}

export const SSH_PRIVATE_KEY_PATH = process.env.SSH_PRIVATE_KEY_PATH;
