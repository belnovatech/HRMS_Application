// import axios from "axios";

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
// });

// export const getDashboard = () =>
//   API.get("/payroll/dashboard");

// export const calculatePayroll = (data) =>
//   API.post("/payroll/calculate", data);

// export const processPayroll = (data) =>
//   API.post("/payroll/process", data);

// export const getPayslips = () =>
//   API.get("/payroll/payslips");

// export const getHistory = () =>
//   API.get("/payroll/history");

import api from "../api/axiosInstance";

// Get payslip for a single employee (calculates fresh)
export const getPayslipByEmployee = (empId) =>
  api.get(`/payroll/calculate/${empId}`);

// Calculate payroll for all employees
export const calculateAllPayroll = () =>
  api.get("/payroll/calculate-all");

// Get all payslips (list)
export const getAllPayslips = () =>
  api.get("/payroll/payslips");

// Get a single payslip by its ID
export const getPayslipById = (payslipId) =>
  api.get(`/payroll/${payslipId}`);

// Get all payslips for one employee (history per employee)
export const getEmployeePayslips = (empId) =>
  api.get(`/payroll/employee/${empId}`);

// Get current logged-in employee's monthly payslip
export const getMonthlyPayslip = () =>
  api.get("/payroll/employee/monthly");