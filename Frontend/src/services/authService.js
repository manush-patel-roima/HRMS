import axiosInstance from "../api/axiosInstance";


const login = async (email, password) => {
  const response = await axiosInstance.post("/api/auth/login", { email, password,});
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
};

const getToken = () => {
  return localStorage.getItem("token");
};

const getRole = () => {
  return localStorage.getItem("role");
};

export default {
  login,
  logout,
  getToken,
  getRole,
};
