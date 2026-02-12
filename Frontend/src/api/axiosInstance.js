import axios from "axios";
import AuthService from "../services/auth/authService";

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
            if(AuthService.isTokenExpired(token)){
                AuthService.logout();
                return Promise.reject("Token expired");
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
        if(error.response) {
            const status = error.response.status;

            if (status === 401 || status === 403) {
                AuthService.logout();
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;