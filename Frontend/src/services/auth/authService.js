import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../api/axiosInstance";

class AuthService {

    static async login(email,password) {
        const response = await axiosInstance.post("/api/auth/login",{email,password});
        const {token,role} = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        const decoded = jwtDecode(token);
        localStorage.setItem("employeeId", decoded.employeeId || "");

        return response.data;
    }

    static logout() {
        localStorage.clear();
    }

    static getToken() {
        return localStorage.getItem("token");
    }

    static getRole() {
        return localStorage.getItem("role");
    }

    static isTokenExpired(token) {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (err) {
            return true;
        }
    }

    static isAuthenticated() {
        const token = this.getToken();

        if (!token) return false;

        if (this.isTokenExpired(token)) {
            this.logout();
            return false;
        }

        return true;
    }
}

export default AuthService;