import axiosInstance from "../../api/axiosInstance";
import { showSuccessToast } from "../../utils/toastUtils";

class ConfigService {

  static listConfigs() {
    return axiosInstance.get("/api/config");
  }

  static createConfig(data) {
    return axiosInstance.post("api/config", data).then(res => {
      showSuccessToast('Configuration created successfully!');
      return res;
    });
  }

  static updateConfig(key, data) {
    return axiosInstance.put(`/api/config/${key}`, data).then(res => {
      showSuccessToast('Configuration updated successfully!');
      return res;
    });
  }
}

export default ConfigService;