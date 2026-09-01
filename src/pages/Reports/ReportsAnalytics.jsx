import React, { useState } from "react";
import "./ReportsAnalytics.css";
import HRLayout from "../../layouts/HRLayout";
import { exportToPDF } from "../../utils/exportPdf";
import { exportToExcel } from "../../utils/exportExcel";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ReportsAnalytics() {
  const [period, setPeriod] = useState("Last 6 months");
  const [department, setDepartment] = useState("All Departments");

  const employeeGrowthData = [
    { month: "Jan", employees: 98 },
    { month: "Feb", employees: 102 },
    { month: "Mar", employees: 105 },
    { month: "Apr", employees: 108 },
    { month: "May", employees: 112 },
    { month: "Jun", employees: 115 },
  ];

  const salaryData = [
    { dept: "Eng", salary: 95000 },
    { dept: "Sales", salary: 72000 },
    { dept: "HR", salary: 68000 },
    { dept: "Fin", salary: 85000 },
    { dept: "Mktg", salary: 70000 },
  ];

  const attendanceData = [
    { month: "Jan", attendance: 88 },
    { month: "Feb", attendance: 91 },
    { month: "Mar", attendance: 85 },
    { month: "Apr", attendance: 93 },
    { month: "May", attendance: 89 },
    { month: "Jun", attendance: 94 },
  ];

  return (
    <HRLayout title="Reports & Analytics" breadcrumb="Reports">
      <div className="reports-page-container">
        <div className="reports-filter-bar">
          <select className="reports-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>Last 6 months</option>
            <option>Last year</option>
            <option>Custom range</option>
          </select>

          <select className="reports-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Marketing</option>
          </select>

          <button className="reports-export-btn" onClick={exportToPDF}>📄 Export PDF</button>
          <button className="reports-export-btn" onClick={exportToExcel}>📊 Export Excel</button>
        </div>

        <div id="reports-container" className="reports-grid">
          <div className="reports-chart-card">
            <h3>Employee Growth Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={employeeGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="employees" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="reports-chart-card">
            <h3>Salary Distribution by Dept</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dept" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="salary" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="reports-chart-card">
            <h3>Monthly Attendance %</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="reports-chart-card">
            <h3>Quick Reports</h3>
            <div className="reports-quick-grid">
              <button className="reports-quick-btn" onClick={() => alert("Generating Employee Report...")}>Employee Report →</button>
              <button className="reports-quick-btn" onClick={() => alert("Generating Attendance Report...")}>Attendance Report →</button>
              <button className="reports-quick-btn" onClick={() => alert("Generating Leave Report...")}>Leave Report →</button>
              <button className="reports-quick-btn" onClick={() => alert("Generating Payroll Report...")}>Payroll Report →</button>
              <button className="reports-quick-btn" onClick={() => alert("Generating Attrition Report...")}>Attrition Report →</button>
              <button className="reports-quick-btn" onClick={() => alert("Generating Dept Performance...")}>Dept Performance →</button>
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}