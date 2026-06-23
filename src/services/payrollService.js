import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const getDashboard = () =>
  API.get("/payroll/dashboard");

export const calculatePayroll = (data) =>
  API.post("/payroll/calculate", data);

export const processPayroll = (data) =>
  API.post("/payroll/process", data);

export const getPayslips = () =>
  API.get("/payroll/payslips");

export const getHistory = () =>
  API.get("/payroll/history");