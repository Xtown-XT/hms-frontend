
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://192.168.1.5:4001/hrms_api/v1/",
//   headers: {
//     "Content-Type": "application/json",
//     //  "Content-Type": "multipart/form-data",
//   },
// });

// // ✅ Request interceptor to attach token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token && token !== "undefined" && token !== "null") {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       console.warn("⚠️ No valid token found in localStorage");
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Response interceptor for unauthorized
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.error("❌ Unauthorized — token missing or invalid");
//       // localStorage.removeItem("token");
//       // window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;



// src/hrms/services/api.js


// import axios from "axios";

// const BASE_URL = "http://192.168.1.5:4001/hrms_api/v1/";

// // 🟢 JSON API
// export const api = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// // 🟠 FormData API
// export const formApi = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "multipart/form-data" },
// });

// // 🔐 Shared token interceptor
// const attachToken = (config) => {
//   const token = localStorage.getItem("token");
//   if (token && token !== "undefined" && token !== "null") {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// };

// api.interceptors.request.use(attachToken);
// formApi.interceptors.request.use(attachToken);

// // 🚫 Handle 401 globally
// const handleUnauthorized = (error) => {
//   if (error.response?.status === 401) {
//     console.error("❌ Unauthorized — token missing or invalid");
//     // localStorage.removeItem("token");
//     // window.location.href = "/login";
//   }
//   return Promise.reject(error);
// };

// api.interceptors.response.use((res) => res, handleUnauthorized);
// formApi.interceptors.response.use((res) => res, handleUnauthorized);

// export default api;


// src/hrms/services/api.js


import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.17:4001/hrms_api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach accessToken for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // ✅ Must match your key in Application tab
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Correct format for backend
      console.log("✅ Token attached:", token);
    } else {
      console.warn("⚠️ No token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle unauthorized (401) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("❌ Unauthorized — invalid or missing token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;


