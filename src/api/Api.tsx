import axios from "axios";

export const API_URL =
  "https://dextox-f9ajbedgghgvf7an.malaysiawest-01.azurewebsites.net";
 const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("accessToken");
    if(!access_token) {
      return config;
    }
    if (access_token) {
      config.headers?.set("Authorization", `Bearer ${access_token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;