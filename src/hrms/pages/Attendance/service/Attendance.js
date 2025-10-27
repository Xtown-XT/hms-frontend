// src/services/attendanceService.js
import axios from "axios";
import api from "../../../services/api"; // Adjust the path as necessary


// Attendance API methods
const attendanceService = {
  // Get all attendance records
  getAll: (params = {}) => {
    return api.get("/attandance/getAllAttendance", { params }); // your endpoint
  },

  // Get a single attendance record by employeeId and date
  getById: (employeeId, date) => {
    return api.get(`/attandance/getAttendance/${employeeId}`, { params: { date } });
  },

  // Add a new attendance record
  create: (record) => {
    return api.post("/createAttendance", record);
  },

  // Update an existing attendance record
  update: (employeeId, date, record) => {
    return api.put(`/updateAttendance/${employeeId}`, { ...record, date });
  },

  // Delete a single attendance record
  delete: (employeeId, date) => {
    return api.delete(`/deleteAttendance/${employeeId}`, { data: { date } });
  },

  // Delete all attendance records (use with caution)
  deleteAll: () => {
    return api.delete("/deleteAllAttendance");
  },
};

export default attendanceService;

