import axios from "axios";
import { REACT_APP_API_URL } from "../config";

const axiosInst = axios.create({
    baseURL: REACT_APP_API_URL,
    withCredentials: true
});

export async function login(login: string, password: string): Promise<void> {
    await axiosInst.post("/auth/login", { login, password });
}

export async function verifyToken(): Promise<void> {
    await axiosInst.get("/auth/verify-token");
}
