// // src/hrms/pages/Employee/EmployeeApi.js
// import Api from "../../../../hrms/services/api";

// const EmployeeApi = {
//   // ✅ Get all employees
//   // getAll: (params) => Api.get("/employee/getAllEmployees", { params }),

//   // ✅ Get employee by ID
//   // getById: (id) => Api.get(`/employee/getEmployeeById/${id}`),

//   // ✅ Create new employee
//   create: (data) => Api.post("/employee/createEmployee", data),

//   // // ✅ Update employee info
//   // update: (id, data) => Api.put(`/employee/updateEmployeeInfo/${id}`, data),

//   // ✅ Delete employee
//   // delete: (id) => Api.delete(`/employee/deleteEmployee/${id}`),
// };

// export default EmployeeApi;



// import Api from "../../../../hrms/services/api";
// import authContext from '../../../services/Authucontext.js'

// const EmployeeApi = {
//   getAll: (params) => Api.get("/employee/getAllEmployees", { params }),
//   getById: (id) => Api.get(`/employee/getEmployeeById/${id}`),
//   create: (data) => Api.post("/employee/createEmployee", data),
//   update: (id, data) => Api.put(`/employee/updateEmployeeInfo/${id}`, data),
//   delete: (id) => Api.delete(`/employee/deleteEmployee/${id}`),
// };

// export default EmployeeApi;
// src/hrms/pages/EmployeeMaster/Employee/EmployeeApi.js
// ✅ EmployeeApi.js
// import api from "../../../services/api.js"; // adjust path if needed

// const EmployeeApi = {
//   // ✅ Create new employee
//   create: (data) => api.post("employee/createEmployee", data),

//   // ✅ Get all employees (fixed for preflight + cache issues)
//   getAll: async () => {
//     try {
//       // use ?cb=timestamp to prevent caching issues
//       const res = await api.get(`employee/getAllEmployees?cb=${Date.now()}`);

//       console.log("✅ EmployeeApi.getAll response:", res.data);

//       // handle multiple possible backend formats safely
//       if (Array.isArray(res.data)) return res.data;
//       if (Array.isArray(res.data?.employees)) return res.data.employees;
//       if (Array.isArray(res.data?.data)) return res.data.data;
//       if (res.data?.data?.employees) return res.data.data.employees;

//       console.warn("⚠️ Unexpected response format:", res.data);
//       return [];
//     } catch (err) {
//       console.error("❌ Error in EmployeeApi.getAll:", err);
//       throw err;
//     }
//   },

//   // ✅ Update employee by ID
//   update: (id, data) => api.put(`employee/updateEmployee/${id}`, data),

//   // ✅ Delete employee by ID
//   delete: (id) => api.delete(`employee/deleteEmployee/${id}`),
// };

// export default EmployeeApi;


import api from "../../../services/api.js"; // adjust path if needed

const EmployeeApi = {
  // ✅ Create employee
  create: (data) => api.post("employee/createEmployee", data),

  // ✅ Get all employees (simple GET request)
  getAll: () => api.get("employee/getAllEmployees"),

  // ✅ Update employee by ID
  update: (id, data) => api.put(`employee/updateEmployee/${id}`, data),

  // ✅ Delete employee by ID
  delete: (id) => api.delete(`employee/deleteEmployee/${id}`),
};

export default EmployeeApi;



