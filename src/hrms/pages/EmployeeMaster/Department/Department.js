// src/hrms/pages/Department/DepartmentApi.js
import Api from "../../../services/api";

const DepartmentApi = {
  // ✅ Get all departments
  getAll: () => Api.get("/department/getAllDepartments"),

  // ✅ Get department by ID
  getById: (id) => Api.get(`/department/getDepartmentById/${id}`),

  // ✅ Create new department
  create: (data) => Api.post("/department/createDepartment", data),

  // ✅ Update department
  update: (id, data) => Api.put(`/department/updateDepartment/${id}`, data),

  // ✅ Delete department
  delete: (id) => Api.delete(`/department/deleteDepartment/${id}`),
};

export default DepartmentApi;
