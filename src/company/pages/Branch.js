// src/hrms/pages/Branch/BranchApi.js
import Api from "../services/Api";

const BranchApi = {
  // ✅ Get all branches
  getAll: () => Api.get("/branch/getAllBranches"),

  // ✅ Get branch by ID
  getById: (id) => Api.get(`/branch/getBranchById/${id}`),

  // ✅ Create new branch
  create: (data) => Api.post("/branch/createBranch", data),

  // ✅ Update branch
  update: (id, data) => Api.put(`/branch/updateBranch/${id}`, data),

  // ✅ Delete branch
  delete: (id) => Api.delete(`/branch/deleteBranch/${id}`),
};

export default BranchApi;
