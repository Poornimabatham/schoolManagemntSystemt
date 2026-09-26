import axios from "axios";

const api = axios.create({
  // baseURL: "https://schoolmanagemntsystem.onrender.com/api",s

  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log(token, "token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
