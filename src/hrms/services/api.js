// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://192.168.1.18:4001/hrms_api/v1",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// api.interceptors.request.use((config) => {
//   const token = localStorage.setItem("token", response.data.token);
//  // or sessionStorage
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.18:4001/hrms_api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log("🔹 Token being sent:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
