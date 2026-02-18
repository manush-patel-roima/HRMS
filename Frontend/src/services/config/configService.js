import axiosInstance from "../../api/axiosInstance";

class ConfigService {

  static listConfigs() {
    return axiosInstance.get("/api/config");
  }

  static createConfig(data) {
    return axiosInstance.post("api/config",data);
  }

  static updateConfig(key, data) {
    return axiosInstance.put(`/api/config/${key}`, data);
  }
}

export default ConfigService;