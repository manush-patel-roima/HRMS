import axiosInstance from "../../api/axiosInstance";
import { showSuccessToast } from "../../utils/toastUtils";

class ExpenseService {

    static getAssignedTravels(){
        return axiosInstance.get("/api/travels/employee");
    }

    static createDraft(formData) {
        return axiosInstance.post("/api/employee/expenses", formData, {
            headers: {
                "Content-Type": "multipart/form-data" 
            } 
        }).then(res => {
            showSuccessToast('Expense draft created successfully!');
            return res;
        });
    }

    static submitExpense(id) {
        return axiosInstance.put(`/api/employee/expenses/${id}/submit`).then(res => {
            showSuccessToast('Expense submitted successfully!');
            return res;
        });
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
        return axiosInstance.put(`/api/hr/expenses/${id}/approve`).then(res => {
            showSuccessToast('Expense approved successfully!');
            return res;
        });
    }

    static rejectExpense(id, remark) {
        return axiosInstance.put(
            `/api/hr/expenses/${id}/reject`,
            { remark }
        ).then(res => {
            showSuccessToast('Expense rejected successfully!');
            return res;
        });
    }

}


export default ExpenseService;