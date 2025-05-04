import axios from "axios";
const API_URL = "http://localhost:1010";
export const api = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: false,
});
