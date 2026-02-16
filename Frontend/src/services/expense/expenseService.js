import axiosInstance from "../../api/axiosInstance";
import AuthService from "../auth/authService";

class ExpenseService{

    static getAssignedTravels(){
        return axiosInstance.get("/api/travels/employee");
    }

    
    static createDraft(formData) {
        return axiosInstance.post("/api/employee/expenses",formData,{
            headers: {
                "Content-Type": "multipart/form-data" 
            } 
        });
    }

    static submitExpense(id) {
        return axiosInstance.put(`/api/employee/expenses/${id}/submit`);
    }

    static getMyExpenses() {
        return axiosInstance.get("/api/employee/expenses");
    }

    static getExpenseDetail(id) {
        return axiosInstance.get(`/api/employee/expenses/${id}`);
    }



    static getTeamExpenses() {
        return axiosInstance.get("/api/manager/expenses");
    }


    
    static filterExpenses(params) {
        return axiosInstance.get("/api/hr/expenses", { params });
    }

    static getHRExpenseDetail(id) {
        return axiosInstance.get(`/api/hr/expenses/${id}`);
    }

    static approveExpense(id) {
        return axiosInstance.put(`/api/hr/expenses/${id}/approve`);
    }

    static rejectExpense(id, remark) {
        return axiosInstance.put(
        `/api/hr/expenses/${id}/reject`,
        { remark }
        );
    }

}


export default ExpenseService;