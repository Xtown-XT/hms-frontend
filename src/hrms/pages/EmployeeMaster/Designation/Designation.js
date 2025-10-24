// src/hrms/pages/Role/RoleApi.js
import Api from "../../../services/api";

const RoleApi = {
  // ✅ Get all roles
  getAll: () => Api.get("role/getAllRoles"),

  // ✅ Create new role / designation
  create: (data) => Api.post("role/createRole", data),

  // ✅ Update role
  update: (id, data) => Api.put(`/role/updateRole/${id}`, data),

  // ✅ Delete role
  delete: (id) => Api.delete(`/role/deleteRole/${id}`),
};

export default RoleApi;
