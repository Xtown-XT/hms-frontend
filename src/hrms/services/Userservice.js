// import api from "../../hrms/services/api";

// export const userService = {
//   register: async (data) => {
//     const response = await api.post("/user/user/register", data);
//     return response.data;
//   },

//   login: async (data) => {
//     const response = await api.post("/user/user/login", data);
//     return response.data; // ✅ only returning the data object
//   },
//   logout: async () => {
//     try {
//       // ✅ Optional API call if your backend supports logout
//       await api.post("user/user/logout");

//       // ✅ Clear localStorage and redirect
//       localStorage.removeItem("token");
//       // localStorage.removeItem("user");

//       // Redirect handled outside
//       return { success: true, message: "Logged out successfully" };
//     } catch (error) {
//       console.error("Logout failed:", error);
//       return { success: false, message: "Logout failed" };
//     }
//   },

//   getAllUsers: async () => {
//     const response = await api.get("/user/user");
//     return response.data;
//   },
// };




// import api from "../../hrms/services/api";

// export const userService = {
//   // ✅ Register new user
//   register: async (data) => {
//     try {
//       const response = await api.post("/user/user/register", data);
//       return response.data;
//     } catch (error) {
//       console.error("Registration error:", error.response?.data || error.message);
//       return error.response?.data || { success: false, message: "Registration failed" };
//     }
//   },

//   // ✅ Login user
//   login: async (data) => {
//     try {
//       const response = await api.post("/user/user/login", data);
//       return response.data;
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//       return error.response?.data || { success: false, message: "Login failed" };
//     }
//   },

//   // ✅ Logout user (with backend + token cleanup)
//   logout: async () => {
//     try {
//       // Send logout request to backend
//       const response = await api.post("/user/user/logout");

//       // Remove local storage token regardless of API success
//       localStorage.removeItem("token");
//       // localStorage.removeItem("user"); // uncomment if you store user data

//       return response.data || { success: true, message: "Logged out successfully" };
   
//     } catch (error) {
//       console.error("Logout error:", error.response?.data || error.message);

//       // Always remove token to ensure forced logout
//       localStorage.removeItem("token");

//       return error.response?.data || { success: false, message: "Logout failed" };
//     }
//   },

//   // ✅ Fetch all users
//   getAllUsers: async () => {
//     try {
//       const response = await api.get("/user/user");
//       return response.data;
//     } catch (error) {
//       console.error("Get users error:", error.response?.data || error.message);
//       return error.response?.data || { success: false, message: "Failed to fetch users" };
//     }
//   },
// };


import { message } from "antd";
import api from "../../hrms/services/api";

export const userService = {
  // ✅ Register new user
  register: async (data) => {
    try {
      const response = await api.post("/user/user/register", data);
      message.success(response.data.message || "User registered successfully!");
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Registration failed!";
      message.error(errorMsg);
      return error.response?.data || { success: false, message: errorMsg };
    }
  },

  // ✅ Login user
  login: async (data) => {
    try {
      const response = await api.post("/user/user/login", data);

      // Save token if present
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      message.success(response.data.message || "Login successful!");
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Login failed!";
      message.error(errorMsg);
      return error.response?.data || { success: false, message: errorMsg };
    }
  },

  // ✅ Logout user (with backend + token cleanup)
  logout: async () => {
    try {
      const response = await api.post("/user/user/logout");
      localStorage.removeItem("token");

      const successMsg = response.data?.message || "Logged out successfully!";
      message.success(successMsg);

      return response.data || { success: true, message: successMsg };
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      localStorage.removeItem("token");

      const errorMsg = error.response?.data?.message || "Logout failed!";
      message.error(errorMsg);

      return error.response?.data || { success: false, message: errorMsg };
    }
  },

  // ✅ Fetch all users
  getAllUsers: async () => {
    try {
      const response = await api.get("/user/user");
      message.success("Users fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("Get users error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Failed to fetch users!";
      message.error(errorMsg);
      return error.response?.data || { success: false, message: errorMsg };
    }
  },
};
