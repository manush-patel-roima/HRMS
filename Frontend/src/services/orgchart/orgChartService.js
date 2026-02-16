import axiosInstance from "../../api/axiosInstance";
import AuthService from "../auth/authService";

class OrgChartService {
    static getOrgChart(employeeId){
        return axiosInstance.get(`/api/orgchart/${employeeId}`);
    }
    

    static getMyOrgChart(){
        return axiosInstance.get("/api/orgchart/me");
    }

    static getAllEmployees(){
        return axiosInstance.get("/api/employees/all");
    }
}


export default OrgChartService;