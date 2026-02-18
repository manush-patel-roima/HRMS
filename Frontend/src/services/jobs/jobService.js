import axiosInstance from "../../api/axiosInstance";

class JobService {

  static listJobs() {
    return axiosInstance.get("/api/jobs");
  }

  static createJob(formData) {
    return axiosInstance.post("/api/jobs", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

  static deactivateJob(jobId) {
    return axiosInstance.put(`/api/jobs/${jobId}/deactivate`);
  }

  static shareJob(data) {
    return axiosInstance.post("/api/jobs/share", data);
  }

  static referJob(formData) {
    return axiosInstance.post("/api/jobs/refer", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

  static listMyReferrals() {
    return axiosInstance.get("/api/jobs/my-referrals");
  }

  static listAllReferrals() {
    return axiosInstance.get("/api/jobs/referrals");
  }

  static updateReferralStatus(id, data) {
    return axiosInstance.put(`/api/jobs/referrals/${id}`, data);
  }
}

export default JobService;