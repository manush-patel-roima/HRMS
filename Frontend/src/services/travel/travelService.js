import axiosInstance from "../../api/axiosInstance";
import { showSuccessToast } from "../../utils/toastUtils";

class TravelService {
  static getTravels(){ 
    return axiosInstance.get("/api/travels");
  }

  static createTravel(data) {
    return axiosInstance.post("/api/travels", data).then(res => {
      showSuccessToast('Travel created successfully!');
      return res;
    });
  }

  static uploadDocument(formData) {
    return axiosInstance.post("/api/travels/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }

  static getTravelDocuments(travelId) {
    return axiosInstance.get(`/api/travels/${travelId}/documents`);
  }

  static getAssignedEmployees(travelId){
    return axiosInstance.get(`/api/travels/${travelId}`)
  }

  static getAllEmployees(){
    return axiosInstance.get("/api/employees/all");
  }

  static getAllEmployeesExceptManagerAndHr(){
    return axiosInstance.get("/api/employees");
  }

  static deleteTravel(id) {
      return axiosInstance.delete(`/api/travels/${id}`).then(res => {
        showSuccessToast('Travel deleted successfully!');
        return res;
      });
  }

  static updateTravel(id, data) {
    return axiosInstance.put(`/api/travels/${id}`, data);
  }

  static travelDetails(id) {
    return axiosInstance.get(`/api/travels/travel/${id}`);
  }

}

export default TravelService;
