import { createServer } from "http";
import app from "./express";

const PORT = 8000;
const server = createServer(app);

server.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});

export default server;
