import axios from "axios";
import { REACT_APP_API_URL } from "../config";

export default axios.create({
    baseURL: REACT_APP_API_URL,
    withCredentials: true
});
