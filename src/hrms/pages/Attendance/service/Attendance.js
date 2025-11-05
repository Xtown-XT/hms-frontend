// src/services/attendanceService.js
import axios from "axios";
import api from "../../../services/api"; // Adjust the path as necessary


// Attendance API methods
// ✅ FIX: make sure spelling matches backend route
const attendanceService = {
  getAll: (params = {}) => api.get("/attendance/getAllAttendance", { params }),

  getById: (employeeId, date) =>
    api.get(`/attendance/getAttendance/${employeeId}`, { params: { date } }),

  create: (record) => api.post("/attendance/createAttendance", record),

  update: (employeeId, date, record) =>
    api.put(`/attendance/updateAttendance/${employeeId}`, { ...record, date }),

  delete: (employeeId, date) =>
    api.delete(`/attendance/deleteAttendance/${employeeId}`, { data: { date } }),

  deleteAll: () => api.delete("/attendance/deleteAllAttendance"),
};

export default attendanceService;
