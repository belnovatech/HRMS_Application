import api from "../api/axiosInstance";

// Dashboard overview
export const getDashboard = () =>
  api.get("/payroll/dashboard");

// Calculate payroll for a single employee
export const calculatePayroll = (empId, period = { month: new Date().getMonth() + 1, year: new Date().getFullYear() }) =>
  api.post(`/payroll/calculate/${empId}`, period);

// Calculate payroll for all employees
export const calculateAllPayroll = (period = { month: new Date().getMonth() + 1, year: new Date().getFullYear() }) =>
  api.post("/payroll/calculate-all", period);

// Process payroll batch
export const processPayroll = (payslipIds) =>
  api.post("/payroll/process", { payslipIds });

// Get all payslips
export const getAllPayslips = () =>
  api.get("/payroll/payslips");

// Get payroll history
export const getHistory = () =>
  api.get("/payroll/history");

// Get a single payslip by ID
export const getPayslipById = (payslipId) =>
  api.get(`/payroll/${payslipId}`);

// Get all payslips for an employee
export const getEmployeePayslips = (empId) =>
  api.get(`/payroll/employee/${empId}`);

// Get monthly payslip for current user
export const getMonthlyPayslip = () =>
  api.get("/payroll/employee/monthly");

// Get salary structure
export const getSalaryStructure = (empId) =>
  api.get(`/payroll/salary/${empId}`);

// Update salary structure
export const updateSalaryStructure = (empId, salaryStructure) =>
  api.put(`/payroll/salary/${empId}`, salaryStructure);