import axios from "axios";

const api = axios.create({
  baseURL: "http://10.194.182.67:4001/hrms_api/v1/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// // Request interceptor
// Api.interceptors.request.use(
//   (config) => {

//     const token =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6Ilh0b3duIiwibGFzdF9uYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsIm1vYmlsZSI6Ijk4NzQ1NjMyMTAiLCJjb21wYW55X2lkIjpudWxsLCJicmFuY2hfaWQiOm51bGwsImRlcGFydG1lbnRfaWQiOm51bGwsImRpdmlzdGlvbl9pZCI6bnVsbCwicm9sZV9pZCI6MSwiaXNfYWN0aXZlIjp0cnVlLCJ0b2tlbiI6bnVsbCwidXNlcl9hZ2VudCI6bnVsbCwic3VibW9kdWwiOm51bGwsImNyZWF0ZWRfYnkiOjAsInVwZGF0ZWRfYnkiOjAsImNyZWF0ZWRfYXQiOiIyMDI1LTA2LTA1VDA4OjQzOjQwLjYyMloiLCJ1cGRhdGVkX2F0IjoiMjAyNS0wNi0wNVQwODo0Mzo0MC42MjJaIiwiZGVsZXRlZF9hdCI6bnVsbCwiZGVsZXRlZF9ieSI6bnVsbCwiaWF0IjoxNzQ5MTIzNTUzLCJleHAiOjE3NDkxMjcxNTN9.dkkEqR_OPxIL6Q1CikGhV7644Lvr_6nARc2qiKSaOa8";

//     // If token exists, add to headers
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// Api.interceptors.response.use(
//   (response) => {
//     // Handle success responses (2xx)
//     return response;
//   },
//   (error) => {
//     // Handle error responses
//     // handleApiError(error);
//     return Promise.reject(error);
//   }
// );

// // API methods
// export const authService = {
//   login: (credentials) => Api.post("/auth/login", credentials),
//   register: (userData) => Api.post("/auth/register", userData),
//   logout: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   },
//   getCurrentUser: () => {
//     const user = localStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
//   },
// };
export default api;

