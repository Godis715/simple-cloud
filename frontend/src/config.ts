if (!process.env.REACT_APP_API_URL) {
    throw new Error("REACT_APP_API_URL wasn't provided");
}

export const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
