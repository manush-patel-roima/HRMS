import axiosInstance from "../../api/axiosInstance";
import { showSuccessToast } from "../../utils/toastUtils";

class JobService {

  static listJobs() {
    return axiosInstance.get("/api/jobs");
  }

  static createJob(formData) {
    return axiosInstance.post("/api/jobs", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      showSuccessToast('Job created successfully!');
      return res;
    });
  }

  static deactivateJob(jobId) {
    return axiosInstance.put(`/api/jobs/${jobId}/deactivate`).then(res => {
      showSuccessToast('Job deactivated successfully!');
      return res;
    });
  }

  static shareJob(data) {
    return axiosInstance.post("/api/jobs/share", data).then(res => {
      showSuccessToast('Job shared successfully!');
      return res;
    });
  }

  static referJob(formData) {
    return axiosInstance.post("/api/jobs/refer", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      showSuccessToast('Job referral submitted successfully!');
      return res;
    });
  }

  static listMyReferrals() {
    return axiosInstance.get("/api/jobs/my-referrals");
  }

  static listAllReferrals() {
    return axiosInstance.get("/api/jobs/referrals");
  }

  static updateReferralStatus(id, data) {
    return axiosInstance.put(`/api/jobs/referrals/${id}`, data).then(res => {
      showSuccessToast('Referral status updated successfully!');
      return res;
    });
  }
}

export default JobService;