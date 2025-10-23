

// Staff Record API methods
const staffRecordService = {
  // ✅ Get all staff records
  getAll: (params = {}) => {
    return api.get("/staff/getAllStaff", { params }); // Example endpoint
  },

  // ✅ Get a single staff record by ID
  getById: (staffId) => {
    return api.get(`/staff/getStaffById/${staffId}`);
  },

  // ✅ Create a new staff record
  create: (staffData) => {
    return api.post("/staff/createStaff", staffData);
  },

  // ✅ Update existing staff record
  update: (staffId, updatedData) => {
    return api.put(`/staff/updateStaff/${staffId}`, updatedData);
  },

  // ✅ Delete a single staff record
  delete: (staffId) => {
    return api.delete(`/staff/deleteStaff/${staffId}`);
  },

  // ✅ Delete all staff records (use with caution)
  deleteAll: () => {
    return api.delete("/staff/deleteAllStaff");
  },
};

export default staffRecordService;
