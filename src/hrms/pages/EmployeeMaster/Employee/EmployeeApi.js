// src/hrms/pages/Employee/EmployeeApi.js
import Api from "../../../services/api";

const EmployeeApi = {
  // ✅ Get all employees
  getAll: (params) => Api.get("/employee/getAllEmployees", { params }),

  // ✅ Get employee by ID
  getById: (id) => Api.get(`/employee/getEmployeeById/${id}`),

  // ✅ Create new employee
  create: (data) => Api.post("/employee/createEmployee", data),

  // ✅ Update employee info
  update: (id, data) => Api.put(`/employee/updateEmployeeInfo/${id}`, data),

  // ✅ Delete employee
  delete: (id) => Api.delete(`/employee/deleteEmployee/${id}`),
};

export default EmployeeApi;
