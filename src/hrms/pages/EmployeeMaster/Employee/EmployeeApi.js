// src/api/employee.js
import Api from "./api";

const EmployeeApi = {
  getAll: (params) => Api.get("/getAllEmployees", { params }), // fetch all employees
  getById: (id) => Api.get(`/getEmployeeById/${id}`), // fetch employee by ID
  create: (data) => Api.post("/createEmployee", data), // create new employee
  update: (id, data) => Api.put(`/updateEmployee/${id}`, data), // update employee
  delete: (id) => Api.delete(`/deleteEmployee/${id}`), // delete employee
};

export default EmployeeApi;
