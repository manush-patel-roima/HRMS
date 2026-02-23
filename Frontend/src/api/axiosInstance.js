import axios from "axios";
import AuthService from "../services/auth/authService";
import { handleApiError } from "../utils/errorHandler";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = AuthService.getToken();

        if (token) {
            if (AuthService.isTokenExpired(token)) {
                AuthService.logout();
                window.location.href = '/login';
                return Promise.reject(new Error("Token expired"));
            }
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return handleApiError(error);
    }
);

export default axiosInstance;