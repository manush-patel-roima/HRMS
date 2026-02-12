import axiosInstance from "../../api/axiosInstance";

class TravelService {
  static getTravels(){ 
    return axiosInstance.get("/api/travels");
  }

  static createTravel(data) {
    return axiosInstance.post("/api/travels", data);
  }

  static uploadDocument(formData) {
    return axiosInstance.post("/api/travels/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }

}

export default TravelService;
