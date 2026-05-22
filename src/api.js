import axios from "axios";

const api = axios.create({
  baseURL: "https://blogapp-back-y39f.onrender.com",
  withCredentials: true,
});

export default api;
